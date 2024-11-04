package kr.spring.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VitalSignsDTO {
	  private String chartNum;
	    private String chartTime;
	    private Long heartrate;
	    private Long resprate;
	    private String o2sat;
	    private Long sbp;
	    private Long dbp;
	    private String temperature;
	    private LocalDateTime regDate;
}
