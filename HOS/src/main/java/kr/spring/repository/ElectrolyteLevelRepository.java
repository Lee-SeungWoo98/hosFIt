package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.BloodLevels;
import kr.spring.entity.ElectrolyteLevel;

public interface ElectrolyteLevelRepository extends JpaRepository<ElectrolyteLevel, Long>{

	List<ElectrolyteLevel> findByBloodIdx(Long bloodIdx);

}
