package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.MedicalRecord;
import kr.spring.entity.Member;
import kr.spring.entity.Patient;
@Repository
public interface PatientRepository  extends JpaRepository<Patient, Long> {
    
    // 사용자명과 비밀번호로 사용자 찾기
//	@Query("SELECT p FROM Patient p WHERE p.subject_id = :subject_id")
//	Patient findBySubject_id(@Param("subject_id") Long subjectId);
//
//	
//	List<Patient> findByNameContainingIgnoreCase(String name);
	
	//@Query("SELECT subject_id FROM Patient")
//	List<Patient> findAll();
}

