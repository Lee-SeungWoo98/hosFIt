package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.EnzymesMetabolism;

public interface EnzymesMetabolismRepository extends JpaRepository<EnzymesMetabolism, Long> {

	List<EnzymesMetabolism> findByBloodIdx(Long bloodIdx);

}
