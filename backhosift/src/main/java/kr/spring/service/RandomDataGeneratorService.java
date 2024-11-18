package kr.spring.service;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.*;
import kr.spring.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import org.springframework.scheduling.annotation.Scheduled;

@Slf4j
@Service
@RequiredArgsConstructor
public class RandomDataGeneratorService {
      private final FlaskService flaskService;
      private final PatientAssignmentService patientAssignmentService;
       private final PatientRepository patientRepository;
       private final VisitRepository visitRepository;
       private final VitalSignsRepository vitalSignsRepository;
       private final LabTestRepository labTestRepository;  // FlaskRepository 대신 LabTestRepository 사용
       private final Random random = new Random();
       
       @Scheduled(fixedRate = 120000) // 2분마다 실행
       @Transactional
       public void scheduleDataGeneration() {
           try {
               log.info("Starting scheduled data generation and processing...");
               List<String> processedChartNums = generateAndProcessCompleteData(1); // 한 명의 데이터만 생성
               
               if (!processedChartNums.isEmpty()) {
                   String chartNum = processedChartNums.get(0);
                   log.info("Scheduled processing completed for chartNum: {}", chartNum);
               }
           } catch (Exception e) {
               log.error("Error in scheduled data generation: ", e);
           }
       }

    @Transactional
    public Patient generateRandomPatient() {
        long age = 20 + random.nextInt(61);
        int birthYear = LocalDateTime.now().getYear() - (int)age;
        String gender = random.nextBoolean() ? "M" : "F";
        
        Patient patient = Patient.builder()
           .subjectId(System.currentTimeMillis() % 1_000_000_000L + random.nextInt(1000)) // 범위를 제한한 ID 생성
            .name(generateRandomName())
            .gender(gender)
            .age(age)
            .birthdate(String.format("%d-%02d-%02d", 
                birthYear, 
                1 + random.nextInt(12), 
                1 + random.nextInt(28)))
            .address(generateRandomAddress())
            .pregnancystatus(determinePregnancyStatus(gender, age))
            .phoneNumber(1000000000L + random.nextInt(900000000))
            .residentNum(generateRandomResidentNumber(birthYear, gender))
            .icd(generateRandomIcdCode())
            .build();
        
        return patientRepository.save(patient);
    }
    
    @Transactional
    public Visit generateRandomVisit(Patient patient) {
        Visit visit = Visit.builder()
           .stayId(System.currentTimeMillis() % 1_000_000_000L)
            .patient(patient)
            .pain(Long.valueOf(random.nextInt(11)))
            .losHours(String.valueOf(random.nextInt(72)))
            .tas(Long.valueOf(1 + random.nextInt(5)))
            .arrivalTransport(Long.valueOf(random.nextInt(2)))
            .visitDate(LocalDateTime.now().minusHours(random.nextInt(24)))
            .staystatus(Long.valueOf(random.nextInt(2)))
            .comment(generateRandomComment())
            .build();
            
        return visitRepository.save(visit);
    }
    
    @Transactional
    public VitalSigns generateRandomVitalSigns(Visit visit) {
        VitalSigns vitalSigns = VitalSigns.builder()
            .chartNum("C" + System.currentTimeMillis())
            .visit(visit)
            .chartTime(LocalDateTime.now())
            .heartrate(Long.valueOf(60 + random.nextInt(41)))
            .resprate(Long.valueOf(12 + random.nextInt(9)))
            .o2sat(String.valueOf(95.0 + random.nextDouble() * 5.0))
            .sbp(Long.valueOf(90 + random.nextInt(51)))
            .dbp(Long.valueOf(60 + random.nextInt(31)))
            .temperature(String.valueOf(36.5 + random.nextDouble() * 1.0))
            .build();
            
        return vitalSignsRepository.save(vitalSigns);
    }
    
