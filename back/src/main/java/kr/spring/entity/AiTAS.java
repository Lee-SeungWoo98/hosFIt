package kr.spring.entity;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "aiTAS")
@Getter
@Setter
public class AiTAS {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column
    private float level1;
    
    @Column
    private float level2;
    
    @Column
    private float level3;
    
    @Column(name = "chartnum")  // 실제 DB 컬럼명
    private String chartNum;    // chartNum 필드 추가
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chartnum", referencedColumnName = "chartnum", insertable = false, updatable = false)
    private VitalSigns vitalSigns;
    
    public AiTAS() {}
    
    public AiTAS(float level1, float level2, float level3, VitalSigns vitalSigns) {
        this.level1 = level1;
        this.level2 = level2;
        this.level3 = level3;
        this.vitalSigns = vitalSigns;
        this.chartNum = vitalSigns.getChartNum();  // VitalSigns의 chartNum을 설정
    }
}