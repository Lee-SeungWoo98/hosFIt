// PatientService.java
package kr.spring.service;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

import javax.persistence.criteria.Predicate;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;
import kr.spring.dto.AiDTO;
import kr.spring.dto.PatientDTO;
import kr.spring.dto.VisitDTO;
import kr.spring.dto.VitalSignsDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.Patient;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.entity.WardAssignment;
import kr.spring.repository.AiTASRepository;
import kr.spring.repository.PatientProjection;
import kr.spring.repository.PatientRepository;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.VitalSignsRepository;
import kr.spring.repository.WardAssignmentRepository;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
@Transactional(readOnly = true)
@CacheConfig(cacheNames = "patientDetails")
public class PatientService {
    
    @Autowired
    private VitalSignsService vitalSignsService;
    
    @Autowired
    private PatientAssignmentService patientAssignmentService;

    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private VitalSignsRepository vitalSignsRepository;
    
    @Autowired
    private VisitRepository visitRepository;
    
    @Autowired
    private AiTASRepository aiTASRepository;
    
    @Autowired
    private WardAssignmentRepository wardAssignmentRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    private final CacheManager cacheManager;

    public PatientService(PatientRepository patientRepository, 
            VisitRepository visitRepository,
            AiTASRepository aiTASRepository,
            PatientAssignmentService patientAssignmentService,
            WardAssignmentRepository wardAssignmentRepository,
            CacheManager cacheManager) {
        this.patientRepository = patientRepository;
        this.visitRepository = visitRepository;
        this.aiTASRepository = aiTASRepository;
        this.patientAssignmentService = patientAssignmentService;
        this.wardAssignmentRepository = wardAssignmentRepository;
        this.cacheManager = cacheManager;
       
    }

    public List<PatientDTO> getPatients(String name) {
        System.out.println("[PatientService - getPatients] Searching patients with name containing: " + name);
        List<Patient> patients = patientRepository.findByNameContainingIgnoreCase(name);

        return patients.stream()
                .<PatientDTO>map(patient -> modelMapper.map(patient, PatientDTO.class))
                .collect(Collectors.toList());
    }

