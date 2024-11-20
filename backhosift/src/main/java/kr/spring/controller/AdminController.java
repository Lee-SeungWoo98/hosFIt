package kr.spring.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.dto.AccuracyResultDTO;
import kr.spring.dto.MismatchResultDTO;
import kr.spring.service.AdminService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminController {

	@Autowired
	private AdminService adminService;

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
			formattedStats.put("mismatchDistribution", stats.get("mismatchDistribution"));

			log.info("Successfully retrieved dashboard stats: {}", formattedStats);
			return ResponseEntity.ok(formattedStats);
		} catch (Exception e) {
			log.error("Error fetching dashboard stats", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

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

	@GetMapping("/mismatch")
	public ResponseEntity<Map<String, Object>> getMismatchAnalysis() {
		try {
			log.info("Starting mismatch analysis");
			MismatchResultDTO result = adminService.getMismatchAnalysis();

			Map<String, Object> response = new HashMap<>();
			response.put("total", result.getTotalCount());
			response.put("counts", result.getMismatchCounts());
			response.put("percentages", result.getPercentages());

			log.info("Returning mismatch analysis: {}", response);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error analyzing mismatches", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}