// PatientService.java
package kr.spring.service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.dto.PatientDTO;
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
	public List<PatientDTO> getAllPatients() {
		List<Patient> patients = patientRepository.findAll();

		// ModelMapper를 사용해 자동으로 변환
		return patients.stream().<PatientDTO>map(patient -> modelMapper.map(patient, PatientDTO.class)) // 명시적 타입 지정
				.collect(Collectors.toList());
	}

	public List<PatientDTO> getPatients(String name) {
		System.out.println("[PatientService - getPatients] Searching patients with name containing: " + name);
		List<Patient> patients = patientRepository.findByNameContainingIgnoreCase(name);

		// ModelMapper를 사용해 자동으로 변환
		return patients.stream().<PatientDTO>map(patient -> modelMapper.map(patient, PatientDTO.class)) // 명시적 타입 지정
				.collect(Collectors.toList());
	}

	public PatientService(PatientRepository patientRepository, VisitRepository visitRepository) {
		this.patientRepository = patientRepository;
		this.visitRepository = visitRepository;
	}

	public Patient getPatientWithVisits(Long subjectId) {
		Patient patient = patientRepository.findById(subjectId)
				.orElseThrow(() -> new EntityNotFoundException("환자를 찾을 수 없습니다."));
		List<Visit> visits = visitRepository.findByPatient(patient);
		patient.setVisits(visits); // 방문 기록 설정
		return patient;
	}

	// TAS 값을 기준으로 환자 목록 반환
	public List<Patient> getPatientsByTAS(Long tas) {
		return patientRepository.findDistinctByVisitsTASAndStaystatus(tas);
	}

	public List<Patient> getPatientsByStaystatus() {
		// TODO Auto-generated method stub
		return patientRepository.findDistinctByStaystatus();
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
			tasCountMap.putIfAbsent(i, 0L); // 없는 tas 값은 0으로 처리
		}

		return tasCountMap;
	}

	// 환자 생체 데이터
	public List<VitalSigns> getVitalSigns(Long stayId) {
		Visit visit = visitRepository.findByStayId(stayId);
		return vitalSignsRepository.findByVisit(visit);
	}

}
