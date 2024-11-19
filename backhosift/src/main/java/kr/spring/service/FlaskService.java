package kr.spring.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.spring.dto.AiDTO;
import kr.spring.dto.FlaDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.AiTASProjection;
import kr.spring.repository.AiTASRepository;
import kr.spring.repository.FlaskRepository;
import kr.spring.repository.VitalSignsRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FlaskService {

   @Autowired
   private FlaskRepository flaskRepository;

   @Autowired
   private AiTASRepository aiTASRepository;

   @Autowired
   private VitalSignsRepository vitalSignsRepository;

   private final ObjectMapper objectMapper;
   private final RestTemplate restTemplate = new RestTemplate();
   private final String flaskPredictUrl = "http://localhost:5000/predict";

   public FlaskService(ObjectMapper objectMapper) {
       this.objectMapper = objectMapper;
   }

   // 새로 추가된 메소드: subjectId로 모든 chartNum 조회
   public List<String> getChartNumsBySubjectId(Long subjectId) {
       return flaskRepository.findChartNumsBySubjectId(subjectId);
   }

   // chartNum으로 데이터 조회하는 메소드 추가
   @Transactional(readOnly = true)
   public List<FlaDTO> getPatientDataByChartNum(String chartNum) {
       return flaskRepository.getPatientDataByChartNum(chartNum);
   }

   @Transactional(readOnly = true)
   public List<FlaDTO> getPatientData(Long subjectId) {
       List<FlaDTO> patientData = flaskRepository.getPatientData(subjectId);
       log.info("Retrieved {} records for subjectId: {}", patientData.size(), subjectId);
       return patientData;
   }

   @Transactional
   public JSONObject getAiTAS(List<FlaDTO> dataList) {
       JSONObject finalResult = new JSONObject();
       
       try {
           if(dataList.isEmpty()) {
               log.warn("No data provided for AiTAS processing");
               return finalResult;
           }

           log.info("Processing {} records for AiTAS", dataList.size());
           HttpHeaders headers = new HttpHeaders();
           headers.setContentType(MediaType.APPLICATION_JSON);
           String requestJson = objectMapper.writeValueAsString(dataList);
           HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

           ResponseEntity<String> response = restTemplate.postForEntity(flaskPredictUrl, entity, String.class);

           if (!response.getStatusCode().is2xxSuccessful()) {
               log.error("Flask server returned error status: {}", response.getStatusCode());
               return finalResult;
           }

           String responseBody = response.getBody();
           JSONParser parser = new JSONParser();
           JSONObject result = (JSONObject) parser.parse(responseBody);
           saveAiTASResults(result);
           finalResult.putAll(result);
           
           log.info("Successfully processed and saved AiTAS for {} records", result.size());

       } catch (Exception e) {
           log.error("Error in getAiTAS: ", e);
           throw new RuntimeException("Failed to process data", e);
       }
       
       return finalResult;
   }

   @Transactional
   protected void saveAiTASResults(JSONObject result) {
       for (Object keyObj : result.keySet()) {
           String chartNum = (String) keyObj;
           log.info("Processing AiTAS for ChartNum: {}", chartNum);

           try {
               Object value = result.get(chartNum);
               if (!(value instanceof List)) {
                   log.warn("Invalid data format for ChartNum: {}", chartNum);
                   continue;
               }

               List<?> values = (List<?>) value;
               if (values.size() < 3) {
                   log.warn("Insufficient data for ChartNum: {}", chartNum);
                   continue;
               }

               Optional<VitalSigns> vitalSignsOpt = vitalSignsRepository.findById(chartNum);
               if (!vitalSignsOpt.isPresent()) {
                   log.warn("VitalSigns not found for ChartNum: {}", chartNum);
                   continue;
               }

               // 기존 AiTAS 검색 및 업데이트 또는 새로 생성
               AiTAS aiTAS = aiTASRepository.findByVitalSigns_ChartNum(chartNum)
                   .orElse(new AiTAS());

               aiTAS.setVitalSigns(vitalSignsOpt.get());
               aiTAS.setChartNum(chartNum);  // chartNum 직접 설정
               aiTAS.setLevel1(Float.valueOf(values.get(0).toString()));
               aiTAS.setLevel2(Float.valueOf(values.get(1).toString()));
               aiTAS.setLevel3(Float.valueOf(values.get(2).toString()));

               aiTASRepository.save(aiTAS);
               log.info("Saved AiTAS for ChartNum: {}, Levels: {}/{}/{}", 
                   chartNum, aiTAS.getLevel1(), aiTAS.getLevel2(), aiTAS.getLevel3());

           } catch (Exception e) {
               log.error("Failed to save AiTAS for ChartNum: {}, Error: {}", chartNum, e.getMessage(), e);
           }
       }
   }

   @Transactional(readOnly = true)
   public List<AiTASProjection> getAiTASAll() {
       return aiTASRepository.findAllProjectedBy();
   }

   @Transactional
   public void processBatchAiTAS() {
       int pageNumber = 0;
       final int batchSize = 100;  // 배치 크기 조정
       int totalProcessed = 0;

       Page<VitalSigns> pagedData;
       do {
           PageRequest pageRequest = PageRequest.of(pageNumber, batchSize);
           pagedData = vitalSignsRepository.findAll(pageRequest);

           if (!pagedData.isEmpty()) {
               List<FlaDTO> dataList = new ArrayList<>();
               for (VitalSigns vitalSign : pagedData) {
                   List<FlaDTO> data = getPatientDataByChartNum(vitalSign.getChartNum());
                   dataList.addAll(data);
               }

               if (!dataList.isEmpty()) {
                   log.info("Processing batch {} with {} records", pageNumber + 1, dataList.size());
                   JSONObject result = getAiTAS(dataList);
                   totalProcessed += result.size();
                   log.info("Completed batch {}. Total processed: {}", pageNumber + 1, totalProcessed);
               }
           }

           pageNumber++;
       } while (pagedData.hasNext());

       log.info("Completed processing all {} records", totalProcessed);
   }

public List<AiDTO> getAllAichart(String chartnum) {
	// TODO Auto-generated method stub
	return null;
}
}