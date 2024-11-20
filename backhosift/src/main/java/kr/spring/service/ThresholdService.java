package kr.spring.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.spring.entity.ThresholdEntity;
import kr.spring.repository.ThresholdRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ThresholdService {
    private final ThresholdRepository thresholdRepository;
    private final Map<String, Float> thresholdCache = new ConcurrentHashMap<>();
    
    @Autowired
    public ThresholdService(ThresholdRepository thresholdRepository) {
        this.thresholdRepository = thresholdRepository;
    }
    
    @PostConstruct
    private void initializeCache() {
        try {
            List<ThresholdEntity> thresholds = thresholdRepository.findAll();
            thresholds.forEach(t -> thresholdCache.put(t.getThresholdKey(), t.getThresholdValue()));
            log.info("Threshold cache initialized with {} values", thresholds.size());
        } catch (Exception e) {
            log.error("Error initializing threshold cache", e);
            // 기본값 설정
            thresholdCache.put("0", 0.7f);
            thresholdCache.put("1", 0.4f);
            thresholdCache.put("2", 0.2f);
        }
    }
    
    public Map<String, Float> getAllThresholds() {
        return new HashMap<>(thresholdCache);
    }
    
    public List<Map<String, Object>> getThresholdsForDisplay() {
        List<ThresholdEntity> thresholds = thresholdRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();
        
        for (ThresholdEntity threshold : thresholds) {
            Map<String, Object> thresholdMap = new HashMap<>();
            thresholdMap.put("key", threshold.getThresholdKey());
            thresholdMap.put("value", threshold.getThresholdValue());
            result.add(thresholdMap);
        }
        
        log.info("Retrieved {} thresholds for display", result.size());
        return result;
    }
    
    @Transactional
    public void updateThreshold(String key, Float value, String modifiedBy) {
        try {
            log.info("Updating threshold - key: {}, value: {}, modifiedBy: {}", key, value, modifiedBy);
            
            ThresholdEntity threshold = thresholdRepository.findByThresholdKey(key)
                .orElseGet(() -> {
                    ThresholdEntity newThreshold = new ThresholdEntity();
                    newThreshold.setThresholdKey(key);
                    return newThreshold;
                });
            
            threshold.setThresholdValue(value);
            threshold.setLastModifiedDate(LocalDateTime.now());
            threshold.setLastModifiedBy(modifiedBy);
            
            thresholdRepository.save(threshold);
            thresholdCache.put(key, value);
            
            log.info("Successfully updated threshold - key: {}, value: {}", key, value);
        } catch (Exception e) {
            log.error("Error updating threshold - key: {}, value: {}", key, value, e);
            throw new RuntimeException("Failed to update threshold: " + e.getMessage());
        }
    }

    public Float getThreshold(String key) {
        return thresholdCache.getOrDefault(key, 0.0f);
    }
}