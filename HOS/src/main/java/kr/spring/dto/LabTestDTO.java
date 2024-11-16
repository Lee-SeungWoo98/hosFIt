package kr.spring.dto;

import kr.spring.entity.BloodGasAnalysis;
import kr.spring.entity.BloodLevels;
import kr.spring.entity.ChemicalExaminationsEnzymes;
import kr.spring.entity.ElectrolyteLevel;
import kr.spring.entity.EnzymesMetabolism;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;


@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class LabTestDTO {
    // 필드 선언
    private Long bloodIdx;
    private Visit visit;  // Visit 타입으로 변경
    private String testName;
    private String testResult;
    private String testUnit;
    private LocalDateTime testTime;
    private String diagnosis;
    private String diagnosisCode;
    private LocalDateTime regDate;
    private Set<BloodLevels> bloodLevels;
    private Set<ElectrolyteLevel> electrolyteLevels;
    private Set<EnzymesMetabolism> enzymesMetabolisms;
    private Set<ChemicalExaminationsEnzymes> chemicalExaminationsEnzymes;
	private Set<BloodGasAnalysis> bloodGasAnalysis;
	@JsonProperty("vitalSigns")
	private VitalSigns vitalSigns;

    // 생성자
    public LabTestDTO(Long bloodIdx, Visit visit, String testName, String testResult,
                      String string, LocalDateTime testTime, String diagnosis,
                      String diagnosisCode, LocalDateTime regDate,
                      Set<BloodLevels> bloodLevels,
                      Set<ElectrolyteLevel> electrolyteLevels,
                      Set<EnzymesMetabolism> enzymesMetabolisms,
                      Set<ChemicalExaminationsEnzymes> chemicalExaminationsEnzymes,
                      Set<BloodGasAnalysis> bloodGasAnalysis) {
        this.bloodIdx = bloodIdx;
        this.visit = visit;
        this.testName = testName;
        this.testResult = testResult;
        this.testUnit = string;
        this.testTime = testTime;
        this.diagnosis = diagnosis;
        this.diagnosisCode = diagnosisCode;
        this.regDate = regDate;
        this.bloodLevels = bloodLevels;
        this.electrolyteLevels = electrolyteLevels;
        this.enzymesMetabolisms = enzymesMetabolisms;
        this.chemicalExaminationsEnzymes = chemicalExaminationsEnzymes;
        this.bloodGasAnalysis = bloodGasAnalysis;
        
        
    }

    // Getters
    public Long getBloodIdx() {
        return bloodIdx;
    }

    public Visit getVisit() {
        return visit;
    }

    public String getTestName() {
        return testName;
    }

    public String getTestResult() {
        return testResult;
    }

    public String getTestUnit() {
        return testUnit;
    }

    public LocalDateTime getTestTime() {
        return testTime;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public String getDiagnosisCode() {
        return diagnosisCode;
    }

    public LocalDateTime getRegDate() {
        return regDate;
    }

    public Set<BloodLevels> getBloodLevels() {
        return bloodLevels;
    }

    public Set<ElectrolyteLevel> getElectrolyteLevels() {
        return electrolyteLevels;
    }

    public Set<EnzymesMetabolism> getEnzymesMetabolisms() {
        return enzymesMetabolisms;
    }

    public Set<ChemicalExaminationsEnzymes> getChemicalExaminationsEnzymes() {
        return chemicalExaminationsEnzymes;
    }
    public Set<BloodGasAnalysis> getBloodGasAnalysis() {
        return bloodGasAnalysis;
    }

	public void setLabTests(List<LabTestDTO> labTests) {
		// TODO Auto-generated method stub
		
	}

	 public VitalSigns getVitalSigns() {
	        return vitalSigns;
	    }

	    public void setVitalSigns(VitalSigns vitalSigns) {
	        this.vitalSigns = vitalSigns;
	    }
	}
	
    


    // Setters - 필요 시 추가
	
