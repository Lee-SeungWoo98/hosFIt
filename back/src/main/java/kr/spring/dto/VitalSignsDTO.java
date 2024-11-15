package kr.spring.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
    private String wardCode;
    private Float level1;
    private Float level2;
    private Float level3;

    public VitalSignsDTO(String chartNum, LocalDateTime chartTime, Long heartrate, 
            Long resprate, String o2sat, Long sbp, Long dbp, 
            String temperature, LocalDateTime regDate, 
            String wardCode, Float level1, Float level2, Float level3) {
this.chartNum = chartNum;
this.chartTime = chartTime;
this.heartrate = heartrate;
this.resprate = resprate;
this.o2sat = o2sat;
this.sbp = sbp;
this.dbp = dbp;
this.temperature = temperature;
this.regDate = regDate;
this.wardCode = wardCode;
this.level1 = level1;
this.level2 = level2;
this.level3 = level3;
}

    public Float getLevel1() {
        return level1;
    }

    public void setLevel1(Float float1) {
        this.level1 = float1;
    }

    public Float getLevel2() {
        return level2;
    }

    public void setLevel2(Float float1) {
        this.level2 = float1;
    }

    public Float getLevel3() {
        return level3;
    }

    public void setLevel3(Float float1) {
        this.level3 = float1;
    }
}
