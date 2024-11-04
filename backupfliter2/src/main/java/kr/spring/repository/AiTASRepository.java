package kr.spring.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import kr.spring.dto.AiDTO;
import kr.spring.entity.AiTAS;


public interface AiTASRepository extends JpaRepository<AiTAS, String>  {

	
	 Optional<AiTAS> findByChartNum(String chartNum); // chartnum으로 AiTAS 조회
	
	
	 
	List<AiTAS> findAllByChartNum(String chartNum);
	
	@Query("SELECT new kr.spring.dto.AiDTO(a.level1, a.level2, a.level3) " +
	           "FROM AiTAS a")
	List<AiTASProjection> findAllProjectedBy();
}
