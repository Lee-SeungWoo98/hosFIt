package kr.spring.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.spring.config.ThresholdConfig;
import kr.spring.entity.AiTAS;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.entity.WardAssignment;
import kr.spring.repository.AiTASRepository;
import kr.spring.repository.VitalSignsRepository;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.WardAssignmentRepository;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PatientAssignmentService {
    private static final int BATCH_SIZE = 500;

    private final ThresholdConfig thresholdConfig;
    private final AiTASRepository aiTASRepository;
    private final WardAssignmentRepository wardAssignmentRepository;
    private final VitalSignsRepository vitalSignsRepository;
    private final VisitRepository visitRepository;

    @Autowired
    public PatientAssignmentService(
            ThresholdConfig thresholdConfig,
            AiTASRepository aiTASRepository,
            WardAssignmentRepository wardAssignmentRepository,
            VitalSignsRepository vitalSignsRepository,
            VisitRepository visitRepository) {
        this.thresholdConfig = thresholdConfig;
        this.aiTASRepository = aiTASRepository;
        this.wardAssignmentRepository = wardAssignmentRepository;
        this.vitalSignsRepository = vitalSignsRepository;
        this.visitRepository = visitRepository;
    }

    @Transactional
    public void processBatchWardAssignments() {
        int pageNumber = 0;
        Page<VitalSigns> unprocessedVitalSignsPage;

        do {
            PageRequest pageRequest = PageRequest.of(pageNumber, BATCH_SIZE, Sort.by("chartTime"));
            unprocessedVitalSignsPage = vitalSignsRepository.findVitalSignsWithoutWardAssignment(pageRequest);

            if (unprocessedVitalSignsPage.hasContent()) {
                unprocessedVitalSignsPage.forEach(this::processWardAssignment);
                pageNumber++;
            }
        } while (unprocessedVitalSignsPage.hasNext());
    }

    @Transactional
    public void processWardAssignment(VitalSigns vitalSign) {
        String chartNum = vitalSign.getChartNum();
        Visit visit = vitalSign.getVisit();

        if (visit == null) {
            log.error("Visit 정보 없음 - ChartNum: {}", chartNum);
            return;
        }

        if (wardAssignmentRepository.existsByChartNum(chartNum)) {
            log.info("이미 Ward 배정됨 - ChartNum: {}", chartNum);
            return;
        }

        Optional<AiTAS> aiTASOptional = aiTASRepository.findFirstByVitalSigns_ChartNum(chartNum);
        if (aiTASOptional.isPresent()) {
            AiTAS aiTAS = aiTASOptional.get();
            String wardCode = determineWardByLevels(aiTAS);
            
            WardAssignment wardAssignment = WardAssignment.builder()
                .visit(visit)
                .assignmentDateTime(LocalDateTime.now())
                .level1(aiTAS.getLevel1())
                .level2(aiTAS.getLevel2())
                .level3(aiTAS.getLevel3())
                .chartNum(chartNum)
                .wardCode(wardCode)
                .build();

            WardAssignment saved = wardAssignmentRepository.save(wardAssignment);
            log.info("Ward 배정 완료 - ChartNum: {}, StayId: {}, WardCode: {}, AssignmentId: {}", 
                chartNum, visit.getStayId(), wardCode, saved.getId());
        }
    }

    private String determineWardByLevels(AiTAS aiTAS) {
        float level1 = aiTAS.getLevel1();
        float level2 = aiTAS.getLevel2(); 
        float level3 = aiTAS.getLevel3();

        if (level1 >= thresholdConfig.getCriticalCareThreshold()) {
            return "CRITICAL_CARE";
        } else if (level2 >= thresholdConfig.getIntermediateCareThreshold()) {
            return "INTERMEDIATE_CARE";
        } else if (level3 >= thresholdConfig.getGeneralWardThreshold()) {
            return "GENERAL_WARD";
        }

        return "GENERAL_WARD";
    }

    public String determineWardByAiTAS(String chartNum) {
        return aiTASRepository.findFirstByVitalSigns_ChartNum(chartNum)
            .map(this::determineWardByLevels)
            .orElse(null);
    }
}