    @Cacheable(key = "#subjectId + '-' + #sortDirection")
    public PatientDTO getPatientWithVisitsAndVitals(Long subjectId) {
        log.debug("Fetching patient details for subjectId: {}", subjectId);
        
        try {
            Patient patient = patientRepository.findById(subjectId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));
            
            return convertToPatientDTO(patient);
            
        } catch (Exception e) {
            log.error("Error fetching patient details", e);
            throw new RuntimeException("Failed to fetch patient details", e);
        }
    }

    private PatientDTO convertToPatientDTO(Patient patient) {
        PatientDTO dto = new PatientDTO();
        dto.setSubjectId(patient.getSubjectId());
        dto.setName(patient.getName());
        dto.setGender(patient.getGender());
        dto.setBirthdate(patient.getBirthdate());
        dto.setAge(patient.getAge());
        dto.setIcd(patient.getIcd());
        dto.setAddress(patient.getAddress());
        dto.setPregnancystatus(patient.getPregnancystatus());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setResidentNum(patient.getResidentNum());

        List<VisitDTO> visitDTOs = new ArrayList<>();

        for (Visit visit : patient.getVisits()) {
            VisitDTO visitDTO = new VisitDTO();
            visitDTO.setStayId(visit.getStayId());
            visitDTO.setPain(visit.getPain());
            visitDTO.setLosHours(visit.getLosHours());
            visitDTO.setTas(visit.getTas());
            visitDTO.setArrivalTransport(visit.getArrivalTransport());
            visitDTO.setLabel(visit.getLabel());
            visitDTO.setComment(visit.getComment());
            visitDTO.setVisitDate(visit.getVisitDate());

            Set<VitalSignsDTO> vitalSignsDTOs = new LinkedHashSet<>();
            
            // 각 방문의 VitalSigns를 시간순으로 정렬
            List<VitalSigns> sortedVitalSigns = new ArrayList<>(visit.getVitalSigns());
            sortedVitalSigns.sort((v1, v2) -> v1.getChartTime().compareTo(v2.getChartTime()));
            // 모든 VitalSigns 처리
            for (VitalSigns vital : sortedVitalSigns) {
                if (vital.getChartTime() != null) {
                    VitalSignsDTO vitalDTO = new VitalSignsDTO();
                    vitalDTO.setChartNum(vital.getChartNum());
                    vitalDTO.setChartTime(vital.getChartTime());
                    vitalDTO.setHeartrate(vital.getHeartrate());
                    vitalDTO.setResprate(vital.getResprate());
                    vitalDTO.setO2sat(vital.getO2sat());
                    vitalDTO.setSbp(vital.getSbp());
                    vitalDTO.setDbp(vital.getDbp());
                    vitalDTO.setTemperature(vital.getTemperature());

                    // 각 VitalSigns의 WardAssignment 정보 설정
                    Optional<WardAssignment> ward = wardAssignmentRepository.findByChartNum(vital.getChartNum());
                    if (ward.isPresent()) {
                        WardAssignment assignment = ward.get();
                        String wardCode = determineWardCode(
                            assignment.getLevel1(),
                            assignment.getLevel2(),
                            assignment.getLevel3()
                        );
                        vitalDTO.setWardCode(wardCode);
                        vitalDTO.setLevel1(assignment.getLevel1());
                        vitalDTO.setLevel2(assignment.getLevel2());
                        vitalDTO.setLevel3(assignment.getLevel3());
                    } else {
                        log.warn("No WardAssignment found for chartNum: {}", vital.getChartNum());
                    }


                    vitalSignsDTOs.add(vitalDTO);
                }
            }

            visitDTO.setVitalSigns(vitalSignsDTOs);
            visitDTOs.add(visitDTO);
        }

        // 방문 기록 정렬 (최신순)
        visitDTOs.sort((v1, v2) -> v2.getVisitDate().compareTo(v1.getVisitDate()));
        dto.setVisits(visitDTOs);

        return dto;
    }
    private String determineWardCode(Float level1, Float level2, Float level3) {
        if (level1 == null || level2 == null || level3 == null) return null;
        if (level1 >= level2 && level1 >= level3) return "ICU";
        if (level2 >= level1 && level2 >= level3) return "HDU";
        return "Ward";
    }


    private void setPatientBasicInfo(PatientDTO patientData, PatientProjection row) {
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
    }

    private VisitDTO createVisitDTO(PatientProjection row) {
        VisitDTO visitDTO = new VisitDTO();
        visitDTO.setStayId(row.getStayId());
        visitDTO.setPain(row.getPain());
        visitDTO.setLosHours(row.getLosHours());
        visitDTO.setTas(row.getTas());
        visitDTO.setArrivalTransport(row.getArrivalTransport());
        visitDTO.setLabel(row.getLabel());
        visitDTO.setComment(row.getComment());
        visitDTO.setVisitDate(row.getVisitDate());
        visitDTO.setVitalSigns(new HashSet<>());
        visitDTO.setWardAssignment(new HashMap<>());
        return visitDTO;
    }

    private VitalSignsDTO createVitalSignsDTO(PatientProjection row) {
        VitalSignsDTO vitalDTO = new VitalSignsDTO();
        vitalDTO.setChartNum(row.getChartNum());
        vitalDTO.setChartTime(row.getChartTime());
        vitalDTO.setHeartrate(row.getHeartrate());
        vitalDTO.setResprate(row.getResprate());
        vitalDTO.setO2sat(row.getO2sat());
        vitalDTO.setSbp(row.getSbp());
        vitalDTO.setDbp(row.getDbp());
        vitalDTO.setTemperature(row.getTemperature());
        vitalDTO.setRegDate(row.getRegDate());
        return vitalDTO;
    }

    private void setWardAssignment(VisitDTO visitDTO, VitalSignsDTO vitalDTO, PatientProjection row) {
        String wardCode = determineWardCode(row.getLevel1(), row.getLevel2(), row.getLevel3());
        
        vitalDTO.setWardCode(wardCode);
        vitalDTO.setLevel1(row.getLevel1());
        vitalDTO.setLevel2(row.getLevel2());
        vitalDTO.setLevel3(row.getLevel3());

        Map<String, Object> wardAssignment = new HashMap<>();
        wardAssignment.put("wardCode", wardCode);
        wardAssignment.put("level1", row.getLevel1());
        wardAssignment.put("level2", row.getLevel2());
        wardAssignment.put("level3", row.getLevel3());
        visitDTO.setWardAssignment(wardAssignment);
    }

  
    private void updateWardAssignment(VisitDTO visitDTO, VitalSignsDTO vitalDTO, String chartNum) {
        Optional<WardAssignment> wardAssignment = wardAssignmentRepository.findByChartNum(chartNum);
        if (wardAssignment.isPresent()) {
            WardAssignment assignment = wardAssignment.get();
            Map<String, Object> wardAssignmentMap = new HashMap<>();
            
            // WardAssignment 값 설정
            wardAssignmentMap.put("wardCode", assignment.getWardCode());
            wardAssignmentMap.put("level1", assignment.getLevel1());
            wardAssignmentMap.put("level2", assignment.getLevel2());
            wardAssignmentMap.put("level3", assignment.getLevel3());
            
            visitDTO.setWardAssignment(wardAssignmentMap);
        } else {
            log.warn("No WardAssignment found for chartNum: {}", chartNum);
        }
    }

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



    public List<Patient> getPatientsByTas(Long tas) {
        return patientRepository.findDistinctByVisitsTasAndStaystatus(tas);
    }

    public Map<String, Object> getPatientsByStaystatus(int page) {
        PageRequest pageable = PageRequest.of(page, 10);
        Page<Patient> pageResult = patientRepository.findDistinctByStaystatus(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("patients", pageResult.getContent());
        response.put("totalPages", pageResult.getTotalPages());
        return response;
    }

    public Map<Integer, Long> getPatientsByTas() {
        System.out.println("[PatientService - getPatientsByTas] Service method called");
        List<Object[]> result = patientRepository.countPatientsByTas();
        Map<Integer, Long> tasCountMap = new HashMap<>();

        for (Object[] row : result) {
            Integer tas = ((Number) row[0]).intValue();
            Long count = (Long) row[1];
            tasCountMap.put(tas, count);
        }

        for (int i = 1; i <= 5; i++) {
            tasCountMap.putIfAbsent(i, 0L);
        }

        return tasCountMap;
    }

    public List<VitalSigns> getVitalSigns(Long stayId) {
        Visit visit = visitRepository.findByStayId(stayId);
        return vitalSignsRepository.findByVisit(visit);
    }

    public void clearPatientCache(Long subjectId) {
        Cache cache = cacheManager.getCache("patientDetails");
        if (cache != null) {
            cache.evict(subjectId + "-desc");
            cache.evict(subjectId + "-asc");
        }
    }
}