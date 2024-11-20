package kr.spring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.service.ThresholdService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/thresholds")
@CrossOrigin(origins = "http://localhost:3000")
public class ThresholdController {
    
    @Autowired
    private ThresholdService thresholdService;

    @GetMapping
    public ResponseEntity<Map<String, Float>> getAllThresholds() {
        log.info("Fetching all thresholds");
        try {
            Map<String, Float> thresholds = thresholdService.getAllThresholds();
            return ResponseEntity.ok(thresholds);
        } catch (Exception e) {
            log.error("Error fetching thresholds", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/display")
    public ResponseEntity<List<Map<String, Object>>> displayThresholds() {
        log.info("Fetching thresholds for display");
        try {
            List<Map<String, Object>> result = thresholdService.getThresholdsForDisplay();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching thresholds for display", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PutMapping("/{key}")
    public ResponseEntity<Map<String, Object>> updateThreshold(
            @PathVariable String key,
            @RequestParam Float value) {
        log.info("Updating threshold - key: {}, value: {}", key, value);
        
        try {
            thresholdService.updateThreshold(key, value, "system");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Threshold updated successfully");
            response.put("key", key);
            response.put("value", value);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid threshold update request", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Error updating threshold", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Internal server error");
            
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/{key}")
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
            return ResponseEntity.internalServerError().build();
        }
    }
}