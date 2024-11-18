package kr.spring.controller;

import java.util.HashMap; // 불일치 데이터를 Map 형식으로 반환하기 위해 사용
import java.util.Map; // 불일치 분석 및 대시보드 데이터를 저장하기 위한 구조체

import org.springframework.beans.factory.annotation.Autowired; // AdminService 의존성 주입을 위해 필요
import org.springframework.http.HttpStatus; // HTTP 상태 코드 반환을 위해 필요
import org.springframework.http.MediaType; // JSON 응답의 Content-Type 설정을 위해 필요
import org.springframework.http.ResponseEntity; // HTTP 응답 객체 생성에 사용
import org.springframework.web.bind.annotation.GetMapping; // GET 요청 매핑을 위해 필요
import org.springframework.web.bind.annotation.RequestMapping; // 기본 URL 경로 설정에 사용
import org.springframework.web.bind.annotation.RestController; // RESTful 컨트롤러로 설정하기 위해 필요

import kr.spring.dto.AccuracyResultDTO; // 병상 배치 정확도 결과를 담는 DTO
import kr.spring.dto.MismatchResultDTO; // 병상 배치 불일치 분석 결과를 담기 위해 필요
import kr.spring.service.AdminService; // 비즈니스 로직 호출을 위해 AdminService 사용
import lombok.extern.slf4j.Slf4j; // 로깅을 위한 Lombok 애노테이션 사용

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminController {

    @Autowired
    private AdminService adminService;

    // 기존 코드 ---------------------------------------------------------

    /**
     * 병상 배치와 실제 라벨 간의 일치도를 반환합니다.
     * 
     * @return AccuracyResultDTO 일치도 결과
     */
    @GetMapping(value = "/accuracy", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AccuracyResultDTO> getAccuracy() {
        try {
            AccuracyResultDTO result = adminService.compareWardAndLabel();
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(result);
        } catch (Exception e) {
            log.error("Error calculating accuracy", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 병상 배치와 실제 라벨 간 불일치 분석 결과를 반환합니다.
     * 
     * @return Map<String, Object> 불일치 분석 결과
     */
    @GetMapping("/mismatch")
    public ResponseEntity<Map<String, Object>> getMismatchAnalysis() {
        try {
            // 불일치 분석 데이터를 AdminService에서 가져와 응답으로 반환
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

    // 추가된 엔드포인트 --------------------------------------------------

 /**
     * 대시보드에서 필요한 통계 데이터를 반환합니다.
     * 
     * @return Map<String, Object> 대시보드 통계 데이터
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            // AdminService를 통해 대시보드 통계 데이터를 가져와 응답으로 반환
            Map<String, Object> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
