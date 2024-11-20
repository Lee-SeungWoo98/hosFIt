package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.service.BedService;

@RestController
@RequestMapping("/beds")
public class BedController {

    @Autowired
    private BedService bedService;

    // 병상 수 조회
    @GetMapping("/count")
    public ResponseEntity<Integer> getBedCount() {
        return ResponseEntity.ok(bedService.getBedCount());
    }

    // 병상 수 업데이트
    @PutMapping("/update")
    public ResponseEntity<String> updateBedCount(@RequestParam int totalBeds) {
        try {
            bedService.updateBedCount(totalBeds);
            return ResponseEntity.ok("병상 수가 저장되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
