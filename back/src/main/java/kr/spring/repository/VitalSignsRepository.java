package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;

public interface VitalSignsRepository extends JpaRepository<VitalSigns, String> {
	List<VitalSigns> findByVisitStayId(Long stayId); // stayId로 VitalSigns 조회

	List<VitalSigns> findByVisit(Visit visit);
}
