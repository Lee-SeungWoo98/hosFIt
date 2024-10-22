package kr.spring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



import kr.spring.dto.LabTestResponse;
import kr.spring.entity.BloodLevels;
import kr.spring.entity.ChemicalExaminationsEnzymes;
import kr.spring.entity.ElectrolyteLevel;
import kr.spring.entity.EnzymesMetabolism;
import kr.spring.entity.LabTest;
import kr.spring.entity.Visit;
import kr.spring.repository.BloodLevelsRepository;
import kr.spring.repository.ChemicalExaminationsEnzymesRepository;
import kr.spring.repository.ElectrolyteLevelRepository;
import kr.spring.repository.EnzymesMetabolismRepository;
import kr.spring.repository.ExaminationRepository;
import kr.spring.repository.VisitRepository;

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

    public LabTestResponse getLabTestsAndResults(Long stayId) {
        Visit visit = visitRepository.findByStayId(stayId);
        if (visit == null) {
            throw new RuntimeException("Visit not found");
        }

        List<LabTest> labTests = examinationrepository.findByVisitStayId(stayId);
        for (LabTest labtest : labTests) {
            List<BloodLevels> bloodLevels = bloodLevelsRepository.findByBloodIdx(labtest.getBloodIdx());
            List<EnzymesMetabolism> enzymesMetabolisms = enzymesMetabolismRepository.findByBloodIdx(labtest.getBloodIdx());
            List<ElectrolyteLevel> electrolyteLevels = electrolyteLevelRepository.findByBloodIdx(labtest.getBloodIdx());
            List<ChemicalExaminationsEnzymes> chemicalExaminationsEnzymes = chemicalExaminationsEnzymesRepository.findByBloodIdx(labtest.getBloodIdx());

            labtest.setBloodLevels(bloodLevels);
            labtest.setEnzymesMetabolisms(enzymesMetabolisms);
            labtest.setElectrolyteLevels(electrolyteLevels);
            labtest.setChemicalExaminationsEnzymes(chemicalExaminationsEnzymes);
        }

        return new LabTestResponse(visit, labTests);
    }
}
