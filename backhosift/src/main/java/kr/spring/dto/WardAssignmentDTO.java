package kr.spring.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WardAssignmentDTO {
    private Long id;
    private Long stayId;
    private LocalDateTime assignmentDateTime;
    private double level1;
    private double level2;
    private double level3;
    private String wardCode;
    private String chartNum;
}