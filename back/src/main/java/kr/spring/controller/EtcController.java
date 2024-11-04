package kr.spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.dto.AiDTO;
import kr.spring.dto.PatientDTO;
import kr.spring.entity.AiTAS;
import kr.spring.service.ExaminationService;
import kr.spring.service.FlaskService;

@RestController
public class EtcController {
	
	@Autowired
	private FlaskService flaskService;
	
	
    @GetMapping("/owo/{chartnum}")
    public List<AiDTO> getAllAichart(@PathVariable String chartnum) {
        System.out.println("[EtcController - getAllAichart] Calling getAllAichart with chartnum");
        return flaskService.getAllAichart(chartnum); // List<AiDTO> 반환
    }

	
	

}
