package kr.spring.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "http://localhost:3000")
public class ThresholdController {

    @Autowired
    private ThresholdService thresholdService;

    // 모든 가중치 조회
    @GetMapping("/thresholds")
    public ResponseEntity<Map<String, Float>> getAllThresholds() {
        log.info("Fetching all thresholds");
        try {
            return ResponseEntity.ok(thresholdService.getAllThresholds());
        } catch (Exception e) {
            log.error("Error fetching thresholds", e);
            return ResponseEntity.status(500).build();
        }
    }

    // 가중치 수정
    @PutMapping("/thresholds/{key}")
    public ResponseEntity<Map<String, Object>> updateThreshold(
            @PathVariable String key,
            @RequestParam Float value) {
        log.info("Updating threshold - key: {}, value: {}", key, value);

        try {
            thresholdService.updateThreshold(key, value, "system");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Threshold updated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid threshold update request", e);
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating threshold", e);
            return ResponseEntity.status(500)
                    .body(Collections.singletonMap("error", "Internal server error"));
        }
    }

    // 특정 가중치 조회
    @GetMapping("/thresholds/{key}")
    public ResponseEntity<Map<String, Object>> getThreshold(@PathVariable String key) {
        log.info("Fetching threshold for key: {}", key);
        try {
            Float value = thresholdService.getThreshold(key);
            if (value == null) {
                return ResponseEntity.notFound().build();
            }
            Map<String, Object> response = new HashMap<>();
            response.put("key", key);
            response.put("value", value);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching threshold", e);
            return ResponseEntity.status(500).build();
        }
    }

    // 디스플레이용 가중치 조회
    @GetMapping("/thresholds/display")
    public ResponseEntity<List<Map<String, Object>>> getThresholdsForDisplay() {
        log.info("Fetching thresholds for display");
        try {
            return ResponseEntity.ok(thresholdService.getThresholdsForDisplay());
        } catch (Exception e) {
            log.error("Error fetching thresholds for display", e);
            return ResponseEntity.status(500).build();
        }
    }
}
