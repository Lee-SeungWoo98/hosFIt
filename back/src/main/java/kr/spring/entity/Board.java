package kr.spring.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;

@Data
@Entity // Hibernate가 아래 vo 설계대로 테이블을 생성하기위한 키워드
public class Board {

   @Id // Primary-Key 설정
   @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
   private Long idx; // 번호
   
   private String title; // 제목
   
   @Column(length = 2000) // 컬럼의 길이 조절 안했을때는 기본 255
   private String content; // 내용
   
   @Column(updatable = false) // 수정할때 작성자는 수정이 안되게 하겠다
   private String writer; // 작성자
   
   // 날짜는 입력할때 기본 값으로 now() 함수를 사용하며 수정이 안되게 하겠다
   @Column(insertable = false, updatable = false, columnDefinition = "datetime default now()")
   private Date indate; // 날짜
   
   @Column(insertable = false, updatable = true, columnDefinition = "int default 0")
   private Long count; // 조회수
   
   
}
