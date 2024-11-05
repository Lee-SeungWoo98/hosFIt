package kr.spring.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.Patient;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>,JpaSpecificationExecutor<Patient> {

    // 이름 검색 기능
    List<Patient> findByNameContainingIgnoreCase(String name);

    // Subject ID로 환자 검색
    Patient findBySubjectId(Long subjectId);

    // 특정 tas 값으로 필터링된 환자 목록
    List<Patient> findDistinctByVisitsTas(Long tas);

    // 특정 tas와 staystatus 조건을 기반으로 필터링된 환자 목록
    @Query("SELECT DISTINCT p FROM Patient p JOIN p.visits v WHERE v.tas = :tas AND v.staystatus = 1")
    List<Patient> findDistinctByVisitsTasAndStaystatus(@Param("tas") Long tas);

    // 특정 staystatus 조건을 기반으로 필터링된 환자 목록 (페이지네이션)
    @Query("SELECT DISTINCT p FROM Patient p JOIN p.visits v WHERE v.staystatus = 1")
    Page<Patient> findDistinctByStaystatus(Pageable pageable);

    // tas별 환자 수를 반환
    @Query("SELECT v.tas, COUNT(v.tas) FROM Visit v WHERE v.staystatus = 1 GROUP BY v.tas")
    List<Object[]> countPatientsByTas();

    // 필터 조건(name, gender, tas, pain)을 통해 환자 목록 검색 (페이지네이션)
    @Query("SELECT DISTINCT p FROM Patient p JOIN p.visits v WHERE " +
           "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:gender IS NULL OR p.gender = :gender) AND " +
           "(:tas IS NULL OR v.tas = :tas) AND " +
           "(:pain IS NULL OR v.pain = :pain) AND " +
           "v.staystatus = 1")
    Page<Patient> findByFilters(
        @Param("name") String name,
        @Param("gender") Long gender,
        @Param("tas") Long tas,
        @Param("pain") Long pain,
        Pageable pageable
    );
    
    @Query(value = "SELECT p.subjectid AS subjectId, p.name, p.gender, p.birthdate AS birthdate, p.age, p.address, " +
            "p.pregnancystatus, p.phonenumber, p.residentnum, " +
            "v.stayid AS stayId, v.pain, v.loshours, v.tas, v.arrivaltransport, v.label, v.visitdate AS visitdate, " +
            "vs.chartnum AS chartNum, vs.charttime AS chartTime, vs.heartrate, vs.resprate, vs.o2sat, vs.sbp, vs.dbp, vs.temperature, vs.regdate AS regdate, " +
            "a.chartnum AS aiTASChartNum, a.level1, a.level2, a.level3 " +
            "FROM patient p " +
            "JOIN visit v ON p.subjectid = v.subjectid " +
            "JOIN vitalsigns vs ON v.stayid = vs.stayid " +
            "LEFT JOIN aiTAS a ON vs.chartnum = a.chartnum " +
            "WHERE p.subjectid = :subjectId", nativeQuery = true)
    List<PatientProjection> findPatientDataBySubjectId(@Param("subjectId") Long subjectId);
    //오름차순 
    @Query(value = "SELECT p.subjectid AS subjectId, p.name, p.gender, p.birthdate AS birthdate, p.age, p.address, " +
            "p.pregnancystatus, p.phonenumber, p.residentnum, " +
            "v.stayid AS stayId, v.pain, v.loshours, v.tas, v.arrivaltransport, v.label, v.visitdate AS visitdate, " +
            "vs.chartnum AS chartNum, vs.charttime AS chartTime, vs.heartrate, vs.resprate, vs.o2sat, vs.sbp, vs.dbp, vs.temperature, vs.regdate AS regdate, " +
            "a.chartnum AS aiTASChartNum, a.level1, a.level2, a.level3 " +
            "FROM patient p " +
            "JOIN visit v ON p.subjectid = v.subjectid " +
            "JOIN vitalsigns vs ON v.stayid = vs.stayid " +
            "LEFT JOIN aiTAS a ON vs.chartnum = a.chartnum " +
            "WHERE p.subjectid = :subjectId " +
            "ORDER BY v.visitdate ASC", nativeQuery = true)
    List<PatientProjection> findPatientDataBySubjectIdOrderByVisitDateAsc(@Param("subjectId") Long subjectId);

    // 내림차순 정렬 쿼리
    @Query(value = "SELECT p.subjectid AS subjectId, p.name, p.gender, p.birthdate AS birthdate, p.age, p.address, " +
            "p.pregnancystatus, p.phonenumber, p.residentnum, " +
            "v.stayid AS stayId, v.pain, v.loshours, v.tas, v.arrivaltransport, v.label, v.visitdate AS visitdate, " +
            "vs.chartnum AS chartNum, vs.charttime AS chartTime, vs.heartrate, vs.resprate, vs.o2sat, vs.sbp, vs.dbp, vs.temperature, vs.regdate AS regdate, " +
            "a.chartnum AS aiTASChartNum, a.level1, a.level2, a.level3 " +
            "FROM patient p " +
            "JOIN visit v ON p.subjectid = v.subjectid " +
            "JOIN vitalsigns vs ON v.stayid = vs.stayid " +
            "LEFT JOIN aiTAS a ON vs.chartnum = a.chartnum " +
            "WHERE p.subjectid = :subjectId " +
            "ORDER BY v.visitdate DESC", nativeQuery = true)
    List<PatientProjection> findPatientDataBySubjectIdOrderByVisitDateDesc(@Param("subjectId") Long subjectId);
    
}

