package kr.spring.controller;

import kr.spring.dto.AiDTO;
import kr.spring.dto.FlaDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.Visit;
import kr.spring.repository.AiTASProjection;
import kr.spring.service.FlaskService;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    //검사결과 순서고정시키기위한 put
    @GetMapping("/{subjectId}")
    public List<Map<String, Object>> getPatientData(@PathVariable int subjectId) {
        List<FlaDTO> dataList = flaskService.getPatientData(subjectId);
        
        // List<FlaDTO> -> List<Map<String, Object>> 변환 및 필드 순서 정리
        return dataList.stream().map(data -> {
            Map<String, Object> orderedData = new LinkedHashMap<>();
            orderedData.put("heartrate", data.getHeartrate());
            orderedData.put("resprate", data.getResprate());
            orderedData.put("o2sat", data.getO2sat());
            orderedData.put("sbp", data.getSbp());
            orderedData.put("dbp", data.getDbp());
            orderedData.put("temperature", data.getTemperature());
            orderedData.put("alanineAminotransferase", data.getAlanineAminotransferase());
            orderedData.put("albumin", data.getAlbumin());
            orderedData.put("alkalinePhosphatase", data.getAlkalinePhosphatase());
            orderedData.put("ammonia", data.getAmmonia());
            orderedData.put("amylase", data.getAmylase());
            orderedData.put("asparateAminotransferase", data.getAsparateAminotransferase());
            orderedData.put("betahydroxybutyrate", data.getBetahydroxybutyrate());
            orderedData.put("bicarbonate", data.getBicarbonate());
            orderedData.put("bilirubinTotal", data.getBilirubinTotal());
            orderedData.put("cReactiveProtein", data.getCReactiveProtein());
            orderedData.put("calciumTotal", data.getCalciumTotal());
            orderedData.put("calculatedTotalCO2", data.getCalculatedTotalCO2());
            orderedData.put("chloride", data.getChloride());
            orderedData.put("creatineKinase", data.getCreatineKinase());
            orderedData.put("creatineKinaseMbIsoenzyme", data.getCreatineKinaseMbIsoenzyme());
            orderedData.put("creatinine", data.getCreatinine());
            orderedData.put("ddimer", data.getDdimer());
            orderedData.put("gammaGlutamyltransferase", data.getGammaGlutamyltransferase());
            orderedData.put("glucose", data.getGlucose());
            orderedData.put("hemoglobin", data.getHemoglobin());
            orderedData.put("inrpt", data.getInrpt());
            orderedData.put("lactate", data.getLactate());
            orderedData.put("lactateDehydrogenase", data.getLactateDehydrogenase());
            orderedData.put("lipase", data.getLipase());
            orderedData.put("magnesium", data.getMagnesium());
            orderedData.put("ntprobnp", data.getNtprobnp());
            orderedData.put("pt", data.getPt());
            orderedData.put("ptt", data.getPtt());
            orderedData.put("plateletCount", data.getPlateletCount());
            orderedData.put("potassium", data.getPotassium());
            orderedData.put("redBloodCells", data.getRedBloodCells());
            orderedData.put("sedimentationRate", data.getSedimentationRate());
            orderedData.put("sodium", data.getSodium());
            orderedData.put("troponinT", data.getTroponinT());
            orderedData.put("ureaNitrogen", data.getUreaNitrogen());
            orderedData.put("whiteBloodCells", data.getWhiteBloodCells());
            orderedData.put("pCO2", data.getPCO2());
            orderedData.put("pH", data.getPH());
            orderedData.put("pO2", data.getPO2());
            orderedData.put("gender", data.getGender());
            orderedData.put("age", data.getAge());
            orderedData.put("losHours", data.getLosHours());
            orderedData.put("tas", data.getTas());
            orderedData.put("pain", data.getPain());
            orderedData.put("arrivalTransport", data.getArrivalTransport());
            return orderedData;
        }).collect(Collectors.toList());
    }
//    @GetMapping("/getaiTAS/{charnum}")
//    public AiTAS getAiTAS(@PathVariable String charnum) {
//        return flaskService.getAiTAS(charnum);
//    }
//    
    @GetMapping("/getaiTASAll")
    public List<AiTASProjection> getAiTASAll() {
        return flaskService.getAiTASAll();
    }
    
    
    
}
