package kr.spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import kr.spring.entity.BedInfo;

@Repository
public interface BedInfoRepository extends JpaRepository<BedInfo, Long> {
    // JpaRepository에서 제공하는 count() 메서드를 사용
}