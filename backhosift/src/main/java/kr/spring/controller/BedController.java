package kr.spring.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.service.BedService;

@RestController
public class BedController {
	
	@Autowired
    private BedService bedService;

	@GetMapping("/count")
	public ResponseEntity<Long> getTotalBedCount() {
	    long count = bedService.countAllBeds();
	    return new ResponseEntity<>(count, HttpStatus.OK);
	}
	 
	@PutMapping("/capacity")
	public ResponseEntity<?> updateBedCapacity(@RequestBody Map<String, Integer> payload) {
	    try {
	        int totalBeds = payload.get("totalBeds");
	        if (totalBeds < 1) {
	            return ResponseEntity.badRequest().body("병상 수는 1개 이상이어야 합니다.");
	        }
	        
	        bedService.updateTotalBeds(totalBeds, "admin"); // 실제 환경에서는 로그인한 사용자 정보 사용
	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        return ResponseEntity.internalServerError().body("병상 수 업데이트 중 오류가 발생했습니다.");
	    }
	}
}