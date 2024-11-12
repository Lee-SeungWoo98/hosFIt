package kr.spring.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VisitDTO {
    private Long stayId;
    private Long pain;
    private String losHours;
    private Long tas;
    private Long arrivalTransport;
    private Long label;
    private LocalDateTime visitDate;
    private List<VitalSignsDTO> vitalSigns;
    private Map<String, Object> wardAssignment;  // String -> Object로 변경하여 level 값들도 저장

    public VisitDTO(Long stayId, Long pain, String losHours, Long tas,
                   Long arrivalTransport, Long label, LocalDateTime visitDate,
                   List<VitalSignsDTO> vitalSigns, Map<String, Object> wardAssignment) {
        this.stayId = stayId;
        this.pain = pain;
        this.losHours = losHours;
        this.tas = tas;
        this.arrivalTransport = arrivalTransport;
        this.label = label;
        this.visitDate = visitDate;
        this.vitalSigns = vitalSigns;
        this.wardAssignment = wardAssignment;
    }
}