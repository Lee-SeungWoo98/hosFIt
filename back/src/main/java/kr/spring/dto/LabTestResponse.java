package kr.spring.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import kr.spring.entity.LabTest;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import lombok.Data;

//Response DTO
@Data
public class LabTestResponse {
    @JsonProperty("visit")
    private Visit visit;

    @JsonProperty("lab_tests")
    private List<LabTest> labTests;

    // 추가 필드 및 getter, setter
    public LabTestResponse(Visit visit, List<LabTest> labTests) {
        this.visit = visit;
        this.labTests = labTests;
    }
    
    
}