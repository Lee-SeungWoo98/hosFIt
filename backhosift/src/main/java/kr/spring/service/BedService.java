package kr.spring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import kr.spring.repository.BedInfoRepository;

@Service
public class BedService {

    @Autowired
    private BedInfoRepository bedInfoRepository;

    public long countAllBeds() {
        return bedInfoRepository.count();
    }

    @Transactional
    public void updateTotalBeds(int totalBeds, String updatedBy) {
        // 기존 bedInfo가 없다면 새로 생성
        BedInfo bedInfo = bedInfoRepository.findById(1L)
            .orElse(BedInfo.builder()
                .bedNum(1L)
                .roomNum(1L)
                .build());
        
        bedInfo.setTotalBeds(totalBeds);
        bedInfo.setLastUpdated(LocalDateTime.now());
        bedInfo.setLastUpdatedBy(updatedBy);
        
        bedInfoRepository.save(bedInfo);
    }
}