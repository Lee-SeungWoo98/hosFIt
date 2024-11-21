package kr.spring.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.service.BedService;
import lombok.extern.slf4j.Slf4j;


	@RestController
	@RequestMapping("/beds")
	@CrossOrigin(origins = "http://localhost:3000")
	@Slf4j
	public class BedController {

	    @Autowired
	    private BedService bedService;

	    @GetMapping("/count")
	    public ResponseEntity<Integer> getBedCount() {
	        try {
	            log.info("Fetching bed count");
	            int count = bedService.getBedCount();
	            log.info("Current bed count: {}", count);
	            return ResponseEntity.ok(count);
	        } catch (Exception e) {
	            log.error("Error fetching bed count", e);
	            return ResponseEntity.status(500).body(0);
	        }
	    }

	    @PutMapping("/update")
	    public ResponseEntity<Map<String, Object>> updateBedCount(@RequestBody Map<String, Integer> request) {
	        log.info("Updating bed count to: {}", request.get("totalBeds"));
	        Map<String, Object> response = new HashMap<>();
	        
	        try {
	            int totalBeds = request.get("totalBeds");
	            if (totalBeds < 1) {
	                response.put("success", false);
	                response.put("message", "병상 수는 1개 이상이어야 합니다.");
	                return ResponseEntity.badRequest().body(response);
	            }
	            
	            bedService.updateBedCount(totalBeds);
	            
	            response.put("success", true);
	            response.put("message", "병상 수가 업데이트되었습니다");
	            response.put("totalBeds", totalBeds);
	            
	            return ResponseEntity.ok(response);
	        } catch (Exception e) {
	            log.error("Error updating bed count", e);
	            response.put("success", false);
	            response.put("message", "서버 오류가 발생했습니다");
	            return ResponseEntity.status(500).body(response);
	        }
	    }

	    @GetMapping("/summary")
	    public ResponseEntity<Map<String, Object>> getBedSummary() {
	        try {
	            log.info("Fetching bed summary");
	            Map<String, Object> summary = new HashMap<>();
	            summary.put("totalBeds", bedService.getBedCount());
	            return ResponseEntity.ok(summary);
	        } catch (Exception e) {
	            log.error("Error fetching bed summary", e);
	            return ResponseEntity.status(500)
	                    .body(Collections.singletonMap("error", "Unable to fetch bed summary"));
	        }
	    }
	}