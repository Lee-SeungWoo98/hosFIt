package kr.spring.service;

import java.util.HashMap; // 데이터를 Map 구조로 저장
import java.util.List; // 데이터 목록 처리
import java.util.Map; // 데이터 매핑을 위해 사용
import java.util.Random; // 대시보드 데이터 랜덤 생성
import java.util.stream.Collectors; // 리스트를 Map으로 변환
import java.time.LocalDateTime; // 시간 기반 업데이트 관리

import org.springframework.beans.factory.annotation.Autowired; // 의존성 주입
import org.springframework.data.domain.PageRequest; // 페이징 처리
import org.springframework.stereotype.Service; // Spring 서비스 클래스

import kr.spring.dto.AccuracyResultDTO; // 일치도 결과 반환 DTO
import kr.spring.dto.MismatchResultDTO; // 불일치 분석 결과 반환 DTO
import kr.spring.entity.Visit; // Visit 엔티티
import kr.spring.entity.WardAssignment; // 병상 배치 엔티티
import kr.spring.repository.VisitRepository; // Visit 데이터를 조회하기 위한 Repository
import kr.spring.repository.WardAssignmentRepository; // 병상 배치 데이터를 조회하기 위한 Repository

import lombok.extern.slf4j.Slf4j; // 로깅 기능

@Service
@Slf4j
public class AdminService {

    @Autowired
    private WardAssignmentRepository wardAssignmentRepository;

    @Autowired
    private VisitRepository visitRepository;

    // 대시보드 관련 필드 (추가됨)
    private final Random random = new Random();
    private int lastPatientCount = 127;
    private LocalDateTime lastUpdate = LocalDateTime.now();

    /**
     * [추가됨] 대시보드 통계 데이터를 생성하여 반환합니다.
     * 
     * @return Map<String, Object> 대시보드 통계 데이터
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            LocalDateTime now = LocalDateTime.now();

            // 5분 간격으로 환자 수 업데이트
            if (now.isAfter(lastUpdate.plusMinutes(5))) {
                int variation = (int) (lastPatientCount * (random.nextDouble() * 0.2 - 0.1));
                lastPatientCount = Math.max(80, Math.min(200, lastPatientCount + variation));
                lastUpdate = now;
            }

            double changeRate = (random.nextDouble() * 10) - 5; // -5% ~ +5%
            double matchRate = 85.0 + (random.nextDouble() * 10.0); // 85% ~ 95%

            // 대시보드 통계 데이터 설정
            stats.put("dailyPatients", lastPatientCount);
            stats.put("changeRate", Math.round(changeRate * 10.0) / 10.0);
            stats.put("trend", changeRate >= 0 ? "up" : "down");
            stats.put("aiMatchRate", Math.round(matchRate * 10.0) / 10.0);
            stats.put("mismatchDistribution", generateMismatchDistribution());

            log.info("Dashboard stats generated - patients: {}, change: {}%, match rate: {}%",
                    lastPatientCount, changeRate, matchRate);

        } catch (Exception e) {
            log.error("Error generating stats", e);
            stats.put("dailyPatients", 0);
            stats.put("changeRate", 0);
            stats.put("trend", "none");
            stats.put("aiMatchRate", 0);
        }

        return stats;
    }

    /**
     * [추가됨] 불일치 케이스 분포 데이터를 생성합니다.
     * 
     * @return Map<String, Double> 불일치 케이스 분포 데이터
     */
    private Map<String, Double> generateMismatchDistribution() {
        Map<String, Double> distribution = new HashMap<>();
        distribution.put("ICU_to_WARD", 4.2);
        distribution.put("ICU_to_DISCHARGE", 1.2);
        distribution.put("WARD_to_ICU", 3.8);
        distribution.put("WARD_to_DISCHARGE", 2.5);
        distribution.put("DISCHARGE_to_ICU", 0.7);
        distribution.put("DISCHARGE_to_WARD", 2.1);
        return distribution;
    }

    /**
     * 병상 배치와 라벨 간의 일치도를 계산하여 반환합니다.
     * 
     * @return AccuracyResultDTO 계산된 일치도
     */
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
                List<WardAssignment> wardAssignments = wardAssignmentRepository.findLatestByStayIds(stayIds);
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

    /**
     * 불일치 분석 결과를 반환합니다.
     * 
     * @return MismatchResultDTO 불일치 분석 결과
     */
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
                List<WardAssignment> wardAssignments = wardAssignmentRepository.findLatestByStayIds(stayIds);
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

    /**
     * 병상 배치 데이터를 Map 구조로 변환합니다.
     * 
     * @param assignments 병상 배치 데이터 목록
     * @return Map<Long, WardAssignment> stayId를 키로 하는 병상 배치 Map
     */
    private Map<Long, WardAssignment> convertToMap(List<WardAssignment> assignments) {
        return assignments.stream()
                .collect(Collectors.toMap(
                        ward -> ward.getVisit().getStayId(),
                        ward -> ward,
                        (existing, replacement) -> {
                            return existing.getChartNum().compareTo(replacement.getChartNum()) > 0
                                    ? existing
                                    : replacement;
                        }));
    }

    /**
     * 병상 배치 데이터에서 가장 높은 확률을 가지는 레벨을 반환합니다.
     * 
     * @param ward 병상 배치 데이터
     * @return Long 가장 높은 확률 레벨
     */
    private Long getHighestProbabilityLevel(WardAssignment ward) {
        float maxProb = Math.max(Math.max(ward.getLevel1(), ward.getLevel2()), ward.getLevel3());
        if (maxProb == ward.getLevel1()) return 1L;
        if (maxProb == ward.getLevel2()) return 2L;
        return 3L;
    }

    /**
     * AI 배치 레벨을 실제 라벨 값으로 변환합니다.
     * 
     * @param level AI 배치 레벨 (1~3)
     * @return Long 실제 라벨 값 (0~2)
     */
    private Long convertLevelToLabel(Long level) {
        if (level == 1L) return 0L;
        if (level == 2L) return 1L;
        if (level == 3L) return 2L;
        throw new IllegalArgumentException("Invalid level: " + level);
    }
}
