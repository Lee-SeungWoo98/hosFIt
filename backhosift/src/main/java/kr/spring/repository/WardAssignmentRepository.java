package kr.spring.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.entity.WardAssignment;

@Repository
public interface WardAssignmentRepository extends JpaRepository<WardAssignment, Long> {


	 boolean existsByChartNum(String chartNum);
	 @Query("SELECT w FROM WardAssignment w " +
	           "WHERE w.visit.stayId IN :stayIds AND w.chartNum IN " +
	           "(SELECT MAX(w2.chartNum) FROM WardAssignment w2 WHERE w2.visit.stayId = w.visit.stayId)")
	    List<WardAssignment> findLatestByStayIds(@Param("stayIds") List<Long> stayIds);
	 
	 Optional<WardAssignment> findByChartNum(String chartNum);
}