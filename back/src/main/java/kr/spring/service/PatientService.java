// PatientService.java
package kr.spring.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

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

    public List<Visit> getVisitsRecordBySubjectId(Long subjectId) {
        System.out.println("[PatientService - getVisitsRecordBySubjectId] Fetching visits for subjectId: " + subjectId);
        List<Visit> visits = visitRepository.findByPatient_SubjectId(subjectId);
        System.out.println("[PatientService - getVisitsRecordBySubjectId] Result: " + visits);
        return visits;
    }

    public List<Visit> getVisitsRecordByPatient(Patient patient) {
        System.out.println("[PatientService - getVisitsRecordByPatient] Fetching visits for patient: " + patient);
        return visitRepository.findByPatient(patient);
    }
}
