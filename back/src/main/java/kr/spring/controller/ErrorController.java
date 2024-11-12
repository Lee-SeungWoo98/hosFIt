package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import kr.spring.dto.ErrorDTO;
import kr.spring.dto.ErrorEmailRequestDTO;
import kr.spring.service.ErrorService;
import kr.spring.service.EmailService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/errors")
@CrossOrigin(origins = "http://localhost:3000")  // React 앱의 주소
public class ErrorController {
    @Autowired
    private ErrorService errorService;
    
    @Autowired
    private EmailService emailService;  // 이메일 서비스 주입

    // 기존 엔드포인트들
    @GetMapping
    public ResponseEntity<List<ErrorDTO>> getAllErrors() {
        return ResponseEntity.ok(errorService.getAllErrors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ErrorDTO> getError(@PathVariable Long id) {
        return ResponseEntity.ok(errorService.getError(id));
    }

    @PostMapping("/log")
    public ResponseEntity<ErrorDTO> createError(@RequestBody ErrorDTO errorDTO) {
        return ResponseEntity.ok(errorService.createError(errorDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ErrorDTO> updateError(@PathVariable Long id, @RequestBody ErrorDTO errorDTO) {
        return ResponseEntity.ok(errorService.updateError(id, errorDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteError(@PathVariable Long id) {
        errorService.deleteError(id);
        return ResponseEntity.ok().build();
    }

    // 새로운 이메일 전송 엔드포인트
    @PostMapping("/send-email")
    public ResponseEntity<?> sendErrorEmail(@RequestBody ErrorEmailRequestDTO request) {
    	System.out.println("sendErrorEmail endpoint reached."); 
    	try {
            emailService.sendErrorNotification(request);
            
            // Java 8 호환성을 위해 HashMap으로 변경
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "이메일이 성공적으로 전송되었습니다.");
            
            return ResponseEntity.ok().body(response);
                
        } catch (Exception e) {
            e.printStackTrace(); // 로깅을 위해 추가

            // 실패 응답 생성
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "이메일 전송에 실패했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}