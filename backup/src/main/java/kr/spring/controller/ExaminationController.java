package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import kr.spring.dto.LabTestResponse;
import kr.spring.service.ExaminationService;

public class ExaminationController {
	
	  @Autowired
	    private ExaminationService ExaminationService;

	    @GetMapping("/labtests")
	    public LabTestResponse getLabTestsAndResults(@RequestParam Long stayId) {
	        return ExaminationService.getLabTestsAndResults(stayId);
	    
	    
	    
	        
	        
	        
	        
	    
	    
	    
	    }
	}
	

