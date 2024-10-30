package kr.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.AiTAS;


public interface AiTASRepository extends JpaRepository<AiTAS, Long> {

	AiTAS findByStayId(Long stayId);
	
	
}
