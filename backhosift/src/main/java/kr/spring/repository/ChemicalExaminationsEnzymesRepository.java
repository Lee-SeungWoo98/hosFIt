package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.ChemicalExaminationsEnzymes;

public interface ChemicalExaminationsEnzymesRepository extends JpaRepository<ChemicalExaminationsEnzymes, Long> {

	List<ChemicalExaminationsEnzymes> findByBloodIdx(Long bloodIdx);
	

}
