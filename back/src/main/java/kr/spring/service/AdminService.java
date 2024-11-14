package kr.spring.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
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
    
    private Map<Long, WardAssignment> convertToMap(List<WardAssignment> assignments) {
        return assignments.stream()
            .collect(Collectors.toMap(
                ward -> ward.getVisit().getStayId(),
                ward -> ward,
                (existing, replacement) -> {
                    return existing.getChartNum().compareTo(replacement.getChartNum()) > 0 
                        ? existing : replacement;
                }
            ));
    }
    
    public AccuracyResultDTO compareWardAndLabel() {
        int pageSize = 1000;
        long matchCount = 0;
        long totalCount = 0;
        
        long totalVisits = visitRepository.countByLabelIsNotNull();
        int totalPages = (int) Math.ceil((double) totalVisits / pageSize);
        
        for (int page = 0; page < totalPages; page++) {
            List<Visit> visits = visitRepository.findByLabelIsNotNullWithPaging(
                PageRequest.of(page, pageSize)).getContent();
            
            List<Long> stayIds = visits.stream()
                .map(Visit::getStayId)
                .collect(Collectors.toList());
            
            if (!stayIds.isEmpty()) {
                List<WardAssignment> wardAssignments = 
                    wardAssignmentRepository.findLatestByStayIds(stayIds);
                Map<Long, WardAssignment> latestAssignments = convertToMap(wardAssignments);
                
                for (Visit visit : visits) {
                    WardAssignment ward = latestAssignments.get(visit.getStayId());
                    if (ward != null) {
                        Long predictedLevel = getHighestProbabilityLevel(ward);
                        Long predictedLabel = convertLevelToLabel(predictedLevel);
                        if (predictedLabel.equals(visit.getLabel())) {
                            matchCount++;
                        }
                        totalCount++;
                    }
                }
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
        int pageSize = 1000;
        Map<String, Long> mismatchCounts = new HashMap<>();
        long totalProcessed = 0;
        
        long totalVisits = visitRepository.countByLabelIsNotNull();
        int totalPages = (int) Math.ceil((double) totalVisits / pageSize);
        
        for (int page = 0; page < totalPages; page++) {
            List<Visit> visits = visitRepository.findByLabelIsNotNullWithPaging(
                PageRequest.of(page, pageSize)).getContent();
                
            List<Long> stayIds = visits.stream()
                .map(Visit::getStayId)
                .collect(Collectors.toList());
                
            if (!stayIds.isEmpty()) {
                List<WardAssignment> wardAssignments = 
                    wardAssignmentRepository.findLatestByStayIds(stayIds);
                Map<Long, WardAssignment> latestAssignments = convertToMap(wardAssignments);
                
                for (Visit visit : visits) {
                    WardAssignment ward = latestAssignments.get(visit.getStayId());
                    if (ward != null) {
                        Long predictedLevel = getHighestProbabilityLevel(ward);
                        Long predictedLabel = convertLevelToLabel(predictedLevel);
                        Long actualLabel = visit.getLabel();
                        
                        if (!predictedLabel.equals(actualLabel)) {
                            String mismatchKey = String.format("label%d:level%d", 
                                actualLabel, predictedLevel);
                            mismatchCounts.merge(mismatchKey, 1L, Long::sum);
                        }
                        totalProcessed++;
                    }
                }
            }
        }
        
        Map<String, Double> percentages = new HashMap<>();
        long totalMismatches = mismatchCounts.values().stream()
            .mapToLong(Long::longValue)
            .sum();
            
        if (totalMismatches > 0) {
            mismatchCounts.forEach((key, count) -> {
                double percentage = Math.round((count.doubleValue() / 
                    totalMismatches * 1000.0)) / 10.0;
                percentages.put(key, percentage);
            });
        }
        
        log.info("Total processed: {}", totalProcessed);
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
}