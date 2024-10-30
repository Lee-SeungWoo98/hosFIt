// PatientRepository.java
package kr.spring.repository;

import java.awt.print.Pageable;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    Page<Patient> findDistinctByStaystatus(PageRequest pageable);  // Pageable 추가
    
    @Query("SELECT v.TAS, COUNT(v.TAS) FROM Visit v WHERE v.staystatus = 1 GROUP BY v.TAS")
    List<Object[]> countPatientsByTas();
    
   
}