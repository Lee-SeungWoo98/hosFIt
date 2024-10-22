package kr.spring.dto;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedEntityGraph;

import kr.spring.entity.Visit;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data // getter, setter, toString, equals, hashCode 자동 생성
@AllArgsConstructor
@NamedEntityGraph  // 파라미터 없는 기본 생성자 자동 생성
public class LabtestDTO {
	
	
	    private Long bloodIdx;

	  
	    private Visit visit;

	    
	    private String testName;

	    
	    private String testResult;

	    
	    private String testUnit;

	    
	    private String testTime;

	    
	    private String diagnosis;

	    
	    private String diagnosisCode;

	    
	    private LocalDateTime  regDate;

	    // Getters and Setters

}
