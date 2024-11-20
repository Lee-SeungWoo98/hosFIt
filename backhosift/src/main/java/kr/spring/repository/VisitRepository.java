package kr.spring.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import javax.persistence.LockModeType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.Patient;
import kr.spring.entity.Visit;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    List<Visit> findByPatient(Patient patient);
    
    Visit findByStayId(Long stayId);
    
    @Query("SELECT v FROM Visit v WHERE v.patient.subjectId = :subjectId")
    Optional<Visit> findBySubjectId(@Param("subjectId") Long subjectId);
    
    @Query("SELECT v FROM Visit v WHERE v.label IS NOT NULL")
    Page<Visit> findByLabelIsNotNullWithPaging(Pageable pageable);
    
    @Query("SELECT v FROM Visit v WHERE v.label IS NOT NULL")
    List<Visit> findAllWithLabel();
    
    long countByLabelIsNotNull();
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT v FROM Visit v WHERE v.stayId = :stayId")
    Optional<Visit> findByStayIdWithLock(@Param("stayId") Long stayId);

    @Query("SELECT COUNT(v) FROM Visit v WHERE v.visitDate BETWEEN :startDate AND :endDate")
    long countByVisitDateBetween(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}