package kr.spring.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;
@Data // 클래스에 자주 사용되는 메서드들을 자동 생성 (getter, setter, toString 등)
@Entity
public class MedicalRecord {
	
	
	   @Id // Primary-Key 설정
	   @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
	   private Long patient_id;// 번호
	   
	   @Column(length = 2000) 
	   private Long subject_id; // 제목
	   
	   @Column(length = 2000) // 컬럼의 길이 조절 안했을때는 기본 255
	   private Long age; // 내용
	   
	   @Column(length = 2000) // 컬럼의 길이 조절 안했을때는 기본 255
	   private String name; // 내용
	   
	   // 날짜는 입력할때 기본 값으로 now() 함수를 사용하며 수정이 안되게 하겠다
	   @Column(insertable = false, updatable = false, columnDefinition = "datetime default now()")
	   private Date indate; // 날짜
	   
	   @Column(updatable = false) // 수정할때 작성자는 수정이 안되게 하겠다
	   private Long gender; // 작성자
	   
	   @Column(updatable = false) // 수정할때 작성자는 수정이 안되게 하겠다
	   private Long arrival_transport; // 작성자
	   
	
	

}
