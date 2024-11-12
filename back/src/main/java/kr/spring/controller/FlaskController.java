package kr.spring.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import kr.spring.dto.FlaDTO;
import kr.spring.repository.AiTASProjection;
import kr.spring.service.FlaskService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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

   @GetMapping("/{subjectId}")
   public List<Map<String, Object>> getPatientData(@PathVariable Long subjectId) {
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
           orderedData.put("cReactiveProtein", data.getCreactiveProtein());
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
           orderedData.put("PT", data.getPT());
           orderedData.put("PTT", data.getPTT());
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
   
   @GetMapping("/getaiTAS/{subjectId}")
   public ResponseEntity<?> getAiTAS(@PathVariable Long subjectId) {
       log.info("Request received to get AiTAS for subjectId: {}", subjectId);
       
       try {
           // 해당 subjectId의 모든 chartNum 조회
           List<String> chartNums = flaskService.getChartNumsBySubjectId(subjectId);
           if(chartNums.isEmpty()) {
               return ResponseEntity.status(HttpStatus.NOT_FOUND)
                   .body("No data found for subjectId: " + subjectId);
           }
           
           log.info("Found {} chartNums for subjectId: {}", chartNums.size(), subjectId);
           
           // 각 chartNum에 대한 데이터 조회 및 AiTAS 생성
           JSONObject finalResult = new JSONObject();
           for(String chartNum : chartNums) {
               List<FlaDTO> chartData = flaskService.getPatientDataByChartNum(chartNum);
               if(!chartData.isEmpty()) {
                   JSONObject result = flaskService.getAiTAS(chartData);
                   finalResult.putAll(result);
               }
           }
           
           log.info("Successfully processed AiTAS for {} records", finalResult.size());
           return ResponseEntity.ok(finalResult);
           
       } catch (Exception e) {
           log.error("Error processing AI TAS: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body("Error processing AI TAS: " + e.getMessage());
       }
   }

   @GetMapping("/getaiTASAll")
   public List<AiTASProjection> getAiTASAll() {
       return flaskService.getAiTASAll();
   }
   
   @PostMapping("/process-batch")
   public ResponseEntity<?> processBatch() {
       try {
           log.info("Starting batch processing");
           flaskService.processBatchAiTAS();
           return ResponseEntity.ok("Batch processing completed successfully");
       } catch (Exception e) {
           log.error("Error during batch processing: ", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                   .body("Error during batch processing: " + e.getMessage());
       }
   }
}