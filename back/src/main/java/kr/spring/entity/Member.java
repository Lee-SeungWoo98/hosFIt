package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.ToString;
@Data //클래스에 자주사용되는 메서드들을 자동 생성 getter, setter, toString 
@ToString
@Entity
@Table(name = "Member")
public class Member {
	
	   @Id // Primary-Key 설정	   
	   private String username;// 번호
	   
	   //@Column(length = 2000) 
	   private String password; // 제목
	   
	   //@Column(length = 2000) // 컬럼의 길이 조절 안했을때는 기본 255
	   private String name; // 내용
	   
	

}
