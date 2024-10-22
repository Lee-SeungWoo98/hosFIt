package kr.spring.dto;

import java.util.List;

import kr.spring.entity.LabTest;
import kr.spring.entity.Visit;

//Response DTO
public class LabTestResponse {
 private Visit visit;
 private List<LabTest> labTests;

 public LabTestResponse(Visit visit, List<LabTest> labTests) {
     this.visit = visit;
     this.labTests = labTests;
 }

 // getters and setters
}