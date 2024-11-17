package kr.spring.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.service.ThresholdService;

// ThresholdController: 가중치 설정 관련 API를 관리하는 컨트롤러
@RestController
@RequestMapping("/boot/thresholds") // 요청 경로를 '/boot/thresholds'로 지정
public class ThresholdController {

    // ThresholdService를 주입받아 사용
    @Autowired
    private ThresholdService thresholdService;

    /**
     * @return 모든 가중치를 디스플레이 형태로 반환
     * API 경로: GET /boot/thresholds/display
     */
    @GetMapping("/display")
    public ResponseEntity<List<Map<String, Object>>> displayThresholds() {
        List<Map<String, Object>> result = thresholdService.getThresholdsForDisplay();
        return ResponseEntity.ok(result);
    }

    /**
     * 특정 키의 가중치를 업데이트
     * API 경로: PUT /boot/thresholds/{key}
     * @param key - 업데이트할 가중치 키 (PathVariable로 전달)
     * @param request - 요청 본문에 포함된 value 값
     * @return 200 OK 응답
     */
    @PutMapping("/{key}")
    public ResponseEntity<Void> updateThreshold(
        @PathVariable String key, // URL에서 전달되는 키 값
        @RequestBody Map<String, Float> request // 요청 본문에서 전달되는 데이터
    ) {
        // 요청 본문에서 "value"를 추출
        Float value = request.get("value");
        // ThresholdService를 호출하여 가중치 업데이트
        thresholdService.updateThreshold(key, value, "system");
        return ResponseEntity.ok().build();
    }
}
