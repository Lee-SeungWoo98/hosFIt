// VisitRepository.java
package kr.spring.repository;

import java.util.List;
import java.util.Optional;
// LocalDateTime 사용을 위한 import 추가
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.Patient;
import kr.spring.entity.Visit;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    // 기존 코드 ---------------------------------------------------------

    // 특정 환자와 연관된 방문 기록들을 조회
    List<Visit> findByPatient(Patient patient);

    // stayId로 특정 방문 기록을 조회
    Visit findByStayId(Long stayId);

    // subjectId로 특정 방문 기록을 조회
    @Query("SELECT v FROM Visit v WHERE v.patient.subjectId = :subjectId")
    Optional<Visit> findBySubjectId(@Param("subjectId") Long subjectId);

    // label이 존재하는 방문 기록을 페이징 처리하여 조회
    @Query("SELECT v FROM Visit v WHERE v.label IS NOT NULL")
    Page<Visit> findByLabelIsNotNullWithPaging(Pageable pageable);

    // label이 존재하는 방문 기록의 개수를 반환
    long countByLabelIsNotNull();

    // 추가된 메서드 ------------------------------------------------------

    /**
     * 특정 기간 동안의 방문 기록 개수를 조회하는 메서드
     * 
     * @param startDate 조회 시작 날짜 및 시간
     * @param endDate   조회 종료 날짜 및 시간
     * @return          해당 기간 동안의 방문 기록 개수
     */
    @Query("SELECT COUNT(v) FROM Visit v WHERE v.visitDate BETWEEN :startDate AND :endDate")
    long countByVisitDateBetween(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
}
