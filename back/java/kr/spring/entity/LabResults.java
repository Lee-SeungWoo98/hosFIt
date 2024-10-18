package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;

@Data // 클래스에 자주 사용되는 메서드들을 자동 생성 (getter, setter, toString 등)
@Entity
public class LabResults {

    @Id // Primary-Key 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
    private Long lab_id; // 번호

    @ManyToOne
    @JoinColumn(name = "stay_id") // 외래 키를 지정
    private Stay stay; // 연관된 Stay 엔티티

    @Column(length = 2000) // 컬럼의 길이 조절, 기본값은 255
    private Long acetone; // 내용

    @Column(length = 2000) 
    private Long pH; // pH 값

    @Column(length = 2000) 
    private Long pCO2; // pCO2 값

    @Column(length = 2000) 
    private Long pO2; // pO2 값
}
