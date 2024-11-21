package kr.spring.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.spring.entity.BedInfo;
import kr.spring.repository.BedInfoRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BedService {

    @Autowired
    private BedInfoRepository bedInfoRepository;

    // 병상 수 조회
    public int getBedCount() {
        try {
            // 병상 정보가 없으면 초기값 42로 설정
            return bedInfoRepository.findById(1L)
                    .map(BedInfo::getTotalBeds)
                    .orElse(42);
        } catch (Exception e) {
            log.error("Error while getting bed count", e);
            return 42;  // 예외 발생 시에도 초기값 42 반환
        }
    }

    // 병상 수 업데이트
    @Transactional
    public void updateBedCount(int totalBeds) {
        if (totalBeds < 1) {
            throw new IllegalArgumentException("병상 수는 1 이상이어야 합니다.");
        }

        try {
            BedInfo bedInfo = bedInfoRepository.findById(1L)
                    .orElse(new BedInfo(1L, 1L, 42, LocalDateTime.now(), "default"));

            bedInfo.setTotalBeds(totalBeds);
            bedInfo.setLastUpdated(LocalDateTime.now());
            bedInfo.setLastUpdatedBy("admin");

            bedInfoRepository.save(bedInfo);
        } catch (Exception e) {
            log.error("Error while updating bed count", e);
            throw e;
        }
    }
}
