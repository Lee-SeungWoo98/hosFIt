package kr.spring.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.dto.AccuracyResultDTO;
import kr.spring.dto.MismatchResultDTO;
import kr.spring.service.AdminService;
import kr.spring.service.ThresholdService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ThresholdService thresholdService;

    // 대시보드 통계 정보를 가져오는 엔드포인트
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            log.info("Starting to fetch dashboard statistics");
            Map<String, Object> stats = adminService.getDashboardStats();

            // 응답 데이터 구조화
            Map<String, Object> formattedStats = new HashMap<>();
            formattedStats.put("dailyPatients", stats.get("dailyPatients"));
            formattedStats.put("changeRate", stats.get("changeRate"));
            formattedStats.put("trend", stats.get("trend"));
            formattedStats.put("aiMatchRate", stats.get("aiMatchRate"));

            log.info("Successfully retrieved dashboard stats: {}", formattedStats);
            return ResponseEntity.ok(formattedStats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Internal server error"));
        }
    }

    // 배치 정확도 정보를 가져오는 엔드포인트
    @GetMapping(value = "/accuracy", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AccuracyResultDTO> getAccuracy() {
        try {
            AccuracyResultDTO result = adminService.compareWardAndLabel();
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(result);
        } catch (Exception e) {
            log.error("Error calculating accuracy", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 불일치 분석 데이터를 가져오는 엔드포인트
    @GetMapping("/mismatch")
    public ResponseEntity<Map<String, Object>> getMismatchAnalysis() {
        try {
            log.info("Starting mismatch analysis");
            MismatchResultDTO result = adminService.getMismatchAnalysis();

            Map<String, Object> response = new HashMap<>();
            response.put("total", result.getTotalCount());
            response.put("counts", result.getMismatchCounts());
            response.put("percentages", result.getMismatchPercentages());

            log.info("Returning mismatch analysis: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error analyzing mismatches", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "분석 중 오류가 발생했습니다");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 예측 데이터를 가져오는 엔드포인트
    @GetMapping("/patients/prediction")
    public ResponseEntity<Map<String, Object>> getPrediction() {
        try {
            log.info("Starting to fetch prediction data");
            Map<String, Object> prediction = adminService.getPredictionData();

            // 예측 데이터를 응답 데이터로 구성
            Map<String, Object> response = new HashMap<>();
            response.put("nextHourPrediction", prediction.get("nextHourPrediction"));
            response.put("confidence", prediction.get("confidence"));
            response.put("lastUpdated", prediction.get("lastUpdated"));

            log.info("Returning prediction data: {}", response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching prediction data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    // 가중치 설정 값을 가져오는 엔드포인트
    @GetMapping("/thresholds")
    public ResponseEntity<?> getThresholds() {
        try {
            log.info("Fetching weight thresholds");
            Map<String, Float> thresholds = thresholdService.getAllThresholds();
            return ResponseEntity.ok(thresholds);
        } catch (Exception e) {
            log.error("Error fetching thresholds", e);
            Map<String, String> errorResponse = Collections.singletonMap("error", "가중치 로드 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 가중치를 업데이트하는 엔드포인트
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
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            log.error("Error updating threshold", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Internal server error");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // 병상 수를 가져오는 엔드포인트
    @GetMapping("/count")
    public ResponseEntity<?> getBedCount() {
        try {
            log.info("Fetching bed count");
            int bedCount = adminService.getBedCount();
            return ResponseEntity.ok(bedCount);
        } catch (Exception e) {
            log.error("Error fetching bed count", e);
            Map<String, String> errorResponse = Collections.singletonMap("error", "병상 수 로드 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // 병상 수를 업데이트하는 엔드포인트
    @PutMapping("/capacity")
    public ResponseEntity<?> updateBedCapacity(@RequestBody Map<String, Integer> request) {
        try {
            int totalBeds = request.get("totalBeds");
            log.info("Updating bed capacity to {}", totalBeds);
            adminService.updateBedCapacity(totalBeds);
            return ResponseEntity.ok(Collections.singletonMap("message", "병상 수가 성공적으로 업데이트되었습니다."));
        } catch (Exception e) {
            log.error("Error updating bed capacity", e);
            Map<String, String> errorResponse = Collections.singletonMap("error", "병상 수 저장 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}