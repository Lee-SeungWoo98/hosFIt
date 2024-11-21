package kr.spring.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.spring.entity.ErrorLog;

import java.util.List;

@Repository
public interface ErrorRepository extends JpaRepository<ErrorLog, Long> {

    // 에러 로그 저장 메서드
    ErrorLog save(ErrorLog error);

    // 심각도별로 로그를 생성일 기준 내림차순 정렬하여 제한된 개수로 가져오는 메서드
    List<ErrorLog> findBySeveritylevelOrderByCreatedatDesc(String severity, Pageable pageable);
}
