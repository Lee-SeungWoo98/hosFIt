package kr.spring.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;

public interface VitalSignsRepository extends JpaRepository<VitalSigns, String> {
   
     @Query("SELECT v FROM VitalSigns v LEFT JOIN WardAssignment w ON v.chartNum = w.chartNum " +
              "WHERE w.id IS NULL AND v.visit IS NOT NULL")
       Page<VitalSigns> findVitalSignsWithoutWardAssignment(Pageable pageable);
   

   
   List<VitalSigns> findByVisitStayId(Long stayId);
   
   List<VitalSigns> findByVisit(Visit visit);
   
   @Query("SELECT COUNT(v) FROM VitalSigns v")
   long countAllVitalSigns();

   @Query("SELECT COUNT(v) FROM VitalSigns v WHERE v.visit IS NOT NULL")
   long countVitalSignsWithVisit();

   @Query("SELECT COUNT(a) FROM AiTAS a")
   long countAllAiTAS();

   @Query("SELECT COUNT(w) FROM WardAssignment w")
   long countAllWardAssignments();
   
   @Query("SELECT v FROM VitalSigns v WHERE v.visit.stayId = :stayId ORDER BY v.chartTime")
   List<VitalSigns> findByVisitStayIdOrderByChartTime(@Param("stayId") Long stayId);
   
   // chartNum을 숫자로 변환하여 최대값 찾기
   @Query(value = "SELECT MAX(CAST(SUBSTRING(chartnum, 2) AS SIGNED)) FROM vitalsigns", nativeQuery = true)
   Optional<Integer> findMaxChartNumValue();
   
   // 백업용으로 기존 메서드 유지
   @Query("SELECT MAX(v.chartNum) FROM VitalSigns v")
   Optional<String> findMaxChartNum();
   
   int countByVisit(Visit visit);
   
   @Query("SELECT v FROM VitalSigns v " +
             "LEFT JOIN v.aiTAS a " +
             "LEFT JOIN WardAssignment w ON w.chartNum = v.chartNum " +
             "WHERE w.id IS NULL AND v.visit IS NOT NULL")
      List<VitalSigns> findVitalSignsWithoutWardAssignment();
   @Query("SELECT COUNT(v) > 0 FROM VitalSigns v " +
          "WHERE v.chartNum = :chartNum")
   boolean existsByChartNum(@Param("chartNum") String chartNum);
   
   @Query("SELECT v FROM VitalSigns v " +
          "WHERE v.chartNum = :chartNum AND v.visit.stayId = :stayId")
   Optional<VitalSigns> findByChartNumAndStayId(
       @Param("chartNum") String chartNum, 
       @Param("stayId") Long stayId
   );
   
   // 특정 stayId의 VitalSigns 수를 계산
   @Query("SELECT COUNT(v) FROM VitalSigns v " +
          "WHERE v.visit.stayId = :stayId")
   Long countByStayId(@Param("stayId") Long stayId);
   
   // AiTAS가 처리되지 않은 VitalSigns 조회
   @Query("SELECT v FROM VitalSigns v " +
          "WHERE v.visit.stayId = :stayId " +
          "AND v.aiTAS IS NULL " +
          "ORDER BY v.chartTime")
   List<VitalSigns> findUnprocessedByStayId(@Param("stayId") Long stayId);
   
   // 가장 최근 ChartNum 조회
   @Query("SELECT v FROM VitalSigns v WHERE v.chartNum = (" +
          "SELECT MAX(v2.chartNum) FROM VitalSigns v2)")
   Optional<VitalSigns> findLatestVitalSign();
   
   // 특정 stayId의 가장 최근 VitalSigns 조회
   @Query("SELECT v FROM VitalSigns v " +
          "WHERE v.visit.stayId = :stayId " +
          "ORDER BY v.chartTime DESC")
   List<VitalSigns> findLatestByStayId(@Param("stayId") Long stayId, Pageable pageable);
   
   @Query("SELECT v FROM VitalSigns v JOIN v.visit vis WHERE vis.stayId = :stayId")
   Optional<VitalSigns> findVitalSignsByStayId(@Param("stayId") Long stayId);
   //stayid범위에따라 
   @Query("SELECT v FROM VitalSigns v WHERE v.visit.stayId BETWEEN :startId AND :endId")
   List<VitalSigns> findByVisit_StayIdBetween(
       @Param("startId") Long startId, 
       @Param("endId") Long endId, 
       Pageable pageable
   );
   
  
}


