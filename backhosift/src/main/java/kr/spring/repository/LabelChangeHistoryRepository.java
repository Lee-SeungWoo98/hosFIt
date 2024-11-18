package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import kr.spring.entity.LabelChangeHistory;

@Repository
public interface LabelChangeHistoryRepository extends JpaRepository<LabelChangeHistory, Long> {
    List<LabelChangeHistory> findByStayIdOrderByChangeTimeDesc(Long stayId);
}
