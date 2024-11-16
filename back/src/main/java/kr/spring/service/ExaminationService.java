package kr.spring.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.HashSet;

import javax.transaction.Transactional;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.dto.LabTestDTO;
import kr.spring.entity.BloodGasAnalysis;
import kr.spring.entity.BloodLevels;
import kr.spring.entity.ChemicalExaminationsEnzymes;
import kr.spring.entity.ElectrolyteLevel;
import kr.spring.entity.EnzymesMetabolism;
import kr.spring.entity.LabTest;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.*;

@Service
public class ExaminationService {

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private ExaminationRepository examinationrepository;

    @Autowired
    private BloodLevelsRepository bloodLevelsRepository;

    @Autowired
    private EnzymesMetabolismRepository enzymesMetabolismRepository;

    @Autowired
    private ElectrolyteLevelRepository electrolyteLevelRepository;

    @Autowired
    private ChemicalExaminationsEnzymesRepository chemicalExaminationsEnzymesRepository;
    
    @Autowired
    private BloodGasAnalysisRepository bloodGasAnalysisRepository;
    
    @Autowired
    private VitalSignsRepository vitalSignsRepository;

    @Transactional
    public List<LabTestDTO> getLabTestsAndResults(Long stayId) {
        Visit visit = visitRepository.findByStayId(stayId);

        if (visit == null) {
            throw new RuntimeException("Visit not found");
        }

        // Hibernate를 사용하여 labTests 컬렉션을 초기화
        Hibernate.initialize(visit.getLabTests());

        List<LabTest> labTests = examinationrepository.findByVisitStayId(stayId);
        
        // visit에서 vitalSigns 데이터를 가져옵니다.
        Set<VitalSigns> vitalSignsSet = visit.getVitalSigns();
        System.out.println("Fetched VitalSigns: " + vitalSignsSet);

        return labTests.stream().map(labTest -> {
            Set<BloodLevels> bloodLevels = getBloodLevels(labTest.getBloodIdx());
            Set<EnzymesMetabolism> enzymesMetabolisms = getEnzymesMetabolisms(labTest.getBloodIdx());
            Set<ElectrolyteLevel> electrolyteLevels = getElectrolyteLevels(labTest.getBloodIdx());
            Set<ChemicalExaminationsEnzymes> chemicalExaminationsEnzymes = getChemicalExaminationsEnzymes(labTest.getBloodIdx());
            Set<BloodGasAnalysis> bloodGasAnalysis = getBloodGasAnalysis(labTest.getBloodIdx());

            LabTestDTO dto = new LabTestDTO(
                labTest.getBloodIdx(),
                labTest.getVisit(),
                labTest.getTestName(),
                labTest.getTestResult(),
                labTest.getTestUnit(),
                labTest.getTestTime(),
                labTest.getDiagnosis(),
                labTest.getDiagnosisCode(),
                labTest.getRegDate(),
                bloodLevels,
                electrolyteLevels,
                enzymesMetabolisms,
                chemicalExaminationsEnzymes,
                bloodGasAnalysis
            );

            // 여러 개의 vitalSigns 중 첫 번째 데이터를 DTO에 추가
            if (!vitalSignsSet.isEmpty()) {
                dto.setVitalSigns(vitalSignsSet.iterator().next());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    // BloodLevels가 null일 경우 빈 Set 반환
    private Set<BloodLevels> getBloodLevels(Long bloodIdx) {
        List<BloodLevels> bloodLevels = bloodLevelsRepository.findByBloodIdx(bloodIdx);
        return bloodLevels != null && !bloodLevels.isEmpty() ? new HashSet<>(bloodLevels) : Collections.emptySet();
    }

    // EnzymesMetabolism가 null일 경우 빈 Set 반환
    private Set<EnzymesMetabolism> getEnzymesMetabolisms(Long bloodIdx) {
        List<EnzymesMetabolism> enzymesMetabolisms = enzymesMetabolismRepository.findByBloodIdx(bloodIdx);
        return enzymesMetabolisms != null && !enzymesMetabolisms.isEmpty() ? new HashSet<>(enzymesMetabolisms) : Collections.emptySet();
    }

    // ElectrolyteLevel가 null일 경우 빈 Set 반환
    private Set<ElectrolyteLevel> getElectrolyteLevels(Long bloodIdx) {
        List<ElectrolyteLevel> electrolyteLevels = electrolyteLevelRepository.findByBloodIdx(bloodIdx);
        return electrolyteLevels != null && !electrolyteLevels.isEmpty() ? new HashSet<>(electrolyteLevels) : Collections.emptySet();
    }

    // ChemicalExaminationsEnzymes가 null일 경우 빈 Set 반환
    private Set<ChemicalExaminationsEnzymes> getChemicalExaminationsEnzymes(Long bloodIdx) {
        List<ChemicalExaminationsEnzymes> chemicalExaminationsEnzymes = chemicalExaminationsEnzymesRepository.findByBloodIdx(bloodIdx);
        return chemicalExaminationsEnzymes != null && !chemicalExaminationsEnzymes.isEmpty() ? new HashSet<>(chemicalExaminationsEnzymes) : Collections.emptySet();
    }

    private Set<BloodGasAnalysis> getBloodGasAnalysis(Long bloodIdx) {
        List<BloodGasAnalysis> bloodGasAnalysis = bloodGasAnalysisRepository.findByBloodIdx(bloodIdx);
        return bloodGasAnalysis != null && !bloodGasAnalysis.isEmpty() ? new HashSet<>(bloodGasAnalysis) : Collections.emptySet();
    }
}
