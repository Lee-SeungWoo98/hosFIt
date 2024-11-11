// VitalSigns.java
package kr.spring.entity;

import java.time.LocalDateTime;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vitalsigns")
@Getter
@Setter
public class VitalSigns {
	// VitalSigns 엔티티에 @Id 어노테이션과 함께 자동생성 전략 추가
	@Id
	@Column(name = "chartnum")
	private String chartNum;

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stayid")
    @JsonBackReference
    private Visit visit;

    @Column(name = "charttime")
    private LocalDateTime chartTime;

    @Column(name = "heartrate")
    private Long heartrate;

    @Column(name = "resprate")
    private Long resprate;

    @Column(name = "o2sat")
    private String o2sat;

    @Column(name = "sbp")
    private Long sbp;

    @Column(name = "dbp")
    private Long dbp;

    @Column(name = "temperature")
    private String temperature;

    @OneToOne(mappedBy = "vitalSigns", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AiTAS aiTAS;

    // 기본 생성자
    public VitalSigns() {
    }

    // Getters and Setters
    public String getChartNum() {
        return chartNum;
    }

    public void setChartNum(String chartNum) {
        this.chartNum = chartNum;
    }

    public Visit getVisit() {
        return visit;
    }

    public void setVisit(Visit visit) {
        this.visit = visit;
    }

    public LocalDateTime getChartTime() {
        return chartTime;
    }

    public void setChartTime(LocalDateTime chartTime) {
        this.chartTime = chartTime;
    }

    public Long getHeartrate() {
        return heartrate;
    }

    public void setHeartrate(Long heartrate) {
        this.heartrate = heartrate;
    }

    public Long getResprate() {
        return resprate;
    }

    public void setResprate(Long resprate) {
        this.resprate = resprate;
    }

    public String getO2sat() {
        return o2sat;
    }

    public void setO2sat(String o2sat) {
        this.o2sat = o2sat;
    }

    public Long getSbp() {
        return sbp;
    }

    public void setSbp(Long sbp) {
        this.sbp = sbp;
    }

    public Long getDbp() {
        return dbp;
    }

    public void setDbp(Long dbp) {
        this.dbp = dbp;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public AiTAS getAiTAS() {
        return aiTAS;
    }

    public void setAiTAS(AiTAS aiTAS) {
        this.aiTAS = aiTAS;
    }

	public Object getStayId() {
		// TODO Auto-generated method stub
		return null;
	}
}