package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;

public interface VitalSignsRepository extends JpaRepository<VitalSigns, String> {
	List<VitalSigns> findByVisitStayId(Long stayId); // stayId로 VitalSigns 조회

	List<VitalSigns> findByVisit(Visit visit);
	
	   @Query("SELECT v FROM VitalSigns v WHERE v.visit.stayId = :stayId ORDER BY v.chartTime")
	    List<VitalSigns> findByVisitStayIdOrderByChartTime(@Param("stayId") Long stayId);
	   


}
