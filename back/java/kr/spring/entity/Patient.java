package kr.spring.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import lombok.Data;

@Data // 클래스에 자주 사용되는 메서드들을 자동 생성 (getter, setter, toString 등)
@Entity
public class Patient {
    
    @Id // Primary-Key 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto_increment
    private Long patientid; // 번호
    
    @Column(length = 2000) // 컬럼의 길이 조절, 기본 255
    private Long age; // 내용
    
    @Column(length = 2000)
    private String name; // 이름
    
    @Column(updatable = false) // 수정할 때 작성자는 수정이 안되게 설정
    private Long gender; // 성별
    
    @Column(updatable = false)
    private Long arrivalTransport; // 도착 방식
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.EAGER) 
    private List<MedicalRecord> medicalRecords; // MedicalRecord 리스트
}
