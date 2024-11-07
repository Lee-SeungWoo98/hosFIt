package kr.spring.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import kr.spring.config.ThresholdConfig.AiTASThreshold;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.AiTASRepository;
import kr.spring.service.FlaskService;
import kr.spring.service.PatientAssignmentService;
import kr.spring.service.PatientMonitorService;
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
    private PatientMonitorService patientMonitorService;
    
    @Autowired
    private AiTASRepository aiTASRepository;
    
    @Autowired
    private PatientAssignmentService assignmentService;
    
    @Autowired  // final 제거하고 @Autowired로 변경
    private ThresholdConfig thresholdConfig;

    
    @GetMapping(value = "/stream/{stayId}/{subjectId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamCombinedData(@PathVariable Long stayId, 
                                        @PathVariable int subjectId,
                                        HttpServletResponse response) {
        log.info("Received request - stayId: {}, subjectId: {}", stayId, subjectId);
        
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        
        // FlaskController 데이터 로드
        List<FlaDTO> labResults = flaskService.getPatientData(subjectId);
        FlaDTO fixedLabData = !labResults.isEmpty() ? labResults.get(0) : null;
        
        // 데이터 맵 초기화
        Map<String, Object> combinedData = new LinkedHashMap<>();
        
        // Lab 데이터 설정
        if (fixedLabData != null) {
            combinedData.put("albumin", fixedLabData.getAlbumin());
            combinedData.put("alkalinePhosphatase", fixedLabData.getAlkalinePhosphatase());
            combinedData.put("ammonia", fixedLabData.getAmmonia());
            combinedData.put("amylase", fixedLabData.getAmylase());
            combinedData.put("asparateAminotransferase", fixedLabData.getAsparateAminotransferase());
            combinedData.put("betahydroxybutyrate", fixedLabData.getBetahydroxybutyrate());
            combinedData.put("bicarbonate", fixedLabData.getBicarbonate());
            combinedData.put("bilirubinTotal", fixedLabData.getBilirubinTotal());
            combinedData.put("cReactiveProtein", fixedLabData.getCReactiveProtein());
            combinedData.put("calciumTotal", fixedLabData.getCalciumTotal());
            combinedData.put("calculatedTotalCO2", fixedLabData.getCalculatedTotalCO2());
            combinedData.put("chloride", fixedLabData.getChloride());
            combinedData.put("creatineKinase", fixedLabData.getCreatineKinase());
            combinedData.put("creatineKinaseMbIsoenzyme", fixedLabData.getCreatineKinaseMbIsoenzyme());
            combinedData.put("creatinine", fixedLabData.getCreatinine());
            combinedData.put("ddimer", fixedLabData.getDdimer());
            combinedData.put("gammaGlutamyltransferase", fixedLabData.getGammaGlutamyltransferase());
            combinedData.put("glucose", fixedLabData.getGlucose());
            combinedData.put("hemoglobin", fixedLabData.getHemoglobin());
            combinedData.put("inrpt", fixedLabData.getInrpt());
            combinedData.put("lactate", fixedLabData.getLactate());
            combinedData.put("lactateDehydrogenase", fixedLabData.getLactateDehydrogenase());
            combinedData.put("lipase", fixedLabData.getLipase());
            combinedData.put("magnesium", fixedLabData.getMagnesium());
            combinedData.put("ntprobnp", fixedLabData.getNtprobnp());
            combinedData.put("pt", fixedLabData.getPt());
            combinedData.put("ptt", fixedLabData.getPtt());
            combinedData.put("plateletCount", fixedLabData.getPlateletCount());
            combinedData.put("potassium", fixedLabData.getPotassium());
            combinedData.put("redBloodCells", fixedLabData.getRedBloodCells());
            combinedData.put("sedimentationRate", fixedLabData.getSedimentationRate());
            combinedData.put("sodium", fixedLabData.getSodium());
            combinedData.put("troponinT", fixedLabData.getTroponinT());
            combinedData.put("ureaNitrogen", fixedLabData.getUreaNitrogen());
            combinedData.put("whiteBloodCells", fixedLabData.getWhiteBloodCells());
            combinedData.put("pCO2", fixedLabData.getPCO2());
            combinedData.put("pH", fixedLabData.getPH());
            combinedData.put("pO2", fixedLabData.getPO2());
            combinedData.put("gender", fixedLabData.getGender());
            combinedData.put("age", fixedLabData.getAge());
            combinedData.put("losHours", fixedLabData.getLosHours());
            combinedData.put("tas", fixedLabData.getTas());
            combinedData.put("pain", fixedLabData.getPain());
            combinedData.put("arrivalTransport", fixedLabData.getArrivalTransport());
        }
        
        // Vital Signs 데이터 설정
        List<VitalSigns> vitalSignsList = vitalSignsService.getVitalSigns2ByStayId(stayId);
        if (vitalSignsList.isEmpty()) {
            emitter.complete();
            return emitter;
        }
        
        // 10초마다 데이터 전송
        AtomicInteger index = new AtomicInteger(0);
        ScheduledExecutorService executor = Executors.newSingleThreadScheduledExecutor();
        
        executor.scheduleAtFixedRate(() -> {
            try {
                if (index.get() < vitalSignsList.size()) {
                    VitalSigns vs = vitalSignsList.get(index.getAndIncrement());
                    
                    // Vital Signs 데이터 갱신
                    combinedData.put("chartNum", vs.getChartNum());
                    combinedData.put("chartTime", vs.getChartTime());
                    combinedData.put("heartrate", vs.getHeartrate());
                    combinedData.put("resprate", vs.getResprate());
                    combinedData.put("o2sat", vs.getO2sat());
                    combinedData.put("sbp", vs.getSbp());
                    combinedData.put("dbp", vs.getDbp());
                    combinedData.put("temperature", vs.getTemperature());
                    
                    // 이벤트 전송
                    emitter.send(SseEmitter.event()
                        .data(combinedData)
                        .name("patientData")
                        .build());
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
        
        // 이벤트 핸들러 설정
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
    
    
    //배치로직 
    @GetMapping("/ward-assignment/{stayId}/{subjectId}/{chartNum}")
    public ResponseEntity<Map<String, String>> getWardAssignment(
            @PathVariable Long stayId, 
            @PathVariable int subjectId,
            @PathVariable String chartNum) {
        
        try {
            // 1. AiTAS 데이터 조회
            Optional<AiTAS> aiTAS = aiTASRepository.findByChartNum(chartNum);
            if (!aiTAS.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            // 2. 데이터 통합
            Map<String, Object> combinedData = new LinkedHashMap<>();
            
            // AiTAS 레벨 값 추가
            combinedData.put("aiTASLevel1", aiTAS.get().getLevel1());
            combinedData.put("aiTASLevel2", aiTAS.get().getLevel2());
            combinedData.put("aiTASLevel3", aiTAS.get().getLevel3());
            
            // 3. 배치 로직 실행
            String wardAssignment = assignmentService.determineWardByAiTAS(combinedData);
            
            // 4. 결과 저장을 위한 엔티티 생성 및 저장 (결과를 저장할 테이블이 있다면)
            // WardAssignment wardAssignmentEntity = new WardAssignment();
            // wardAssignmentEntity.setChartNum(chartNum);
            // wardAssignmentEntity.setAssignedWard(wardAssignment);
            // wardAssignmentRepository.save(wardAssignmentEntity);

            // 5. 결과 반환
            Map<String, String> response = new HashMap<>();
            response.put("wardAssignment", wardAssignment);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in ward assignment process", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/thresholds/aitas")
    public ResponseEntity<AiTASThreshold> getAiTASThresholds() {
        return ResponseEntity.ok(thresholdConfig.getAiTAS());
    }

    @PutMapping("/thresholds/aitas")
    public ResponseEntity<AiTASThreshold> updateAiTASThresholds(
            @RequestBody AiTASThreshold newThresholds) {
        thresholdConfig.setAiTAS(newThresholds);
        return ResponseEntity.ok(newThresholds);
    }

    // 배치 결정 로직을 별도 메서드로 분리
    private String determineWardWithThresholds(double level1, double level2, double level3) {
        AiTASThreshold threshold = thresholdConfig.getAiTAS();
        
        // 임계값을 넘는 경우에만 해당 레벨로 배정
        if (level1 >= threshold.getCriticalCareThreshold()) {
            return "CRITICAL_CARE";
        } else if (level2 >= threshold.getIntermediateCareThreshold()) {
            return "INTERMEDIATE_CARE";
        } else if (level3 >= threshold.getGeneralWardThreshold()) {
            return "GENERAL_WARD";
        } else {
            // 임계값을 넘지 않는 경우, 상대적 크기 비교
            if (level1 > level2 && level1 > level3) {
                return "CRITICAL_CARE";
            } else if (level2 > level1 && level2 > level3) {
                return "INTERMEDIATE_CARE";
            } else {
                return "GENERAL_WARD";
            }
        }
    }
}