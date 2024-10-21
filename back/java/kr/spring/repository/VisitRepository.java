// VisitRepository.java
package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.spring.entity.Patient;
import kr.spring.entity.Visit;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    // 환자 기록들
    List<Visit> findByPatient(Patient patient);

    // 환자 상세 조회
    List<Visit> findByPatient_SubjectId(Long subjectId);
}