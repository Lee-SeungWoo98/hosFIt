package kr.spring.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.LabelChangeHistory;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.LabelChangeHistoryRepository;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.VitalSignsRepository;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class PatientMonitorService {

	@Autowired
    private VitalSignsRepository vitalSignsRepository;
	
	@Autowired
    private LabelChangeHistoryRepository labelChangeHistoryRepository;
    
	
	@Autowired
    private VisitRepository visitRepository;
    
    @Autowired
    private FlaskService flaskService; // 검사 결과를 가져오는 서비스
    
    @Value("${valid.label.values}")
    private List<Long> validLabelValues;
    @Transactional
    public Map<String, Object> getCombinedPatientData(VitalSigns vitalSign, Long subjectId) {
        // 고정된 검사 결과 데이터 가져오기
        List<FlaDTO> labResults = flaskService.getPatientData(subjectId);
        FlaDTO fixedLabData = !labResults.isEmpty() ? labResults.get(0) : null;
        
        // 결과를 담을 Map 생성
        Map<String, Object> combinedData = new LinkedHashMap<>();
        
        // Vital Signs 데이터 추가
        combinedData.put("chartNum", vitalSign.getChartNum());
        combinedData.put("chartTime", vitalSign.getChartTime());
        combinedData.put("heartrate", vitalSign.getHeartrate());
        combinedData.put("resprate", vitalSign.getResprate());
        combinedData.put("o2sat", vitalSign.getO2sat());
        combinedData.put("sbp", vitalSign.getSbp());
        combinedData.put("dbp", vitalSign.getDbp());
        combinedData.put("temperature", vitalSign.getTemperature());
        
        // 고정된 검사 결과 데이터 추가
        if (fixedLabData != null) {
            combinedData.put("albumin", fixedLabData.getAlbumin());
            combinedData.put("alkalinePhosphatase", fixedLabData.getAlkalinePhosphatase());
            combinedData.put("ammonia", fixedLabData.getAmmonia());
            combinedData.put("amylase", fixedLabData.getAmylase());
            combinedData.put("asparateAminotransferase", fixedLabData.getAsparateAminotransferase());
            combinedData.put("betahydroxybutyrate", fixedLabData.getBetahydroxybutyrate());
            combinedData.put("bicarbonate", fixedLabData.getBicarbonate());
            combinedData.put("bilirubinTotal", fixedLabData.getBilirubinTotal());
            combinedData.put("cReactiveProtein", fixedLabData.getCreactiveProtein());
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
            combinedData.put("pt", fixedLabData.getPT());
            combinedData.put("ptt", fixedLabData.getPTT());
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
        
        return combinedData;
    }
    
    
    
  
    
    @Transactional
    public Map<String, Object> updateVisitLabel(Long stayId, Long newLabel, String comment) {
        // 입력값 검증
        if (stayId == null || newLabel == null) {
            throw new IllegalArgumentException("StayId와 Label 값은 필수입니다.");
        }

        if (!validLabelValues.contains(newLabel)) {
            throw new IllegalArgumentException("유효하지 않은 라벨 값입니다: " + newLabel);
        }

        // Visit 조회 및 락 획득
        Visit visit = visitRepository.findByStayIdWithLock(stayId)
            .orElseThrow(() -> new EntityNotFoundException("해당 방문 기록을 찾을 수 없습니다. StayId: " + stayId));

        // 변경 이력 기록
        LabelChangeHistory history = new LabelChangeHistory();
        history.setStayId(stayId);
        history.setOldLabel(visit.getLabel());
        history.setNewLabel(newLabel);
        history.setChangeTime(LocalDateTime.now());
        labelChangeHistoryRepository.save(history);

        // 라벨과 코멘트 업데이트
        visit.setLabel(newLabel);
        visit.setComment(comment);
        visit = visitRepository.save(visit);

        Map<String, Object> response = new HashMap<>();
        response.put("stayId", stayId);
        response.put("label", newLabel);
        response.put("comment", comment);
        response.put("visitDate", visit.getVisitDate());
        response.put("updated", true);

        log.info("Visit label and comment updated successfully for stayId: {}, new label: {}", stayId, newLabel);

        return response;
    }
}


   
