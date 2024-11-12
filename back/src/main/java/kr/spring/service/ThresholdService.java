package kr.spring.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        List<ThresholdEntity> thresholds = thresholdRepository.findAll();
        thresholds.forEach(t -> thresholdCache.put(t.getThresholdKey(), t.getThresholdValue()));
    }
    
    public Map<String, Float> getAllThresholds() {
        return new HashMap<>(thresholdCache);
    }
    
    public Float getThreshold(String key) {
        return thresholdCache.get(key);
    }
    
    @Transactional
    public void updateThreshold(String key, Float value, String modifiedBy) {
        ThresholdEntity threshold = thresholdRepository.findByThresholdKey(key)
            .orElseThrow(() -> new IllegalArgumentException("Invalid threshold key: " + key));
            
        threshold.setThresholdValue(value);
        threshold.setLastModifiedDate(LocalDateTime.now());
        
        thresholdRepository.save(threshold);
        thresholdCache.put(key, value);
        
        log.info("Threshold updated - key: {}, value: {}", key, value);
    }
}