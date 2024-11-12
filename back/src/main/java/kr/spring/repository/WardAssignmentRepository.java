package kr.spring.repository;

import java.util.List;

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
}