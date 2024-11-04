package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.BloodLevels;

public interface BloodLevelsRepository extends JpaRepository<BloodLevels, Long> {

	List<BloodLevels> findByBloodIdx(Long bloodIdx);

}
