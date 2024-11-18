// PatientService.java
package kr.spring.service;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;

import javax.persistence.criteria.Predicate;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Sort;
import kr.spring.dto.AiDTO;
import kr.spring.dto.PatientDTO;
import kr.spring.dto.VisitDTO;
import kr.spring.dto.VitalSignsDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.Patient;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.AiTASRepository;
import kr.spring.repository.PatientProjection;
import kr.spring.repository.PatientRepository;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.VitalSignsRepository;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class PatientService {
	
	@Autowired
    private VitalSignsService vitalSignsService;
	
	@Autowired
    private PatientAssignmentService patientAssignmentService;

    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private VitalSignsRepository vitalSignsRepository;
    private VisitRepository visitRepository;
    
    @Autowired
    private AiTASRepository aiTASRepository;
    @Autowired
    private ModelMapper modelMapper;

 // 모든 환자 조회 (환자 정보만 반환)
//    public List<PatientDTO> getPatientWithVisits(String name, Long gender, Long TAS, Long pain) {
//        // 필터 조건이 있는 경우에만 조건에 맞게 환자 목록을 조회
//        List<Patient> patients;
//        if (name != null || gender != null || TAS != null || pain != null) {
//            patients = patientRepository.findByFilters(name, gender, TAS, pain); // Repository에서 필터링된 결과를 가져옴
//        } else {
//            patients = patientRepository.findAll();
//        }
//
//        // ModelMapper를 사용해 Patient -> PatientDTO로 변환
//        return patients.stream()
//                .<PatientDTO>map(patient -> modelMapper.map(patient, PatientDTO.class)) // 명시적 타입 지정
//                .collect(Collectors.toList());
//    }
    //이름 검색 
    public List<PatientDTO> getPatients(String name) {
        System.out.println("[PatientService - getPatients] Searching patients with name containing: " + name);
        List<Patient> patients = patientRepository.findByNameContainingIgnoreCase(name);

        // ModelMapper를 사용해 자동으로 변환
        return patients.stream()
                .<PatientDTO>map(patient -> modelMapper.map(patient, PatientDTO.class))  // 명시적 타입 지정
                .collect(Collectors.toList());
    }
    //상세보기 

    public PatientDTO getPatientWithVisitsAndVitals(Long subjectId) {
        List<PatientProjection> results = patientRepository.findPatientDataBySubjectId(subjectId);
        PatientDTO patientData = new PatientDTO();
        Map<Long, VisitDTO> visitMap = new HashMap<>();

        for (PatientProjection row : results) {
            patientData.setSubjectId(row.getSubjectId());
            patientData.setName(row.getName());
            patientData.setGender(row.getGender());
            patientData.setBirthdate(row.getBirthdate());
            patientData.setAge(row.getAge());
            patientData.setIcd(row.getIcd());
            patientData.setAddress(row.getAddress());
            patientData.setPregnancystatus(row.getPregnancystatus());
            patientData.setPhoneNumber(row.getPhoneNumber());
            patientData.setResidentNum(row.getResidentNum());

            Long stayId = row.getStayId();
            VisitDTO visitData = visitMap.computeIfAbsent(stayId, id -> new VisitDTO(
                stayId,
                row.getPain(),
                row.getLosHours(),
                row.getTas(),
                row.getArrivalTransport(),
                row.getLabel(),
                row.getVisitDate(),
                new ArrayList<>(),
                new HashMap<>(),
                row.getComment()
            ));

            // AiTAS에서 wardCode와 level 정보 조회
            String chartNum = row.getChartNum();
            String wardCode = null;
            Float level1 = null;
            Float level2 = null;
            Float level3 = null;

            if (chartNum != null) {
                Optional<AiTAS> aiTASOptional = aiTASRepository.findFirstByVitalSigns_ChartNum(chartNum);
                if (aiTASOptional.isPresent()) {
                    AiTAS aiTAS = aiTASOptional.get();
                    wardCode = patientAssignmentService.determineWardByLevels(aiTAS);
                    level1 = aiTAS.getLevel1();
                    level2 = aiTAS.getLevel2();
                    level3 = aiTAS.getLevel3();
                }
            }

            // VitalSignsDTO 생성 및 설정
            VitalSignsDTO vitalSigns = new VitalSignsDTO(
                chartNum,
                row.getChartTime(),
                row.getHeartrate(),
                row.getResprate(),
                row.getO2sat(),
                row.getSbp(),
                row.getDbp(),
                row.getTemperature(),
                row.getRegDate(),
                wardCode,
                level1,
                level2,
                level3
            );

            // visitData에 wardAssignment 정보 설정
            if (wardCode != null) {
                Map<String, Object> wardAssignment = new HashMap<>();
                wardAssignment.put("wardCode", wardCode);
                wardAssignment.put("level1", level1);
                wardAssignment.put("level2", level2);
                wardAssignment.put("level3", level3);
                visitData.setWardAssignment(wardAssignment);
            }

            visitData.getVitalSigns().add(vitalSigns);
            
        }
        

        patientData.setVisits(new ArrayList<>(visitMap.values()));
        return patientData;
    }

    public PatientService(PatientRepository patientRepository, VisitRepository visitRepository) {
        this.patientRepository = patientRepository;
        this.visitRepository = visitRepository;
    }
    //필터링 + 페이징 

    public Map<String, Object> getPatientsByStaystatus(int page, String name, String gender, Long tas, Long pain, String maxLevel) {
        PageRequest pageable = PageRequest.of(page, 10, Sort.by("subjectId").ascending());
        Page<Patient> pageResult = patientRepository.findPatientsWithFilters(name, gender, tas, pain, maxLevel, pageable);

        List<PatientDTO> patientDTOs = pageResult.getContent().stream()
            .map(this::convertToPatientDTO)
            .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("patients", patientDTOs);
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
        return response;
    }

    private PatientDTO convertToPatientDTO(Patient patient) {
        PatientDTO patientDTO = new PatientDTO();
        patientDTO.setSubjectId(patient.getSubjectId());
        patientDTO.setName(patient.getName());
        patientDTO.setGender(patient.getGender());
        patientDTO.setBirthdate(patient.getBirthdate());
        patientDTO.setAge(patient.getAge());
        patientDTO.setIcd(patient.getIcd());
        patientDTO.setAddress(patient.getAddress());
        patientDTO.setPregnancystatus(patient.getPregnancystatus());
        patientDTO.setPhoneNumber(patient.getPhoneNumber());
        patientDTO.setResidentNum(patient.getResidentNum());

        List<VisitDTO> visitDTOs = patient.getVisits().stream()
            .filter(visit -> visit.getStaystatus() == 1 && visit.getLabel() == null)
            .map(visit -> {
                VisitDTO visitDTO = new VisitDTO();
                visitDTO.setStayId(visit.getStayId());
                visitDTO.setPain(visit.getPain());
                visitDTO.setLosHours(visit.getLosHours());
                visitDTO.setTas(visit.getTas());
                visitDTO.setArrivalTransport(visit.getArrivalTransport());
                visitDTO.setLabel(visit.getLabel());
                visitDTO.setComment(visit.getComment());
                visitDTO.setVisitDate(visit.getVisitDate());

                // 가장 최근의 VitalSigns 가져오기
                visit.getVitalSigns().stream()
                    .filter(vs -> vs.getChartTime() != null)
                    .max(Comparator.comparing(VitalSigns::getChartTime))
                    .ifPresent(latestVital -> {
                        VitalSignsDTO vitalDTO = new VitalSignsDTO();
                        vitalDTO.setChartNum(latestVital.getChartNum());
                        vitalDTO.setChartTime(latestVital.getChartTime());
                        vitalDTO.setHeartrate(latestVital.getHeartrate());
                        vitalDTO.setResprate(latestVital.getResprate());
                        vitalDTO.setO2sat(latestVital.getO2sat());
                        vitalDTO.setSbp(latestVital.getSbp());
                        vitalDTO.setDbp(latestVital.getDbp());
                        vitalDTO.setTemperature(latestVital.getTemperature());

                        // AiTAS 정보 매핑
                        if (latestVital.getAiTAS() != null && !latestVital.getAiTAS().isEmpty()) {
                            AiTAS aiTAS = latestVital.getAiTAS().iterator().next();
                            String wardCode = patientAssignmentService.determineWardByLevels(aiTAS);

                            vitalDTO.setWardCode(wardCode);
                            vitalDTO.setLevel1(aiTAS.getLevel1());
                            vitalDTO.setLevel2(aiTAS.getLevel2());
                            vitalDTO.setLevel3(aiTAS.getLevel3());
                        }

                        Set<VitalSignsDTO> vitalSet = new HashSet<>();
                        vitalSet.add(vitalDTO);
                        visitDTO.setVitalSigns(vitalSet);
                    });

                return visitDTO;
            })
            .collect(Collectors.toList());

        patientDTO.setVisits(visitDTOs);
        return patientDTO;
    }



 // TAS 값을 기준으로 환자 목록 반환
    public List<Patient> getPatientsByTas(Long tas) {
        return patientRepository.findDistinctByVisitsTasAndStaystatus(tas);
    }

    public Map<String, Object> getPatientsByStaystatus(int page) {
        PageRequest pageable = PageRequest.of(page, 10); // 10개씩 페이징
        Page<Patient> pageResult = patientRepository.findDistinctByStaystatus(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("patients", pageResult.getContent()); // Page에서 content만 추출
        response.put("totalPages", pageResult.getTotalPages()); // 전체 페이지 개수 추가

        return response;
    }

	
	public Map<Integer, Long> getPatientsByTas() {
		   System.out.println("[PatientService - getPatientsByTas] Service method called");
	        List<Object[]> result = patientRepository.countPatientsByTas();
	        Map<Integer, Long> tasCountMap = new HashMap<>();

	        // SQL 쿼리 결과를 Map에 저장
	        for (Object[] row : result) {
	            Integer tas = ((Number) row[0]).intValue();
	            Long count = (Long) row[1];
	            tasCountMap.put(tas, count);
	        }

	        // tas 1부터 5까지의 값을 반환, 없으면 0 처리
	        for (int i = 1; i <= 5; i++) {
	            tasCountMap.putIfAbsent(i, 0L);  // 없는 tas 값은 0으로 처리
	        }

	        return tasCountMap;
	    }
	// 환자 생체 데이터
    public List<VitalSigns> getVitalSigns(Long stayId) {
    	Visit visit = visitRepository.findByStayId(stayId);
		return vitalSignsRepository.findByVisit(visit);
    }
    
    
    //오름차순 내림차순 
    public PatientDTO getPatientWithSortedVisits(Long subjectId, String sortDirection) {
        Patient patient = patientRepository.findById(subjectId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<VisitDTO> visits;
        if ("asc".equalsIgnoreCase(sortDirection)) {
            visits = patient.getVisits().stream()
                .sorted((v1, v2) -> v1.getVisitDate().compareTo(v2.getVisitDate()))
                .map(visit -> modelMapper.map(visit, VisitDTO.class))  // Visit -> VisitDTO 변환
                .collect(Collectors.toList());
        } else {
            visits = patient.getVisits().stream()
                .sorted((v1, v2) -> v2.getVisitDate().compareTo(v1.getVisitDate()))
                .map(visit -> modelMapper.map(visit, VisitDTO.class))  // Visit -> VisitDTO 변환
                .collect(Collectors.toList());
        }
        
        PatientDTO dto = modelMapper.map(patient, PatientDTO.class);  // Patient -> PatientDTO 변환
        dto.setVisits(visits);  // 정렬된 방문 기록 설정
        
        return dto;
    }

}
