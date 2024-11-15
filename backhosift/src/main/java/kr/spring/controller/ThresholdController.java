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

@RestController
@RequestMapping("/thresholds")
public class ThresholdController {
   
    @Autowired
    private ThresholdService thresholdService;
    @GetMapping
    public ResponseEntity<Map<String, Float>> getAllThresholds() {
        return ResponseEntity.ok(thresholdService.getAllThresholds());
    }
    //key값 출력하는 기능
    @GetMapping("/display")
    public ResponseEntity<List<Map<String, Object>>> displayThresholds() {
        List<Map<String, Object>> result = thresholdService.getThresholdsForDisplay();
        // 디버깅을 위한 로그 추가
        System.out.println("Returned data: " + result);
        return ResponseEntity.ok(result);
    }

    
    @PutMapping("/{key}")
    public ResponseEntity<Void> updateThreshold(
        @PathVariable String key,
        @RequestParam Float value) {
        thresholdService.updateThreshold(key, value, "system");
        return ResponseEntity.ok().build();
    }
}