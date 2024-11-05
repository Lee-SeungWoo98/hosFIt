package kr.spring.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedEntityGraph;

import com.fasterxml.jackson.annotation.JsonBackReference;

import kr.spring.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data // getter, setter, toString, equals, hashCode 자동 생성
@AllArgsConstructor
@NamedEntityGraph  // 파라미터 없는 기본 생성자 자동 생성
public class VisitDTO {
	
	public VisitDTO() {
	    }
  
 
    private Long stayId;
    private Long pain;
    private String losHours;
    private Long tas;
    private Long arrivalTransport;
    private Long label;
    private LocalDateTime visitDate;
    
    private List<VitalSignsDTO> vitalSigns;  // 생체 신호 정보 리스트
    private List<AiDTO> AiTAS;   // AI 분석 결과 리스트

}
