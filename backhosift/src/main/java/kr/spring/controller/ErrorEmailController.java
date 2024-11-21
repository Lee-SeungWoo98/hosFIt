package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import kr.spring.dto.ErrorEmailRequestDTO;
import kr.spring.service.ErrorEmailService;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/errors")
@CrossOrigin(origins = "http://localhost:3000")
public class ErrorEmailController {

    @Autowired
    private ErrorEmailService emailService;

    @PostMapping("/send-email")
    public ResponseEntity<Map<String, Object>> sendErrorEmail(@RequestBody ErrorEmailRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        try {
            emailService.sendErrorEmail(request);
            response.put("success", true);
            response.put("message", "에러 로그가 성공적으로 전송되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "에러 로그 전송 실패: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}