package kr.spring.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
        initializeCache();
    }
    
    @PostConstruct
    private void initializeCache() {
        log.info("Initializing threshold cache");
        List<ThresholdEntity> thresholds = thresholdRepository.findAll();
        thresholds.forEach(t -> thresholdCache.put(t.getThresholdKey(), t.getThresholdValue()));
        
        // 기본값 설정
        setDefaultIfMissing("0", 0.7f); // 중증병동
        setDefaultIfMissing("1", 0.4f); // 일반병동
        setDefaultIfMissing("2", 0.2f); // 퇴원
    }
    
    private void setDefaultIfMissing(String key, float defaultValue) {
        if (!thresholdCache.containsKey(key)) {
            log.info("Setting default value for key {}: {}", key, defaultValue);
            ThresholdEntity entity = new ThresholdEntity();
            entity.setThresholdKey(key);
            entity.setThresholdValue(defaultValue);
            entity.setLastModifiedDate(LocalDateTime.now());
            entity.setLastModifiedBy("system");
            thresholdRepository.save(entity);
            thresholdCache.put(key, defaultValue);
        }
    }
    
    public Map<String, Float> getAllThresholds() {
        return new HashMap<>(thresholdCache);
    }
    
    public Float getThreshold(String key) {
        return thresholdCache.get(key);
    }
    
    @Transactional
    public void updateThreshold(String key, Float value, String modifiedBy) {
        log.info("Updating threshold - key: {}, value: {}, modifiedBy: {}", key, value, modifiedBy);
        
        if (value == null || value < 0 || value > 1) {
            throw new IllegalArgumentException("Threshold value must be between 0 and 1");
        }
        
        ThresholdEntity threshold = thresholdRepository.findByThresholdKey(key)
            .orElseGet(() -> {
                ThresholdEntity newEntity = new ThresholdEntity();
                newEntity.setThresholdKey(key);
                return newEntity;
            });
            
        threshold.setThresholdValue(value);
        threshold.setLastModifiedDate(LocalDateTime.now());
        threshold.setLastModifiedBy(modifiedBy);
        
        thresholdRepository.save(threshold);
        thresholdCache.put(key, value);
        
        log.info("Threshold updated successfully - key: {}, value: {}", key, value);
    }
    
    public List<Map<String, Object>> getThresholdsForDisplay() {
        log.info("Getting thresholds for display");
        List<Map<String, Object>> result = new ArrayList<>();
        Map<String, Float> thresholds = getAllThresholds();
        
        thresholds.forEach((key, value) -> {
            Map<String, Object> thresholdMap = new HashMap<>();
            thresholdMap.put("key", key);
            thresholdMap.put("value", value);
            result.add(thresholdMap);
        });
        
        log.info("Retrieved {} thresholds for display", result.size());
        return result;
    }
}