    @Transactional
    public LabTest generateRandomLabTest(Visit visit) {
       Long bloodIdx = generateUniqueBloodIdx();
        LocalDateTime now = LocalDateTime.now();

        // LabTest 생성 및 기본 정보 설정
        LabTest labTest = new LabTest();
        labTest.setBloodIdx(bloodIdx);
        labTest.setVisit(visit);
        labTest.setTestTime(now);
        labTest.setRegDate(now);
        labTest.setTestName("Basic Blood Test");
        labTest.setTestUnit("Standard");

        // ChemicalExaminationsEnzymes 생성 및 설정
        ChemicalExaminationsEnzymes chemical = new ChemicalExaminationsEnzymes();
        chemical.setBloodIdx(bloodIdx);
        chemical.setAlt(10L + random.nextInt(40));
        chemical.setAlbumin(35L + random.nextInt(15));
        chemical.setAlkalinePhosphatase(45L + random.nextInt(75));
        chemical.setAmmonia(15L + random.nextInt(30));
        chemical.setAmylase(30L + random.nextInt(90));
        chemical.setAst(10L + random.nextInt(40));
        chemical.setBetaHydroxybutyrate(1L + random.nextInt(5));
        chemical.setBicarbonate(22L + random.nextInt(4));
        chemical.setBilirubin(3L + random.nextInt(7));
        chemical.setCrp(1L + random.nextInt(10));
        chemical.setCalcium(85L + random.nextInt(15));
        chemical.setCo2(35L + random.nextInt(10));
        chemical.setChloride(98L + random.nextInt(8));
        chemical.setRegdate(now);
        chemical.setLabTest(labTest);

        // EnzymesMetabolism 생성 및 설정
        EnzymesMetabolism enzymes = new EnzymesMetabolism();
        enzymes.setBloodIdx(bloodIdx);
        enzymes.setCk(30L + random.nextInt(170));
        enzymes.setCkmb((long) random.nextInt(25));
        enzymes.setCreatinine(7L + random.nextInt(6));
        enzymes.setDDimer(1L + random.nextInt(4));
        enzymes.setGgt(10L + random.nextInt(40));
        enzymes.setGlucose(70L + random.nextInt(110));
        enzymes.setInrpt(8L + random.nextInt(4));
        enzymes.setLactate(5L + random.nextInt(15));
        enzymes.setLd(140L + random.nextInt(140));
        enzymes.setLipase(10L + random.nextInt(50));
        enzymes.setMagnesium(17L + random.nextInt(5));
        enzymes.setNtproBNP(100L + random.nextInt(200));
        enzymes.setRegdate(now);
        enzymes.setLabTest(labTest);

        // BloodLevels 생성 및 설정
        BloodLevels bloodLevels = new BloodLevels();
        bloodLevels.setBloodIdx(bloodIdx);
        bloodLevels.setHemoglobin(130L + random.nextInt(40));
        bloodLevels.setPlateletCount(150L + random.nextInt(250));
        bloodLevels.setRbc((45L + random.nextInt(15)));
        bloodLevels.setWbc((45L + random.nextInt(65)));
        bloodLevels.setSedimentationRate((long) random.nextInt(20));
        bloodLevels.setRegDate(now);
        bloodLevels.setLabTest(labTest);

        // BloodGasAnalysis 생성 및 설정
        BloodGasAnalysis bloodGas = new BloodGasAnalysis();
        bloodGas.setBloodIdx(bloodIdx);
        bloodGas.setPH(735L + random.nextInt(10));
        bloodGas.setPCO2(35L + random.nextInt(10));
        bloodGas.setPO2(80L + random.nextInt(20));
        bloodGas.setRegDate(now);
        bloodGas.setLabTest(labTest);

        // ElectrolyteLevel 생성 및 설정
        ElectrolyteLevel electrolyte = new ElectrolyteLevel();
        electrolyte.setBloodIdx(bloodIdx);
        electrolyte.setSodium(135L + random.nextInt(10));
        electrolyte.setPotassium((35L + random.nextInt(15)));
        electrolyte.setRegDate(now);
        electrolyte.setLabTest(labTest);

        // 양방향 관계 설정
        labTest.setChemicalExaminationsEnzymes(chemical);
        labTest.setEnzymesMetabolism(enzymes);
        labTest.setBloodLevels(bloodLevels);
        labTest.setBloodGasAnalysis(bloodGas);
        labTest.setElectrolyteLevel(electrolyte);

        // 저장 및 반환
        return labTestRepository.save(labTest);
    }

    private Long generateUniqueBloodIdx() {
        // 현재 시간을 밀리초로 가져와서 랜덤 값을 더해 유니크한 ID 생성
        return (System.currentTimeMillis() % 1_000_000_000L);
    }
    
    @Transactional
    public void generateCompletePatientData() {
        try {
            Patient patient = generateRandomPatient();
            log.info("Generated patient with ID: {}", patient.getSubjectId());
            
            Visit visit = generateRandomVisit(patient);
            log.info("Generated visit with StayID: {}", visit.getStayId());
            
            LabTest labTest = generateRandomLabTest(visit);
            log.info("Generated lab test with Blood Index: {}", labTest.getBloodIdx());
            
            VitalSigns vitalSigns = generateRandomVitalSigns(visit);
            log.info("Generated vital signs with ChartNum: {}", vitalSigns.getChartNum());
            
        } catch (Exception e) {
            log.error("Error generating complete patient data: ", e);
            throw new RuntimeException("Failed to generate complete patient data", e);
        }
    }
    
    
 // Utility methods
    private String determinePregnancyStatus(String gender, long age) {
        // "1": Female, "0": Male
        if ("1".equals(gender) && age >= 20 && age <= 45) {
            return random.nextBoolean() ? "Y" : "N";
        }
        return "N";
    }

