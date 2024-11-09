package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import kr.spring.dto.LabTestDTO;
import kr.spring.service.ExaminationService;

import java.util.List;

@RestController
public class ExaminationController {
    
    @Autowired
    private ExaminationService examinationService;
    //환자 검사 결과 
    @GetMapping(value = "/labtests/{stayId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<LabTestDTO>> getLabTestsAndResults(@PathVariable Long stayId) {
        List<LabTestDTO> response = examinationService.getLabTestsAndResults(stayId);
        if (response == null || response.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(response);
    }
    
    // vital + aitas
    
}
