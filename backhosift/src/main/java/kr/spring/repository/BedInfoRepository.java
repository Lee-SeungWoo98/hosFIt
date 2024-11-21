package kr.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.spring.entity.BedInfo;

@Repository
public interface BedInfoRepository extends JpaRepository<BedInfo, Long> {
    // 기본 JpaRepository 메서드를 사용합니다.
}
