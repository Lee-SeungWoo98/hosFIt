package kr.spring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.entity.MedicalRecord;
import kr.spring.entity.Member;
import kr.spring.entity.Patient;
import kr.spring.repository.MedicalRecordRepository;
import kr.spring.repository.MemberRepository;
import kr.spring.repository.PatientRepository;

@Service
public class PatientService {
	@Autowired
	private PatientRepository repository;
	private PatientRepository patientRepository;
	private MedicalRecordRepository medicalRecordRepository;
	
	public List<Patient> getAllPatients() {
		System.out.println(repository.findAll().size());
		return repository.findAll();
	}

//	public List<Patient> getPatients(String name) {
//		return repository.findByNameContainingIgnoreCase(name);
//	}
//
//	  // subject_id로 환자 조회
//    public Patient getPatientBySubject_id(Long subject_id) {
//        return patientRepository.findBySubject_id(subject_id);
//    }
//
//    // subject_id로 환자의 의료 기록 조회
//    public List<MedicalRecord> getPatientRecords(Long subject_id) {
//        return medicalRecordRepository.findBySubject_id(subject_id); // 의료 기록 레포지토리 사용
//    }
//    public List<Long> getAllSubjectIds() {
//        return repository.findAllSubjectIds();
//    }
    
    public List<Patient> getAllSubjectIds() {
        return repository.findAll();
    }

}
