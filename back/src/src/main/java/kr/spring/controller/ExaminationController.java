package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import kr.spring.service.ExaminationService;

public class ExaminationController {
	
	@Autowired
    private ExaminationService examinationservice;
	
	
	
	@GetMapping("/abnormal-diagnosis")
	public ResponseEntity<List<LabtestDTO>> getAbnormalDiagnosisWithBloodidx() {
	        List<LabtestDTO> result = examinationservice.getAbnormalDiagnosisWithBloodidx();
	        return ResponseEntity.ok(result);
	    }
	
	

}
