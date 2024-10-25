package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import kr.spring.entity.LabTest;

public interface ExaminationRepository extends JpaRepository<LabTest, Long> {

	
		List<LabTest> findByVisitStayId(@Param("stayId") Long stayId);


}
