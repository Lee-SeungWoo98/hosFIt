package kr.spring.controller;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.Visit;
import kr.spring.service.FlaskService;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/flask")
public class FlaskController {

    private final FlaskService flaskService;
    private final RestTemplate restTemplate;

    @Autowired
    public FlaskController(FlaskService flaskService, RestTemplate restTemplate) {
        this.flaskService = flaskService;
        this.restTemplate = restTemplate;
    }

    @PostMapping("/predict")
    public ResponseEntity<String> sendDataToFlask(@RequestBody FlaDTO data) {
        String flaskUrl = "http://localhost:5000/predict";
        ResponseEntity<String> response = restTemplate.postForEntity(flaskUrl, data, String.class);
        return response;
    }

    @PostMapping("/startAnalysis")
    public ResponseEntity<String> startAnalysis() {
        String data = "{\"name\":\"example\", \"age\":30}";
        flaskService.startAnalysis(data);
        return ResponseEntity.ok("Analysis request sent to Flask.");
    }

    @GetMapping("/getAnalysisResult")
    public ResponseEntity<List<Double>> getAnalysisResult() {
        return flaskService.getAnalysisResult();
    }

    @GetMapping("/{subjectId}")
    public List<FlaDTO> getPatientData(@PathVariable int subjectId) {
        return flaskService.getPatientData(subjectId);
    }
    @GetMapping("/getaiTAS/{stayId}")
    public AiTAS getAiTAS(@PathVariable Long stayId) {
        return flaskService.getAiTAS(stayId);
    }
    
    @GetMapping("/getaiTASAll")
    public List<AiTAS> getAiTASAll(){
    	
    	return flaskService.getAiTASAll();
    }

    
    
    
}
