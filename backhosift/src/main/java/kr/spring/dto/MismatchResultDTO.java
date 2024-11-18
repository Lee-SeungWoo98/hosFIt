package kr.spring.dto;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MismatchResultDTO {
    private Map<String, Long> mismatchCounts;
    private long totalCount;
    private Map<String, Double> percentages;

    public MismatchResultDTO(Map<String, Long> mismatchCounts, long totalCount, Map<String, Double> percentages) {
        this.mismatchCounts = mismatchCounts;
        this.totalCount = totalCount;
        this.percentages = percentages;
    }
}