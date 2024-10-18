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
public class MedicalRecord {
    
    @Id // Primary-Key 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
    private Long medicalRecordId; // 번호
    
    @Column(length = 2000)
    private Long subjectId; // 제목
    
    @ManyToOne
    @JoinColumn(name = "patientid", nullable = false)
    private Patient patient; // Patient 엔티티와의 관계
    
    @Column
    private Long stayTime; // 작성자
    
    @Column
    private Long ktas; // 작성자
    
    @Column
    private Long placementResult;
}
