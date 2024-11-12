package kr.spring.service;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;

import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.FlaskRepository;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.VitalSignsRepository;
import kr.spring.service.FlaskService;
import kr.spring.dto.FlaDTO;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class VitalSignsService {
   
   private final VitalSignsRepository vitalSignsRepository;
   private final VisitRepository visitRepository;
   private final FlaskService flaskService;
   private final FlaskRepository flaskRepository;
   private final Random random = new Random();
   
   private volatile boolean isGenerating = false;
   private volatile Long targetStayId = null;


   @Autowired
   public VitalSignsService(VitalSignsRepository vitalSignsRepository, 
                          VisitRepository visitRepository,
                          FlaskService flaskService,
                          FlaskRepository flaskRepository) {
       this.vitalSignsRepository = vitalSignsRepository;
       this.visitRepository = visitRepository;
       this.flaskService = flaskService;
       this.flaskRepository = flaskRepository;
       log.info("VitalSignsService initialized");
   }

   @Transactional
   public List<VitalSigns> getVitalSignsByStayId(Long stayId) {
       return vitalSignsRepository.findByVisitStayId(stayId);
   }
   
   public List<VitalSigns> getVitalSigns2ByStayId(Long stayId) {
       return vitalSignsRepository.findByVisitStayIdOrderByChartTime(stayId);
   }
   
   public synchronized boolean isGenerating() {
       return this.isGenerating;
   }

   public synchronized Long getTargetStayId() {
       return this.targetStayId;
   }

   public boolean checkVisitExists(Long stayId) {
       return visitRepository.existsById(stayId);
   }

   @Transactional
   public synchronized void startGenerating(Long stayId) {
       log.info("Starting vital signs generation for stayId: {}", stayId);
       if (!checkVisitExists(stayId)) {
           throw new RuntimeException("Visit not found with stayId: " + stayId);
       }
       this.targetStayId = stayId;
       this.isGenerating = true;
       log.info("Generation started - isGenerating: {}, targetStayId: {}", 
               isGenerating, targetStayId);
   }

   @Transactional
   public synchronized void stopGenerating() {
       log.info("Current status before stop - isGenerating: {}, targetStayId: {}", 
               isGenerating, targetStayId);
       this.isGenerating = false;
       this.targetStayId = null;
       log.info("Generation stopped - isGenerating: {}, targetStayId: {}", 
               isGenerating, targetStayId);
   }

   @Transactional
   public synchronized void stopGenerating(Long stayId) {
       log.info("Stopping vital signs generation for stayId: {}", stayId);
       if (this.targetStayId != null && this.targetStayId.equals(stayId)) {
           log.info("Current status before stop - isGenerating: {}, targetStayId: {}", 
                   isGenerating, targetStayId);
           stopGenerating();
           log.info("Generation stopped - isGenerating: {}, targetStayId: {}", 
                   isGenerating, targetStayId);
       } else {
           log.warn("Stop request ignored - Current targetStayId: {}, Requested stayId: {}", 
                   this.targetStayId, stayId);
       }
   }

   private String getNextChartNum() {
        Optional<Integer> maxNum = vitalSignsRepository.findMaxChartNumValue();
        int nextNum;
        if (maxNum.isPresent() && maxNum.get() > 0) {
            nextNum = maxNum.get() + 1;
        } else {
            nextNum = 10001;  // 시작 번호
        }
        return "C" + String.format("%05d", nextNum);
    }

   @Scheduled(fixedRate = 100000)
   @Transactional
   public void generateHourlyVitalSigns() {
       log.info("=== Scheduled Task Start ===");
       log.info("isGenerating: {}, targetStayId: {}", isGenerating, targetStayId);
       
       if (!isGenerating || targetStayId == null) {
           log.info("Generation skipped - conditions not met");
           return;
       }

       try {
           log.info("Trying to find Visit with stayId: {}", targetStayId);
           Visit visit = visitRepository.findById(targetStayId)
                   .orElseThrow(() -> {
                       log.error("Visit not found for stayId: {}", targetStayId);
                       stopGenerating(targetStayId);
                       return new RuntimeException("Visit not found");
                   });
           log.info("Visit found successfully");

           int currentCount = vitalSignsRepository.countByVisit(visit);
           log.info("Current VitalSigns count: {}", currentCount);
           
           if (currentCount >= 24) {
               log.info("Maximum records (24) reached. Stopping generation.");
               stopGenerating(targetStayId);
               return;
           }

           String nextChartNum = getNextChartNum();
           log.info("Generated new ChartNum: {}", nextChartNum);

           VitalSigns newVitalSigns = new VitalSigns();
           newVitalSigns.setVisit(visit);
           newVitalSigns.setChartNum(nextChartNum);
           newVitalSigns.setChartTime(LocalDateTime.now());
           
           // Vital signs 값 설정
           long heartrate = (long) (60 + random.nextInt(41));  // 심박수: 60~100 bpm
           long resprate = (long) (12 + random.nextInt(9));    // 호흡수: 12~20 rpm
           String o2sat = String.valueOf(95.0 + random.nextDouble() * 5.0); // 산소 포화도: 95~100%
           long sbp = (long) (90 + random.nextInt(51));        // 수축기 혈압: 90~140 mmHg
           long dbp = (long) (60 + random.nextInt(31));        // 이완기 혈압: 60~90 mmHg
           String temperature = String.valueOf(36.5 + random.nextDouble() * 1.0); // 체온: 36.5~37.5도
           
           newVitalSigns.setHeartrate(heartrate);
           newVitalSigns.setResprate(resprate);
           newVitalSigns.setO2sat(o2sat);
           newVitalSigns.setSbp(sbp);
           newVitalSigns.setDbp(dbp);
           newVitalSigns.setTemperature(temperature);

           log.info("Attempting to save VitalSigns with values - HR:{}, RR:{}, O2:{}, BP:{}/{}, Temp:{}",
                   heartrate, resprate, o2sat, sbp, dbp, temperature);

           try {
        	   VitalSigns saved = vitalSignsRepository.save(newVitalSigns);
               log.info("Successfully saved VitalSigns with ChartNum: {}", saved.getChartNum());
               
               // 새로 생성된 VitalSign에 대해서만 분석 요청
               sendToFlaskForAnalysis(saved.getChartNum(), visit.getSubjectId());
               
              
           } catch (Exception e) {
               log.error("Error saving VitalSigns: ", e);
               stopGenerating(targetStayId);
           }

       } catch (Exception e) {
           log.error("Error in generateHourlyVitalSigns: ", e);
           stopGenerating(targetStayId);
       } finally {
           log.info("=== Scheduled Task End ===");
       }
   }

   @Transactional
   public void sendToFlaskForAnalysis(String chartNum, Long subjectId) {
	    try {
	        log.info("Sending data to Flask for analysis - chartNum: {}", chartNum);
	        List<FlaDTO> dataList = flaskRepository.getPatientDataByChartNum(chartNum);
	        
	        if (dataList.isEmpty()) {
	            log.warn("No data found by chartNum: {}, trying with subjectId: {}", chartNum, subjectId);
	            dataList = flaskRepository.getPatientData(subjectId);
	        }
	        
	        if (!dataList.isEmpty()) {
	            flaskService.getAiTAS(dataList);
	            log.info("Successfully sent data to Flask for chartNum: {}", chartNum);
	        } else {
	            log.error("No data found for chartNum: {} or subjectId: {}", chartNum, subjectId);
	        }
	    } catch (Exception e) {
	        log.error("Error sending data to Flask for chartNum {}: {}", chartNum, e.getMessage(), e);
	    }
	}
}