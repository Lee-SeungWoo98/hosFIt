// PatientService.java
package kr.spring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.entity.MedicalRecord;
import kr.spring.entity.Patient;
import kr.spring.repository.MedicalRecordRepository;
import kr.spring.repository.PatientRepository;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public List<Patient> getPatients(String name) {
        return patientRepository.findByNameContainingIgnoreCase(name);
    }

    public Patient getPatientById(Long patientId) {
        return patientRepository.findByPatientid(patientId);
    }

    public List<MedicalRecord> getPatientRecords(Patient patient) {
        return medicalRecordRepository.findByPatient(patient);
    }
}