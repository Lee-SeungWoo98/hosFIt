package kr.spring.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.service.ThresholdService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/thresholds")
public class ThresholdController {
   
    @Autowired
    private ThresholdService thresholdService;

    @GetMapping
    public ResponseEntity<Map<String, Float>> getAllThresholds() {
        try {
            Map<String, Float> thresholds = thresholdService.getAllThresholds();
            log.info("Retrieved all thresholds: {}", thresholds);
            return ResponseEntity.ok(thresholds);
        } catch (Exception e) {
            log.error("Error retrieving thresholds", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/display")
    public ResponseEntity<List<Map<String, Object>>> displayThresholds() {
        try {
            List<Map<String, Object>> result = thresholdService.getThresholdsForDisplay();
            log.info("Returned thresholds data: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error displaying thresholds", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/{key}")
    public ResponseEntity<?> updateThreshold(
        @PathVariable String key, 
        @RequestParam(required = true) Float value) {
        try {
            log.info("Updating threshold - key: {}, value: {}", key, value);
            
            // 유효성 검사
            if (value < 0.0 || value > 1.0) {
                String message = "가중치 값은 0.0과 1.0 사이여야 합니다.";
                log.warn(message + " Received value: {}", value);
                return ResponseEntity.badRequest().body(message);
            }

            // 키 유효성 검사
            if (!key.matches("[0-2]")) {
                String message = "유효하지 않은 가중치 키입니다.";
                log.warn(message + " Received key: {}", key);
                return ResponseEntity.badRequest().body(message);
            }

            thresholdService.updateThreshold(key, value, "system");
            log.info("Successfully updated threshold - key: {}, value: {}", key, value);
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            String errorMessage = "가중치 업데이트 중 오류가 발생했습니다: " + e.getMessage();
            log.error(errorMessage, e);
            return ResponseEntity.badRequest().body(errorMessage);
        }
    }
}