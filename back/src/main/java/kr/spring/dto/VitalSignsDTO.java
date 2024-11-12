package kr.spring.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VitalSignsDTO {
    private String chartNum;
    private LocalDateTime chartTime;
    private Long heartrate;
    private Long resprate;
    private String o2sat;
    private Long sbp;
    private Long dbp;
    private String temperature;
    private LocalDateTime regDate;
    private String wardCode;  // 추가된 필드

    // 생성자...
    
    public VitalSignsDTO(String chartNum, LocalDateTime chartTime, 
            Long heartrate, Long resprate, String o2sat,
            Long sbp, Long dbp, String temperature, 
            LocalDateTime regDate) {
this.chartNum = chartNum;
this.chartTime = chartTime;
this.heartrate = heartrate;
this.resprate = resprate;
this.o2sat = o2sat;
this.sbp = sbp;
this.dbp = dbp;
this.temperature = temperature;
this.regDate = regDate;
}
    
    public VitalSignsDTO(String chartNum, LocalDateTime chartTime, 
            Long heartrate, Long resprate, String o2sat,
            Long sbp, Long dbp, String temperature, 
            LocalDateTime regDate, String wardCode) {
        this(chartNum, chartTime, heartrate, resprate, o2sat,
            sbp, dbp, temperature, regDate);  // 기존 생성자 호출
        this.wardCode = wardCode;
    }
}