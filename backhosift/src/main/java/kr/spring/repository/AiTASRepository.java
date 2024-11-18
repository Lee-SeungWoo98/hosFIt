package kr.spring.repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import kr.spring.dto.AiDTO;
import kr.spring.entity.AiTAS;

public interface AiTASRepository extends JpaRepository<AiTAS, String> {
    
    // VitalSigns의 chartNum을 통한 조회
    Optional<AiTAS> findFirstByVitalSigns_ChartNum(String chartNum);
    
    List<AiTAS> findAllByVitalSigns_ChartNum(String chartNum);
    
    @Query("SELECT new kr.spring.dto.AiDTO(a.level1, a.level2, a.level3) FROM AiTAS a")
    List<AiTASProjection> findAllProjectedBy();
    
    List<AiTAS> findByChartNum(String chartNum);
    
    Optional<AiTAS> findByVitalSigns_ChartNum(String chartNum);
    
    @Query("SELECT a FROM AiTAS a JOIN a.vitalSigns v JOIN v.visit vis WHERE vis.patient.subjectId = :subjectId")
    List<AiTAS> findByPatientSubjectId(@Param("subjectId") Long subjectId);
    
    @Query("SELECT a FROM AiTAS a JOIN a.vitalSigns v WHERE v.chartNum IN :chartNums")
    List<AiTAS> findByVitalSigns_ChartNumIn(@Param("chartNums") List<String> chartNums);
    
    @Query("SELECT a FROM AiTAS a JOIN a.vitalSigns v WHERE v.chartNum = :chartNum ORDER BY a.id DESC") 
    List<AiTAS> findByVitalSigns_ChartNumOrderByIdDesc(@Param("chartNum") String chartNum);
}