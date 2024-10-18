package kr.spring.entity;

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
public class Room {
	
		@Id // Primary-Key 설정
	   @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
	   private Long room_id;// 번호
		
	   @Column(length = 2000) // 컬럼의 길이 조절 안했을때는 기본 255
	   private String room_type; // 내용
	   
	   @Column(length = 2000) // 수정할때 작성자는 수정이 안되게 하겠다
	   private boolean is_occupied; // 작성자
	   
	
}
