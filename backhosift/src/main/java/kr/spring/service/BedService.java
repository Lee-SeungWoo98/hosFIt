package kr.spring.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.spring.entity.BedInfo;
import kr.spring.repository.BedInfoRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BedService {

    @Autowired
    private BedInfoRepository bedInfoRepository;

    @Transactional(readOnly = true)
    public int getBedCount() {
        try {
            return bedInfoRepository.findById(1L)
                    .map(BedInfo::getTotalBeds)
                    .orElseGet(() -> {
                        // 기본값 설정 및 저장
                        BedInfo defaultBedInfo = new BedInfo(1L, 1L, 42, LocalDateTime.now(), "default");
                        BedInfo saved = bedInfoRepository.save(defaultBedInfo);
                        return saved.getTotalBeds();
                    });
        } catch (Exception e) {
            log.error("병상 수 조회 중 오류 발생", e);
            return 42;  // 기본값
        }
    }

    @Transactional
    public void updateBedCount(int totalBeds) {
        if (totalBeds < 1) {
            throw new IllegalArgumentException("병상 수는 1개 이상이어야 합니다.");
        }

        try {
            BedInfo bedInfo = bedInfoRepository.findById(1L)
                    .orElse(new BedInfo(1L, 1L, totalBeds, LocalDateTime.now(), "admin"));

            bedInfo.setTotalBeds(totalBeds);
            bedInfo.setLastUpdated(LocalDateTime.now());
            bedInfo.setLastUpdatedBy("admin");

            bedInfoRepository.save(bedInfo);
            log.info("병상 수가 {}개로 업데이트되었습니다.", totalBeds);
        } catch (Exception e) {
            log.error("병상 수 업데이트 중 오류 발생", e);
            throw new RuntimeException("병상 수 업데이트에 실패했습니다.", e);
        }
    }
}