package kr.spring.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class VisitDTO {
    private Long stayId;
    private Long pain;
    private String losHours;
    private Long tas;
    private Long arrivalTransport;
    private Long label;
    private LocalDateTime visitDate;
    private Set<VitalSignsDTO> vitalSigns = new TreeSet<>((v1, v2) -> v1.getChartNum().compareTo(v2.getChartNum()));
    private Map<String, Object> wardAssignment;
    private String comment;

    public VisitDTO(Long stayId, Long pain, String losHours, Long tas,
                   Long arrivalTransport, Long label, LocalDateTime visitDate,
                   List<VitalSignsDTO> vitalSignsDTOs, Map<String, Object> wardAssignment, String comment) {
        this.stayId = stayId;
        this.pain = pain;
        this.losHours = losHours;
        this.tas = tas;
        this.arrivalTransport = arrivalTransport;
        this.label = label;
        this.visitDate = visitDate;
        this.vitalSigns.addAll(vitalSignsDTOs); // List를 Set으로 변환하여 추가
        this.wardAssignment = wardAssignment;
        this.comment = comment;
    }
}