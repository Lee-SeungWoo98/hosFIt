package kr.spring.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "aiTAS")
@Getter
@Setter
public class AiTAS implements Serializable {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @Column
	    private float level1;

	    @Column
	    private float level2;

	    @Column
	    private float level3;

	    // OneToOne 매핑에서 필드 이름 중복 오류 방지를 위해 필드명 수정
	    @Column(name = "chartnum", nullable = false)
	    private String chartNum; 

	    @OneToOne
	    @JoinColumn(name = "chartnum", referencedColumnName = "chartnum", insertable = false, updatable = false)
	    private VitalSigns vitalSigns;

	    public AiTAS() {}

	    public AiTAS(float level1, float level2, float level3, String chartNum) {
	        this.level1 = level1;
	        this.level2 = level2;
	        this.level3 = level3;
	        this.chartNum = chartNum; // 필드에 직접 설정
	    }
    // VitalSigns와 연관된 데이터를 반환하는 getter들
    public Visit getVisit() {
        return vitalSigns != null ? vitalSigns.getVisit() : null;
    }

    public Long getResprate() {
        return vitalSigns != null ? vitalSigns.getResprate() : null;
    }

    public Long getHeartrate() {
        return vitalSigns != null ? vitalSigns.getHeartrate() : null;
    }

    public String getO2sat() {
        return vitalSigns != null ? vitalSigns.getO2sat() : null;
    }

    public String getTemperature() {
        return vitalSigns != null ? vitalSigns.getTemperature() : null;
    }

    public Long getSbp() {
        return vitalSigns != null ? vitalSigns.getSbp() : null;
    }

    public Long getDbp() {
        return vitalSigns != null ? vitalSigns.getDbp() : null;
    }
	
}
