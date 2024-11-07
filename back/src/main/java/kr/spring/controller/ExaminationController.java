package kr.spring.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;


import kr.spring.dto.LabTestDTO;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.service.ExaminationService;
import kr.spring.service.VitalSignsService;

@RestController
public class ExaminationController {
    
    @Autowired
    private ExaminationService examinationService;
    
    private static final Logger logger = LoggerFactory.getLogger(ExaminationController.class);
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
    // 1시간마다 vital보내기 
   

    
        
        
        @Autowired
        private VitalSignsService vitalSignsService;

//        @GetMapping(value = "/stream/{stayId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//        public SseEmitter streamVitalSigns(@PathVariable Long stayId) {
//            SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
//            
//            logger.info("SSE Connection started for stayId: {}", stayId);
//            
//            List<VitalSigns> vitalSignsList = vitalSignsService.getVitalSignsByStayId(stayId);
//            logger.info("Found {} vital signs for stayId: {}", vitalSignsList.size(), stayId);
//            
//            if(vitalSignsList.isEmpty()) {
//                emitter.complete();
//                return emitter;
//            }
//
//            AtomicInteger index = new AtomicInteger(0);
//            ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
//            
//            // 클라이언트 연결 해제 시 처리
//            emitter.onCompletion(() -> {
//                logger.info("SSE Connection completed");
//                executor.shutdown();
//            });
//            
//            emitter.onTimeout(() -> {
//                logger.info("SSE Connection timeout");
//                executor.shutdown();
//                emitter.complete();
//            });
//            
//            emitter.onError((ex) -> {
//                logger.error("SSE Connection error", ex);
//                executor.shutdown();
//            });
//
//            executor.scheduleAtFixedRate(() -> {
//                try {
//                    if (index.get() < vitalSignsList.size()) {
//                        VitalSigns vs = vitalSignsList.get(index.getAndIncrement());
//                        if (vs != null) {
//                            logger.info("Sending vital sign data: {}", vs.getChartNum());
//                            emitter.send(vs);
//                        }
//                    } else {
//                        logger.info("All data sent, completing SSE connection");
//                        executor.shutdown();
//                        emitter.complete();
//                    }
//                } catch (Exception e) {
//                    logger.error("Error sending data", e);
//                    executor.shutdown();
//                    emitter.completeWithError(e);
//                }
//            }, 0, 10, TimeUnit.SECONDS);
//
//            return emitter;
//        }
//   
    @GetMapping("/check/{stayId}")
    public List<VitalSigns> checkData(@PathVariable Long stayId) {
        return vitalSignsService.getVitalSignsByStayId(stayId);
    }
   
}
