package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import kr.spring.dto.ErrorEmailRequestDTO;
import kr.spring.service.ErrorEmailService;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/errors")
@CrossOrigin(origins = "http://localhost:3000")
public class ErrorEmailController {

    @Autowired
    private ErrorEmailService emailService;

    @PostMapping("/send-email")
    public ResponseEntity<Map<String, Object>> sendErrorEmail(@RequestBody ErrorEmailRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        
        // Validate request
        if (request == null || request.getErrorname() == null || request.getErrormessage() == null) {
            response.put("success", false);
            response.put("message", "필수 에러 정보가 누락되었습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            log.info("에러 로그 이메일 전송 시작 - ErrorName: {}, ErrorType: {}", 
                request.getErrorname(), request.getErrortype());

            emailService.sendErrorEmail(request);
            
            log.info("에러 로그 이메일 전송 완료 - ErrorId: {}", request.getId());
            
            response.put("success", true);
            response.put("message", "에러 로그가 성공적으로 전송되었습니다.");
            response.put("timestamp", System.currentTimeMillis());
            response.put("errorId", request.getId());
            
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.warn("이메일 전송 실패 (잘못된 요청) - {}", e.getMessage());
            response.put("success", false);
            response.put("message", "잘못된 요청: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            log.error("이메일 전송 중 오류 발생", e);
            response.put("success", false);
            response.put("message", "이메일 전송 실패: " + e.getMessage());
            response.put("errorDetail", e.getClass().getSimpleName());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/test-email")
    public ResponseEntity<Map<String, Object>> testEmailConfiguration() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ErrorEmailRequestDTO testRequest = new ErrorEmailRequestDTO();
            testRequest.setId(0L);
            testRequest.setErrorname("Test Error");
            testRequest.setErrormessage("This is a test error message");
            testRequest.setErrortype("TEST");
            testRequest.setSeveritylevel("info");
            
            emailService.sendErrorEmail(testRequest);
            
            response.put("success", true);
            response.put("message", "테스트 이메일이 성공적으로 전송되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("테스트 이메일 전송 실패", e);
            response.put("success", false);
            response.put("message", "테스트 이메일 전송 실패: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}