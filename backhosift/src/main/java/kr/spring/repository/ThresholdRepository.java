package kr.spring.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.spring.entity.ThresholdEntity;

@Repository
public interface ThresholdRepository extends JpaRepository<ThresholdEntity, Long> {
    Optional<ThresholdEntity> findByThresholdKey(String key);
}