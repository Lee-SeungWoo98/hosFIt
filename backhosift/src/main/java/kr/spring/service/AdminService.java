package kr.spring.service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
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

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // AI 일치도 계산
            AccuracyResultDTO accuracyResult = compareWardAndLabel();
            stats.put("aiMatchRate", accuracyResult.getAccuracy());
            
            // 일일 환자 수 및 변화율 계산
            LocalDateTime todayStart = LocalDateTime.now().with(LocalTime.MIN);
            LocalDateTime todayEnd = LocalDateTime.now();
            LocalDateTime yesterdayStart = todayStart.minusDays(1);
            LocalDateTime yesterdayEnd = todayStart.minusSeconds(1);
            
            long todayPatients = visitRepository.countByVisitDateBetween(todayStart, todayEnd);
            long yesterdayPatients = visitRepository.countByVisitDateBetween(yesterdayStart, yesterdayEnd);
            
            double changeRate = 0.0;
            if (yesterdayPatients > 0) {
                changeRate = ((double)(todayPatients - yesterdayPatients) / yesterdayPatients) * 100;
            }
            
            stats.put("dailyPatients", todayPatients);
            stats.put("changeRate", Math.round(changeRate * 10.0) / 10.0);
            stats.put("trend", changeRate >= 0 ? "up" : "down");
            
            // 불일치 분포 데이터 추가
            MismatchResultDTO mismatchResult = getMismatchAnalysis();
            stats.put("mismatchDistribution", mismatchResult.getPercentages());
            
            log.info("Successfully generated dashboard stats: {}", stats);
            
        } catch (Exception e) {
            log.error("Error generating dashboard stats", e);
            stats.put("aiMatchRate", 0.0);
            stats.put("dailyPatients", 0);
            stats.put("changeRate", 0.0);
            stats.put("trend", "up");
            stats.put("mismatchDistribution", new HashMap<>());
        }
        
        return stats;
    }

    public AccuracyResultDTO compareWardAndLabel() {
        int totalCount = 0;
        int matchCount = 0;
        
        try {
            List<Visit> visits = visitRepository.findAllWithLabel();
            List<Long> stayIds = visits.stream()
                .map(Visit::getStayId)
                .collect(Collectors.toList());

            if (!stayIds.isEmpty()) {
                Map<Long, WardAssignment> latestAssignments = new HashMap<>();
                List<WardAssignment> wardAssignments = wardAssignmentRepository.findLatestByStayIds(stayIds);
                
                for (WardAssignment wa : wardAssignments) {
                    Long stayId = wa.getStayId();
                    latestAssignments.merge(stayId, wa, (existing, replacement) -> 
                        existing.getAssignmentDateTime().isAfter(replacement.getAssignmentDateTime()) 
                            ? existing 
                            : replacement);
                }

                for (Visit visit : visits) {
                    WardAssignment ward = latestAssignments.get(visit.getStayId());
                    if (ward != null) {
                        totalCount++;
                        Long predictedLevel = getHighestProbabilityLevel(ward);
                        if (predictedLevel.equals(visit.getLabel())) {
                            matchCount++;
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error in accuracy calculation", e);
        }

        double accuracy = totalCount > 0 
            ? Math.round(((double) matchCount / totalCount) * 1000.0) / 10.0 
            : 0.0;
            
        return new AccuracyResultDTO(accuracy);
    }

    public MismatchResultDTO getMismatchAnalysis() {
        Map<String, Long> mismatchCounts = new HashMap<>();
        Map<String, Double> percentages = new HashMap<>();
        long totalCount = 0;

        try {
            List<Visit> visits = visitRepository.findAllWithLabel();
            List<Long> stayIds = visits.stream()
                .map(Visit::getStayId)
                .collect(Collectors.toList());

            if (!stayIds.isEmpty()) {
                Map<Long, WardAssignment> latestAssignments = new HashMap<>();
                List<WardAssignment> wardAssignments = wardAssignmentRepository.findLatestByStayIds(stayIds);
                
                for (WardAssignment wa : wardAssignments) {
                    Long stayId = wa.getStayId();
                    latestAssignments.merge(stayId, wa, (existing, replacement) -> 
                        existing.getAssignmentDateTime().isAfter(replacement.getAssignmentDateTime()) 
                            ? existing 
                            : replacement);
                }

                for (Visit visit : visits) {
                    WardAssignment ward = latestAssignments.get(visit.getStayId());
                    if (ward != null) {
                        Long predictedLevel = getHighestProbabilityLevel(ward);
                        String key = String.format("label%d:level%d", visit.getLabel(), predictedLevel);
                        
                        if (!predictedLevel.equals(visit.getLabel())) {
                            mismatchCounts.merge(key, 1L, Long::sum);
                        }
                        totalCount++;
                    }
                }

                long totalMismatches = mismatchCounts.values().stream()
                    .mapToLong(Long::longValue)
                    .sum();

                mismatchCounts.forEach((key, count) -> {
                    double percentage = totalMismatches > 0 
                        ? (count.doubleValue() / totalMismatches) * 100 
                        : 0.0;
                    percentages.put(key, Math.round(percentage * 10.0) / 10.0);
                });
            }

        } catch (Exception e) {
            log.error("Error in mismatch analysis", e);
        }

        return new MismatchResultDTO(mismatchCounts, totalCount, percentages);
    }

    private Long getHighestProbabilityLevel(WardAssignment ward) {
        float[] levels = {ward.getLevel1(), ward.getLevel2(), ward.getLevel3()};
        float maxLevel = Math.max(Math.max(levels[0], levels[1]), levels[2]);
        
        for (int i = 0; i < levels.length; i++) {
            if (levels[i] == maxLevel) {
                return (long) (i + 1);
            }
        }
        return 1L;
    }
}