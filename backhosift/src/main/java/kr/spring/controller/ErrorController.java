package kr.spring.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.dto.ErrorDTO;
import kr.spring.service.ErrorService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/errors")
public class ErrorController {

    @Autowired
    private ErrorService errorService;

    @GetMapping("/limited")
    public ResponseEntity<?> getLimitedErrors() {
        try {
            List<ErrorDTO> warnings = errorService.getErrorsBySeverity("warning", 5);
            List<ErrorDTO> errors = errorService.getErrorsBySeverity("error", 10);

            Map<String, List<ErrorDTO>> result = new HashMap<>();
            result.put("warnings", warnings);
            result.put("errors", errors);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace(); // 콘솔에 자세한 로그 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching limited logs: " + e.getMessage());
        }
    }
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
}
