package kr.spring.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import kr.spring.config.ThresholdConfig;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.VitalSigns;
import kr.spring.service.FlaskService;
import kr.spring.service.PatientAssignmentService;
import kr.spring.service.VitalSignsService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class PatientMonitorController {
    
    @Autowired
    private VitalSignsService vitalSignsService;
    
    @Autowired
    private FlaskService flaskService;
    
    @Autowired
    private PatientAssignmentService assignmentService;
    
    @Autowired
    private ThresholdConfig thresholdConfig;
    
    @GetMapping("/process-ward-assignment")
    public ResponseEntity<String> processWardAssignmentBatch() {
        assignmentService.processBatchWardAssignments();
        return ResponseEntity.ok("500건의 배치 프로세스가 실행되었습니다.");
    }

    // Patient Data Streaming
    @GetMapping(value = "/stream/{stayId}/{subjectId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamCombinedData(@PathVariable Long stayId, 
                                        @PathVariable Long subjectId,
                                        HttpServletResponse response) {
        log.info("Received request - stayId: {}, subjectId: {}", stayId, subjectId);
        
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        
        List<FlaDTO> labResults = flaskService.getPatientData(subjectId);
        FlaDTO fixedLabData = !labResults.isEmpty() ? labResults.get(0) : null;
        
        Map<String, Object> combinedData = new LinkedHashMap<>();
        
        if (fixedLabData != null) {
            combinedData.put("albumin", fixedLabData.getAlbumin());
            // ... 추가된 lab 데이터 설정
            combinedData.put("whiteBloodCells", fixedLabData.getWhiteBloodCells());
        }
        
        List<VitalSigns> vitalSignsList = vitalSignsService.getVitalSigns2ByStayId(stayId);
        if (vitalSignsList.isEmpty()) {
            emitter.complete();
            return emitter;
        }
        
        AtomicInteger index = new AtomicInteger(0);
        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        
        executor.scheduleAtFixedRate(() -> {
            try {
                if (index.get() < vitalSignsList.size()) {
                    VitalSigns vs = vitalSignsList.get(index.getAndIncrement());
                    
                    combinedData.put("chartNum", vs.getChartNum());
                    combinedData.put("heartrate", vs.getHeartrate());
                    combinedData.put("temperature", vs.getTemperature());
                    
                    emitter.send(SseEmitter.event().data(combinedData).name("patientData").build());
                } else {
                    executor.shutdown();
                    emitter.complete();
                }
            } catch (Exception e) {
                log.error("Error while streaming data", e);
                executor.shutdown();
                emitter.completeWithError(e);
            }
        }, 0, 10, TimeUnit.SECONDS);
        
        emitter.onCompletion(() -> {
            executor.shutdown();
            log.info("SSE completed");
        });
        
        emitter.onTimeout(() -> {
            executor.shutdown();
            emitter.complete();
            log.info("SSE timeout");
        });
        
        emitter.onError((ex) -> {
            executor.shutdown();
            log.error("SSE error", ex);
        });
        
        return emitter;
    }
    
    // Ward Assignment 관련 기능
    @GetMapping("/ward-assignment/{stayId}/{subjectId}/{chartNum}")
    public ResponseEntity<Map<String, String>> getWardAssignment(
            @PathVariable Long stayId,
            @PathVariable int subjectId,
            @PathVariable String chartNum) {
        
        try {
            String wardCode = assignmentService.determineWardByAiTAS(chartNum);
            Map<String, String> response = new HashMap<>();
            response.put("wardAssignment", wardCode);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in ward assignment process", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    
}
