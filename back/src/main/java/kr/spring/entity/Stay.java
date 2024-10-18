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
public class Stay {
	
	   @Id // Primary-Key 설정
	   @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
	   private Long stay_id;// 번호
	   
	   @ManyToOne
	   @JoinColumn(name = "patient_id") // 외래 키를 지정 
	   private Patient patient_id; // 제목
	   
	   @Column(length = 2000) // 컬럼의 길이 조절 안했을때는 기본 255
	   private LocalDateTime  charttime; // 내용
	   
	   @Column(length = 2000) // 수정할때 작성자는 수정이 안되게 하겠다
	   private Long pain; // 작성자
	   
	   @Column(length = 2000) // 수정할때 작성자는 수정이 안되게 하겠다
	   private Long TAS; // 작성자

}
