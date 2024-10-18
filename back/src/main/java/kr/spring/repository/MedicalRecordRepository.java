package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.MedicalRecord;


@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    // subject_id로 의료 기록 조회
    @Query("SELECT m FROM MedicalRecord m WHERE m.subject_id = :subject_id")
    List<MedicalRecord> findBySubject_id(@Param("subject_id") Long subjectId);
    

}