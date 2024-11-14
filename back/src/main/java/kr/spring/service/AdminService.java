package kr.spring.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import kr.spring.dto.AccuracyResultDTO;
import kr.spring.dto.MismatchResultDTO;
import kr.spring.entity.Visit;
import kr.spring.entity.WardAssignment;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.WardAssignmentRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminService {
    
    @Autowired
    private WardAssignmentRepository wardAssignmentRepository;
    
    @Autowired
    private VisitRepository visitRepository;

    public AccuracyResultDTO compareWardAndLabel() {
        List<WardAssignment> wardAssignments = wardAssignmentRepository.findAll();
        List<Visit> visits = visitRepository.findAll().stream()
            .filter(visit -> visit.getLabel() != null)
            .collect(Collectors.toList());

        Map<Long, WardAssignment> latestWardAssignments = getLatestWardAssignments(wardAssignments);
        
        Long matchCount = 0L;
        Long totalCount = 0L;

        for (Visit visit : visits) {
            WardAssignment ward = latestWardAssignments.get(visit.getStayId());
            if (ward != null) {
                Long predictedLevel = getHighestProbabilityLevel(ward);
                Long predictedLabel = convertLevelToLabel(predictedLevel);
                if (predictedLabel.equals(visit.getLabel())) {
                    matchCount++;
                }
                totalCount++;
            }
        }

        double accuracy = totalCount > 0 
            ? Math.round((double) matchCount / totalCount * 1000.0) / 10.0
            : 0.0;
            
        log.info("Total processed visits: {}", totalCount);
        log.info("Matched predictions: {}", matchCount);
        log.info("Accuracy: {}%", accuracy);
            
        return new AccuracyResultDTO(accuracy);
    }

    public MismatchResultDTO getMismatchAnalysis() {
        List<WardAssignment> wardAssignments = wardAssignmentRepository.findAll();
        List<Visit> visits = visitRepository.findAll().stream()
            .filter(visit -> visit.getLabel() != null)
            .collect(Collectors.toList());
        
        Map<Long, WardAssignment> latestWardAssignments = getLatestWardAssignments(wardAssignments);
        Map<String, Long> mismatchCounts = new HashMap<>();
        Map<String, Double> percentages = new HashMap<>();
        
        // 먼저 불일치 횟수를 계산
        for (Visit visit : visits) {
            WardAssignment ward = latestWardAssignments.get(visit.getStayId());
            if (ward != null) {
                Long predictedLevel = getHighestProbabilityLevel(ward);
                Long predictedLabel = convertLevelToLabel(predictedLevel);
                Long actualLabel = visit.getLabel();
                
                if (!predictedLabel.equals(actualLabel)) {
                    String mismatchKey = String.format("label%d:level%d", actualLabel, predictedLevel);
                    mismatchCounts.merge(mismatchKey, 1L, Long::sum);
                }
            }
        }
        
        // 전체 불일치 수 계산
        long totalMismatches = mismatchCounts.values().stream()
            .mapToLong(Long::longValue)
            .sum();
        
        // 비율 계산
        mismatchCounts.forEach((key, count) -> {
            double percentage = Math.round((count.doubleValue() / totalMismatches * 1000.0)) / 10.0;
            percentages.put(key, percentage);
        });
        
        log.info("Total mismatches: {}", totalMismatches);
        log.info("Mismatch counts: {}", mismatchCounts);
        log.info("Percentages: {}", percentages);
        
        return new MismatchResultDTO(mismatchCounts, totalMismatches, percentages);
    }
    private Long getHighestProbabilityLevel(WardAssignment ward) {
        float maxProb = Math.max(Math.max(ward.getLevel1(), ward.getLevel2()), ward.getLevel3());
        if (maxProb == ward.getLevel1()) return 1L;
        if (maxProb == ward.getLevel2()) return 2L;
        return 3L;
    }
    
    private Long convertLevelToLabel(Long level) {
        if (level == 1L) return 0L;
        if (level == 2L) return 1L;
        if (level == 3L) return 2L;
        throw new IllegalArgumentException("Invalid level: " + level);
    }

    private Map<Long, WardAssignment> getLatestWardAssignments(List<WardAssignment> wardAssignments) {
        return wardAssignments.stream()
            .collect(Collectors.groupingBy(
                ward -> ward.getVisit().getStayId(),
                Collectors.collectingAndThen(
                    Collectors.maxBy((w1, w2) -> w1.getChartNum().compareTo(w2.getChartNum())),
                    optional -> optional.orElseThrow(() -> 
                        new RuntimeException("No ward assignment found"))
                )
            ));
    }
}