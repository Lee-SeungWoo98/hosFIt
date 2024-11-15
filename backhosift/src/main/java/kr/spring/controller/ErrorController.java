package kr.spring.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.dto.ErrorDTO;
import kr.spring.service.ErrorService;

import java.util.List;

@RestController
@RequestMapping("/errors")
public class ErrorController {

    @Autowired
    private ErrorService errorService;

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
