package kr.spring.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.VitalSignsRepository;
@Service
public class PatientMonitorService {

	@Autowired
    private VitalSignsRepository vitalSignsRepository;
    
    @Autowired
    private FlaskService flaskService; // 검사 결과를 가져오는 서비스

    @Transactional
    public Map<String, Object> getCombinedPatientData(VitalSigns vitalSign, int subjectId) {
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
        
        return combinedData;
    }
}