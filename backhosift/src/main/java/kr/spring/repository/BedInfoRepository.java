package kr.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import kr.spring.entity.BedInfo;

@Repository
public interface BedInfoRepository extends JpaRepository<BedInfo, Long> {
    // JpaRepository에서 제공하는 count() 메서드를 사용
	
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "update bedinfo set available = 0")
	void saveAvailibleInit();
	
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "update bedinfo set available = 1 where bednum between 1 and :num")
	void saveAvailible(int num);

	@Query(nativeQuery = true, value = "SELECT count(available) FROM bedinfo WHERE available = 1")
	long countByAvailable();
}