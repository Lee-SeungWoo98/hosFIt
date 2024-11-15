package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.BloodGasAnalysis;

public interface BloodGasAnalysisRepository extends JpaRepository<BloodGasAnalysis, Long>{
	
	List<BloodGasAnalysis> findByBloodIdx(Long bloodIdx);
}
