// PatientService.java
package kr.spring.service;

import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
@Service
public class PatientService {
	
	@Autowired
    private VitalSignsService vitalSignsService;

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
            // Patient 기본 정보 설정
            patientData.setSubjectId(row.getSubjectId());
            patientData.setName(row.getName());
            patientData.setGender(row.getGender());
            patientData.setBirthdate(row.getBirthdate());
            patientData.setAge(row.getAge());
            patientData.setAddress(row.getAddress());
            patientData.setPregnancystatus(row.getPregnancystatus());
            patientData.setPhoneNumber(row.getPhoneNumber());
            patientData.setResidentNum(row.getResidentNum());

            // Visit 정보
            Long stayId = row.getStayId();
            VisitDTO visitData = visitMap.computeIfAbsent(stayId, id -> new VisitDTO(
                stayId,
                row.getPain(),
                row.getLosHours(),
                row.getTas(),
                row.getArrivalTransport(),
                row.getLabel(),
                row.getVisitDate(),
                new ArrayList<>(),  // VitalSigns 리스트 초기화
                new ArrayList<>()   // AiDTO 리스트 초기화
            ));

            // VitalSigns 정보
            VitalSignsDTO vitalSigns = new VitalSignsDTO(
                row.getChartNum(),
                row.getChartTime(),
                row.getHeartrate(),
                row.getResprate(),
                row.getO2sat(),
                row.getSbp(),
                row.getDbp(),
                row.getTemperature(),
                row.getRegDate()
            );
            visitData.getVitalSigns().add(vitalSigns);

            // AiTAS 정보 (Optional)
            if (row.getChartNum() != null) {
                AiDTO aiData = new AiDTO(
                	
                    row.getChartNum(),
                    row.getId(),  
                    row.getLevel1(),
                    row.getLevel2(),
                    row.getLevel3()
                );
                visitData.getAiTAS().add(aiData);
            }
        }

        patientData.setVisits(new ArrayList<>(visitMap.values()));
        return patientData;
    }



    public PatientService(PatientRepository patientRepository, VisitRepository visitRepository) {
        this.patientRepository = patientRepository;
        this.visitRepository = visitRepository;
    }
    //필터링 + 페이징 
    public Map<String, Object> getPatientsByStaystatus(int page, String name, Long gender, Long tas, Long pain) {
    	PageRequest pageable = PageRequest.of(page, 10);

    	Specification<Patient> spec = (root, query, builder) -> {
    	    Join<Patient, Visit> visitJoin = root.join("visits", JoinType.INNER);
    	    List<javax.persistence.criteria.Predicate> predicates = new ArrayList<>();
    	    
    	    // TAS 필터링
    	    if (tas != null) {
    	        predicates.add(builder.equal(visitJoin.get("tas"), tas));
    	    }
    	    
    	    // staystatus 조건
    	    predicates.add(builder.equal(visitJoin.get("staystatus"), 1));
    	    
    	    // 나머지 필터 조건들
    	    if (name != null && !name.trim().isEmpty()) {
    	        predicates.add(builder.like(builder.lower(root.get("name")), 
    	            "%" + name.toLowerCase() + "%"));
    	    }
    	    if (gender != null) {
    	        predicates.add(builder.equal(root.get("gender"), gender));
    	    }
    	    if (pain != null) {
    	        predicates.add(builder.equal(visitJoin.get("pain"), pain));
    	    }
    	    
    	    query.orderBy(builder.asc(root.get("subjectId")));
    	    
    	    return builder.and(predicates.toArray(new javax.persistence.criteria.Predicate[0]));
    	};

    	Page<Patient> pageResult = patientRepository.findAll(spec, pageable);
        
        // DTO 변환 시 TAS 필터링 한번 더 확인
        Map<String, Object> response = new HashMap<>();
        response.put("patients", pageResult.getContent().stream()
            .map(patient -> {
                PatientDTO patientDTO = modelMapper.map(patient, PatientDTO.class);
                // TAS 조건에 맞는 visit만 필터링
                List<VisitDTO> visitDTOs = patient.getVisits().stream()
                    .filter(visit -> tas == null || visit.getTas().equals(tas))
                    .map(visit -> modelMapper.map(visit, VisitDTO.class))
                    .collect(Collectors.toList());
                patientDTO.setVisits(visitDTOs);
                return patientDTO;
            })
            .filter(patientDTO -> !patientDTO.getVisits().isEmpty()) // visits가 비어있는 환자는 제외
            .collect(Collectors.toList()));
            
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());
        return response;
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
