package kr.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import kr.spring.entity.BedInfo;

@Repository
public interface BedInfoRepository extends JpaRepository<BedInfo, Long> {
    @Query("SELECT COALESCE(SUM(b.totalBeds), 0) FROM BedInfo b")
    long count();
}