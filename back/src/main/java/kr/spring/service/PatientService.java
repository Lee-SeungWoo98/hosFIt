// PatientService.java
package kr.spring.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;  // 알 수 없는 오류....
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.dto.PatientDTO;
import kr.spring.entity.Patient;
import kr.spring.entity.Visit;
import kr.spring.repository.PatientRepository;
import kr.spring.repository.VisitRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private VisitRepository visitRepository;
    @Autowired
    private ModelMapper modelMapper;

 // 모든 환자 조회 (환자 정보만 반환)
    public List<PatientDTO> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();

        // 환자 정보만 반환 (방문 기록은 제외)
        return patients.stream()
                .map(patient -> {
                    PatientDTO dto = modelMapper.map(patient, PatientDTO.class);
                    dto.setVisits(Collections.emptyList()); // 방문 기록을 빈 리스트로 설정
                    return dto;
                })
                .collect(Collectors.toList());
    }
    public List<Patient> getPatients(String name) {
        System.out.println("[PatientService - getPatients] Searching patients with name containing: " + name);
        return patientRepository.findByNameContainingIgnoreCase(name);
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

}
