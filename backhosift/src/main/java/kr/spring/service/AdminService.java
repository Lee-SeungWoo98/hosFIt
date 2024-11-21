package kr.spring.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.dto.AccuracyResultDTO;
import kr.spring.dto.MismatchResultDTO;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.entity.WardAssignment;
import kr.spring.repository.VisitRepository;
import kr.spring.repository.WardAssignmentRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminService {

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private WardAssignmentRepository wardAssignmentRepository;

    // 배치 정확도 계산
    public AccuracyResultDTO compareWardAndLabel() {
        AccuracyResultDTO result = new AccuracyResultDTO();
        double accuracy = calculateAIMatchRate();
        result.setAccuracy(accuracy);
        return result;
    }

    // 대시보드 통계 데이터 생성
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
            
            // 일일 환자 수 계산
            long dailyPatients = visitRepository.countByVisitDateBetween(startOfDay, endOfDay);
            stats.put("dailyPatients", dailyPatients);

            // 전일 대비 변화율 계산
            LocalDateTime startOfPreviousDay = startOfDay.minusDays(1);
            LocalDateTime endOfPreviousDay = startOfDay.minusNanos(1);
            long previousDayPatients = visitRepository.countByVisitDateBetween(startOfPreviousDay, endOfPreviousDay);
            
            double changeRate = previousDayPatients == 0 ? 0 : 
                ((dailyPatients - previousDayPatients) / (double)previousDayPatients * 100);
            stats.put("changeRate", Math.round(changeRate * 10.0) / 10.0);
            stats.put("trend", changeRate >= 0 ? "up" : "down");

            // AI 일치율 계산
            double aiMatchRate = calculateAIMatchRate();
            stats.put("aiMatchRate", Math.round(aiMatchRate * 10.0) / 10.0);

        } catch (Exception e) {
            log.error("Error generating dashboard statistics", e);
            stats.put("error", "통계 생성 중 오류가 발생했습니다");
        }

        return stats;
    }

    private double calculateAIMatchRate() {
        long matchCount = 0;
        long totalCount = 0;

        List<Visit> visits = visitRepository.findAllWithLabel();
        for (Visit visit : visits) {
            for (VitalSigns vital : visit.getVitalSigns()) {
                Optional<WardAssignment> assignment = 
                    wardAssignmentRepository.findByChartNum(vital.getChartNum());
                if (assignment.isPresent()) {
                    totalCount++;
                    if (isMatchingWard(visit.getLabel(), assignment.get())) {
                        matchCount++;
                    }
                }
            }
        }

        return totalCount > 0 ? (matchCount * 100.0 / totalCount) : 0.0;
    }

    // 불일치 분석 데이터 생성
    public MismatchResultDTO getMismatchAnalysis() {
        MismatchResultDTO result = new MismatchResultDTO();
        Map<String, Long> counts = new HashMap<>();
        AtomicLong total = new AtomicLong(0);

        try {
            List<Visit> visits = visitRepository.findAllWithLabel();
            
            for (Visit visit : visits) {
                for (VitalSigns vital : visit.getVitalSigns()) {
                    Optional<WardAssignment> assignment = 
                        wardAssignmentRepository.findByChartNum(vital.getChartNum());
                    if (assignment.isPresent() && visit.getLabel() != null) {
                        String mismatchType = getMismatchType(visit.getLabel(), assignment.get());
                        if (mismatchType != null) {
                            counts.merge(mismatchType, 1L, Long::sum);
                            total.incrementAndGet();
                        }
                    }
                }
            }
            Map<String, Double> percentages = new HashMap<>();
            if (total.get() > 0) {
                counts.forEach((key, value) -> 
                    percentages.put(key, (value * 100.0 / total.get()))
                );
            }

            result.setMismatchCounts(counts);
            result.setTotalCount(total.get());
            result.setMismatchPercentages(percentages);

        } catch (Exception e) {
            log.error("Error in mismatch analysis", e);
        }

        return result;
    }

    private boolean isMatchingWard(Long label, WardAssignment assignment) {
        if (label == null) return false;

        float maxLevel = Math.max(
            Math.max(assignment.getLevel1(), assignment.getLevel2()),
            assignment.getLevel3()
        );

        switch (label.intValue()) {
            case 0: return maxLevel == assignment.getLevel1();
            case 1: return maxLevel == assignment.getLevel2();
            case 2: return maxLevel == assignment.getLevel3();
            default: return false;
        }
    }

    private String getMismatchType(Long label, WardAssignment assignment) {
        float maxLevel = Math.max(
            Math.max(assignment.getLevel1(), assignment.getLevel2()),
            assignment.getLevel3()
        );

        if (label == 0) {
            if (maxLevel == assignment.getLevel2()) return "label0:level1";
            if (maxLevel == assignment.getLevel3()) return "label0:level2";
        } else if (label == 1) {
            if (maxLevel == assignment.getLevel1()) return "label1:level0";
            if (maxLevel == assignment.getLevel3()) return "label1:level2";
        } else if (label == 2) {
            if (maxLevel == assignment.getLevel1()) return "label2:level0";
            if (maxLevel == assignment.getLevel2()) return "label2:level1";
        }

        return null;
    }

    // 예측 데이터 생성
    public Map<String, Object> getPredictionData() {
        Map<String, Object> prediction = new HashMap<>();
        try {
            // 예시 데이터 - 실제 구현에서는 데이터베이스나 AI 모델에서 가져와야 함
            prediction.put("nextHourPrediction", 85.5);
            prediction.put("confidence", 0.92);
            prediction.put("trend", "increasing");
            prediction.put("lastUpdated", LocalDateTime.now());
        } catch (Exception e) {
            log.error("Error getting prediction data", e);
            prediction.put("error", "Failed to get prediction data");
        }
        return prediction;
    }

    // 가중치 설정 값을 반환
    public Map<String, Double> getWeightThresholds() {
        Map<String, Double> thresholds = new HashMap<>();
        try {
            // 예시 데이터 - 실제 구현에서는 데이터베이스나 설정 파일에서 가져와야 함
            thresholds.put("0", 0.7);
            thresholds.put("1", 0.4);
            thresholds.put("2", 0.2);
        } catch (Exception e) {
            log.error("Error fetching weight thresholds", e);
        }
        return thresholds;
    }
 // 가중치 업데이트
    public void updateWeightThreshold(String key, Float value) {
        if (value < 0 || value > 1) {
            throw new IllegalArgumentException("Threshold value must be between 0 and 1");
        }

        Map<String, Double> thresholds = getWeightThresholds();
        thresholds.put(key, value.doubleValue());

        // 여기에 실제 저장 로직 추가 (예: 데이터베이스 업데이트)
        log.info("Updated threshold - key: {}, value: {}", key, value);
    }

    // 병상 수를 반환
    public int getBedCount() {
        try {
            // 예시 데이터 - 실제 구현에서는 데이터베이스에서 가져와야 함
            return 120;
        } catch (Exception e) {
            log.error("Error fetching bed count", e);
            return 0;
        }
    }

    // 병상 수 업데이트
    public void updateBedCapacity(int totalBeds) {
        try {
            // 실제 구현에서는 데이터베이스 업데이트가 필요함
            log.info("Updating bed capacity to {}", totalBeds);
            // 여기서는 예시로 로그만 출력
        } catch (Exception e) {
            log.error("Error updating bed capacity", e);
        }
    }
}
