package kr.spring.dto;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MismatchResultDTO {
    // HashMap으로 명시적 초기화
    private Map<String, Long> mismatchCounts = new HashMap<>();
    private long totalCount = 0;
    private Map<String, Double> mismatchPercentages = new HashMap<>();

    // 기본 생성자
    public MismatchResultDTO() {
        // HashMap은 이미 필드에서 초기화됨
    }

    // 모든 필드를 포함하는 생성자
    public MismatchResultDTO(Map<String, Long> mismatchCounts, 
                           long totalCount, 
                           Map<String, Double> mismatchPercentages) {
        if (mismatchCounts != null) {
            this.mismatchCounts = new HashMap<>(mismatchCounts);
        }
        this.totalCount = totalCount;
        if (mismatchPercentages != null) {
            this.mismatchPercentages = new HashMap<>(mismatchPercentages);
        }
    }

    // Map 데이터 추가 메서드
    public void addMismatchCount(String key, Long count) {
        this.mismatchCounts.put(key, count);
    }

    public void addMismatchPercentage(String key, Double percentage) {
        this.mismatchPercentages.put(key, percentage);
    }

    // Map 데이터 초기화 메서드
    public void clearMismatchCounts() {
        this.mismatchCounts.clear();
    }

    public void clearMismatchPercentages() {
        this.mismatchPercentages.clear();
    }

    // null 체크 및 안전한 getter 메서드
    public Map<String, Long> getMismatchCounts() {
        return mismatchCounts != null ? mismatchCounts : new HashMap<>();
    }

    public Map<String, Double> getMismatchPercentages() {
        return mismatchPercentages != null ? mismatchPercentages : new HashMap<>();
    }

    // 데이터 유효성 검증 메서드
    public boolean isValid() {
        return mismatchCounts != null && mismatchPercentages != null;
    }
}
