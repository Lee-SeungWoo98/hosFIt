package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
@Data //클래스에 자주사용되는 메서드들을 자동 생성 getter, setter, toString 
@Entity//
public class ServerityLevel {
	
	@Id // Primary-Key 설정
	   @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
	   private Long severity_id;// 번호
	   
	   @ManyToOne
	   @JoinColumn(name = "room_id") // 외래 키를 지정 
	   private Stay stay_id; // 제목
	   
	   @Column(length = 2000) // 컬럼의 길이 조절 안했을때는 기본 255
	   private Long severity_level; // 내용
	   
	   @Column(length = 2000) // 수정할때 작성자는 수정이 안되게 하겠다
	   private String assigned_unit; // 작성자
	   
	   @ManyToOne
	   @JoinColumn(name = "stay_id") // 외래 키를 지정  // 수정할때 작성자는 수정이 안되게 하겠다
	   private Room room_id; // 작성자

}
