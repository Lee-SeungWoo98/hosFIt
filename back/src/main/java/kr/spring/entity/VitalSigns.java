package kr.spring.entity;


import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;


@Entity
@Table(name = "vitalsigns")
@Data
public class VitalSigns implements Serializable {
    @Id
    @Column(name = "chartnum")
    private String chartNum;

    @Column(name = "charttime")
    private String chartTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stayId")
    @JsonBackReference
    private Visit visit;

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

    @Column(name = "regdate")
    private LocalDateTime  regDate;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chartNum", referencedColumnName = "chartNum", insertable = false, updatable = false)
    private AiTAS aiTAS;

    // getter 및 setter 메서드 추가
    public AiTAS getAiTAS() {
        return aiTAS;
    }

    public void setAiTAS(AiTAS aiTAS) {
        this.aiTAS = aiTAS;
    }
    // Getters and Sette
}