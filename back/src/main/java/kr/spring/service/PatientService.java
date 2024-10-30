// PatientService.java
package kr.spring.service;

import java.awt.print.Pageable;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.Join;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import kr.spring.dto.PatientDTO;
import kr.spring.dto.VisitDTO;
import kr.spring.entity.Patient;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.PatientRepository;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.VitalSignsRepository;
@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private VitalSignsRepository vitalSignsRepository;
    @Autowired
    private VisitRepository visitRepository;
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
    public Patient getPatientWithVisits(Long subjectId) {
        Patient patient = patientRepository.findById(subjectId)
                                           .orElseThrow(() -> new EntityNotFoundException("환자를 찾을 수 없습니다."));
        List<Visit> visits = visitRepository.findByPatient(patient);
        patient.setVisits(visits); // 방문 기록 설정
        return patient;
    }

    public PatientService(PatientRepository patientRepository, VisitRepository visitRepository) {
        this.patientRepository = patientRepository;
        this.visitRepository = visitRepository;
    }
    //필터링 + 페이징 
    public Map<String, Object> getPatientsByStaystatus(int page, String name, Long gender, Long TAS, Long pain) {
        PageRequest pageable = PageRequest.of(page, 10); // 페이지당 10개의 데이터 표시

        // 동적 필터링 조건에 따른 Specification 생성
        Specification<Patient> spec = createSpecification(name, gender, TAS, pain);

        // 필터링된 데이터와 페이징 결과 조회
        Page<Patient> pageResult = patientRepository.findAll(spec, pageable);

        // 결과 매핑
        Map<String, Object> response = new HashMap<>();
        response.put("patients", pageResult.getContent().stream()
            .map(patient -> {
                PatientDTO patientDTO = modelMapper.map(patient, PatientDTO.class);

                // visit 데이터를 포함하여 변환
                List<VisitDTO> visitDTOs = patient.getVisits().stream()
                    .map(visit -> modelMapper.map(visit, VisitDTO.class))
                    .collect(Collectors.toList());
                patientDTO.setVisits(visitDTOs); // PatientDTO에 visitDTO 리스트 설정

                return patientDTO;
            })
            .collect(Collectors.toList()));
        response.put("totalPages", pageResult.getTotalPages());
        response.put("totalElements", pageResult.getTotalElements());

        return response;
    }

    // 필터링 조건에 따른 Specification 생성 메서드
    private Specification<Patient> createSpecification(String name, Long gender, Long TAS, Long pain) {
        Specification<Patient> spec = Specification.where(null);

        // 이름 필터 조건
        if (name != null && !name.trim().isEmpty()) {
            spec = spec.and((root, query, builder) -> 
                builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }

        // 성별 필터 조건
        if (gender != null) {
            spec = spec.and((root, query, builder) -> 
                builder.equal(root.get("gender"), gender));
        }

        // TAS 필터 조건
        if (TAS != null) {
            spec = spec.and((root, query, builder) -> {
                Join<Patient, Visit> visitJoin = root.join("visits");
                return builder.equal(visitJoin.get("TAS"), TAS);
            });
        }

        // Pain Score 필터 조건
        if (pain != null) {
            spec = spec.and((root, query, builder) -> {
                Join<Patient, Visit> visitJoin = root.join("visits");
                return builder.equal(visitJoin.get("pain"), pain);
            });
        }

        return spec;
    }

 // TAS 값을 기준으로 환자 목록 반환
    public List<Patient> getPatientsByTAS(Long TAS) {
        return patientRepository.findDistinctByVisitsTASAndStaystatus(TAS);
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
    
    

}
