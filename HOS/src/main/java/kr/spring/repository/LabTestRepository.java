package kr.spring.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.LabTest;
import kr.spring.entity.Visit;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    
    // 특정 Visit에 속한 모든 LabTest 조회
    List<LabTest> findByVisit(Visit visit);
    
    // bloodIdx로 LabTest 조회
    Optional<LabTest> findByBloodIdx(Long bloodIdx);
    
    // Visit의 stayId로 LabTest 목록 조회
    @Query("SELECT l FROM LabTest l WHERE l.visit.stayId = :stayId")
    List<LabTest> findByVisitStayId(@Param("stayId") Long stayId);
    
    // 특정 기간 내의 검사 결과 조회
    @Query("SELECT l FROM LabTest l WHERE l.visit.stayId = :stayId " +
           "AND l.testTime BETWEEN :startTime AND :endTime")
    List<LabTest> findByVisitAndTimeRange(
        @Param("stayId") Long stayId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );
    
    // 특정 환자(SubjectId)의 모든 검사 결과 조회
    @Query("SELECT l FROM LabTest l WHERE l.visit.patient.subjectId = :subjectId")
    List<LabTest> findBySubjectId(@Param("subjectId") Long subjectId);
    
    // Visit에 대한 LabTest 수 계산
    long countByVisit(Visit visit);
    
    // 특정 stayId에 대한 LabTest 수 계산
    @Query("SELECT COUNT(l) FROM LabTest l WHERE l.visit.stayId = :stayId")
    long countByStayId(@Param("stayId") Long stayId);
    
    // bloodIdx 존재 여부 확인
    boolean existsByBloodIdx(Long bloodIdx);
    
    // 가장 최근 LabTest 조회
    @Query("SELECT l FROM LabTest l ORDER BY l.testTime DESC")
    List<LabTest> findLatestLabTests(Pageable pageable);
    
    // 특정 Visit의 가장 최근 LabTest 조회
    @Query("SELECT l FROM LabTest l WHERE l.visit = :visit " +
           "ORDER BY l.testTime DESC")
    Optional<LabTest> findLatestByVisit(@Param("visit") Visit visit);
    
    // stayId 범위에 따른 LabTest 조회
    @Query("SELECT l FROM LabTest l WHERE l.visit.stayId BETWEEN :startId AND :endId")
    List<LabTest> findByStayIdBetween(
        @Param("startId") Long startId,
        @Param("endId") Long endId,
        Pageable pageable
    );

    // 특정 진단 코드에 해당하는 LabTest 조회
    List<LabTest> findByDiagnosisCode(String diagnosisCode);
    
    // 특정 검사 이름으로 LabTest 조회
    List<LabTest> findByTestName(String testName);
    
    // 특정 Visit의 LabTest를 시간순으로 정렬하여 조회
    @Query("SELECT l FROM LabTest l WHERE l.visit = :visit ORDER BY l.testTime")
    List<LabTest> findByVisitOrderByTestTime(@Param("visit") Visit visit);
    
    // 특정 기간 내의 모든 LabTest 조회
    @Query("SELECT l FROM LabTest l WHERE l.testTime BETWEEN :startTime AND :endTime")
    List<LabTest> findByTimeRange(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        Pageable pageable
    );
    
    // 검사 결과가 없는 Visit 조회
    @Query("SELECT v FROM Visit v LEFT JOIN LabTest l ON v = l.visit " +
           "WHERE l.bloodIdx IS NULL")
    List<Visit> findVisitsWithoutLabTests(Pageable pageable);
}