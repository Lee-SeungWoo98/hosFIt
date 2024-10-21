// PatientService.java
package kr.spring.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<Patient> getAllPatients() {
        System.out.println("[PatientService - getAllPatients] Fetching all patients from repository");
        return patientRepository.findAll();
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
