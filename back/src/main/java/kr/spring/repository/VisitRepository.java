// VisitRepository.java
package kr.spring.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.Patient;
import kr.spring.entity.Visit;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    // 환자 기록들
    List<Visit> findByPatient(Patient patient);

	Visit findByStayId(Long stayId);
	  @Query("SELECT v FROM Visit v WHERE v.patient.subjectId = :subjectId")
	    Optional<Visit> findBySubjectId(@Param("subjectId") Long subjectId);
  
}