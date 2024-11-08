package kr.spring.service;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.config.ThresholdConfig;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PatientAssignmentService {
	
	private final ThresholdConfig thresholdConfig;
	
	 @Autowired
	    public PatientAssignmentService(ThresholdConfig thresholdConfig) {
	        this.thresholdConfig = thresholdConfig;
	    }
	  
	    public String determineWardByAiTAS(Map<String, Object> data) {
	        Long level1 = (Long) data.get("aiTASLevel1");
	        Long level2 = (Long) data.get("aiTASLevel2");
	        Long level3 = (Long) data.get("aiTASLevel3");
	        
	        // 각 레벨을 Double로 변환하여 비교 (0.12, 0.45, 0.43 형태의 값 처리)
	        double l1 = level1 / 100.0;  // DB에 정수형으로 저장된 경우
	        double l2 = level2 / 100.0;
	        double l3 = level3 / 100.0;
	        
	        // 가장 높은 확률을 가진 레벨에 따라 병동 배정
	        if (l1 > l2 && l1 > l3) {
	            return "CRITICAL_CARE";
	        } else if (l2 > l1 && l2 > l3) {
	            return "INTERMEDIATE_CARE";
	        } else {
	            return "GENERAL_WARD";
	        }
	    }
	    
	    // 필요한 경우 threshold를 적용한 더 세밀한 로직
	    public String determineWardByAiTASWithThreshold(Map<String, Object> data) {
	        Long level1 = (Long) data.get("aiTASLevel1");
	        Long level2 = (Long) data.get("aiTASLevel2");
	        Long level3 = (Long) data.get("aiTASLevel3");
	        
	        double l1 = level1 / 100.0;
	        double l2 = level2 / 100.0;
	        double l3 = level3 / 100.0;
	        
	        // 임계값 설정 (예: 0.5 이상일 때만 해당 레벨로 배정)
	        double threshold = 0.5;
	        
	        if (l1 >= threshold) {
	            return "CRITICAL_CARE";
	        } else if (l2 >= threshold) {
	            return "INTERMEDIATE_CARE";
	        } else if (l3 >= threshold) {
	            return "GENERAL_WARD";
	        } else {
	            // 모든 레벨이 임계값 미만일 경우의 기본 배정
	            if (l1 > l2 && l1 > l3) {
	                return "CRITICAL_CARE";
	            } else if (l2 > l1 && l2 > l3) {
	                return "INTERMEDIATE_CARE";
	            } else {
	                return "GENERAL_WARD";
	            }
	        }
	    }
	}
    

