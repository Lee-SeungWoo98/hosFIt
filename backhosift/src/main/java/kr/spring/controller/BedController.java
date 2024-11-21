package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.service.BedService;

@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/beds")
public class BedController {

    @Autowired
    private BedService bedService;

    // 병상 수 조회
    @GetMapping("/count")
    public ResponseEntity<Integer> getBedCount() {
        try {
            int count = bedService.getBedCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(0); // 예외 발생 시 0 반환
        }
    }

    // 병상 수 업데이트
    @PutMapping("/update")
    public ResponseEntity<String> updateBedCount(@RequestParam int totalBeds) {
        try {
            bedService.updateBedCount(totalBeds);
            return ResponseEntity.ok("병상 수가 저장되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    }
}
