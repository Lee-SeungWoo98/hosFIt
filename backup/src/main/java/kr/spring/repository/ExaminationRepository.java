package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.LabTest;

public interface ExaminationRepository extends JpaRepository<LabTest, Long> {

	List<LabTest> findByVisitStayId(Long stayId);

}