    private String generateRandomName() {
        String[] firstNames = {"김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"};
        String[] middleNames = {"민", "서", "예", "주", "현", "지", "승", "우", "진", "수"};
        String[] lastNames = {"준", "우", "진", "현", "민", "서", "원", "훈", "성", "영"};
        
        return firstNames[random.nextInt(firstNames.length)] +
               middleNames[random.nextInt(middleNames.length)] +
               lastNames[random.nextInt(lastNames.length)];
    }
    
    private String generateRandomAddress() {
        String[] cities = {"서울시", "부산시", "대구시", "인천시", "광주시", "대전시", "울산시"};
        String[] districts = {"중구", "서구", "동구", "남구", "북구", "강남구", "강서구"};
        
        return cities[random.nextInt(cities.length)] + " " +
               districts[random.nextInt(districts.length)] + " " +
               (random.nextInt(999) + 1) + "번길 " +
               (random.nextInt(100) + 1);
    }
    
    private String generateRandomResidentNumber(int birthYear, String gender) {
        String birthYearStr = String.valueOf(birthYear).substring(2);
        String birthMonth = String.format("%02d", 1 + random.nextInt(12));
        String birthDay = String.format("%02d", 1 + random.nextInt(28));
        String genderNum = (gender.equals("M")) ? 
            (birthYear < 2000 ? "1" : "3") : 
            (birthYear < 2000 ? "2" : "4");
        
        return birthYearStr + birthMonth + birthDay + "-" + genderNum + random.nextInt(999999);
    }
    
    private String generateRandomIcdCode() {
        String[] icdCodes = {"A00", "B01", "C02", "D03", "E04", "F05", "G06", "H07", "I08", "J09"};
        return icdCodes[random.nextInt(icdCodes.length)] + "." + random.nextInt(10);
    }
    
    private String generateRandomComment() {
        String[] symptoms = {"발열", "두통", "어지러움", "복통", "구토", "설사", "기침", "호흡곤란"};
        String[] durations = {"1일째", "2일째", "3일째", "일주일째"};
        String[] severities = {"경미", "보통", "심각"};
        
        return symptoms[random.nextInt(symptoms.length)] + " " +
               durations[random.nextInt(durations.length)] + " " +
               severities[random.nextInt(severities.length)];
    }
    
    
    
    
    //플라스크
    @Transactional
    public List<String> generateAndProcessCompleteData(int count) {
        List<String> processedChartNums = new ArrayList<>();
        
        for (int i = 0; i < count; i++) {
            try {
                // 1. 데이터 생성
                String chartNum = generateAndCollectData();
                
                // 2. Flask 분석 및 AiTAS 저장
                processFlaskAnalysis(chartNum);
                
                // 3. Ward 배정
                assignWard(chartNum);
                
                processedChartNums.add(chartNum);
                log.info("Completed processing for chartNum: {}", chartNum);
                
            } catch (Exception e) {
                log.error("Error processing record {}: {}", i, e.getMessage());
            }
        }
        
        return processedChartNums;
    }
    
    @Transactional
    private String generateAndCollectData() {
        // 1. 환자 데이터 생성
        Patient patient = generateRandomPatient();
        Visit visit = generateRandomVisit(patient);
        VitalSigns vitalSigns = generateRandomVitalSigns(visit);
        LabTest labTest = generateRandomLabTest(visit);
        
        log.info("Generated data - Patient: {}, Visit: {}, ChartNum: {}", 
            patient.getSubjectId(), visit.getStayId(), vitalSigns.getChartNum());
            
        return vitalSigns.getChartNum();
    }
    
    private void processFlaskAnalysis(String chartNum) {
        try {
            // LabTest 데이터를 FlaDTO 형식으로 변환
            List<FlaDTO> patientData = flaskService.getPatientDataByChartNum(chartNum);
            
            if (!patientData.isEmpty()) {
                // Flask 서버로 데이터 전송 및 AiTAS 결과 저장
                JSONObject result = flaskService.getAiTAS(patientData);
                log.info("Processed Flask analysis for chartNum: {}", chartNum);
            } else {
                log.warn("No data found for Flask analysis - ChartNum: {}", chartNum);
            }
        } catch (Exception e) {
            log.error("Error in Flask analysis for chartNum {}: {}", chartNum, e.getMessage());
            throw new RuntimeException("Flask analysis failed", e);
        }
    }
    
    private void assignWard(String chartNum) {
        try {
            // Ward 배정 프로세스 실행
            patientAssignmentService.processWardAssignment(
                vitalSignsRepository.findById(chartNum)
                    .orElseThrow(() -> new RuntimeException("VitalSigns not found: " + chartNum))
            );
            log.info("Completed ward assignment for chartNum: {}", chartNum);
        } catch (Exception e) {
            log.error("Error in ward assignment for chartNum {}: {}", chartNum, e.getMessage());
            throw new RuntimeException("Ward assignment failed", e);
        }
    }
    
}