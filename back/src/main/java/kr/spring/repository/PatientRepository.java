// PatientRepository.java
package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.dto.PatientDTO;
import kr.spring.entity.Patient;



@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
	List<Patient> findByNameContainingIgnoreCase(String name);

    Patient findBySubjectId(Long subjectId);
    // TAS 값에 따라 필터링된 환자 목록을 반환
    List<Patient> findDistinctByVisitsTAS(Long tas);
    
    @Query("SELECT DISTINCT p FROM Patient p JOIN p.visits v WHERE v.TAS = :tas AND v.staystatus = 1")
    List<Patient> findDistinctByVisitsTASAndStaystatus(@Param("tas") Long tas);

    @Query("SELECT DISTINCT p FROM Patient p JOIN p.visits v WHERE v.staystatus = 1")
    List<Patient> findDistinctByStaystatus();
   
}