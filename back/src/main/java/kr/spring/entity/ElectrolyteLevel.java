package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "electrolytelevel")
@Data
public class ElectrolyteLevel {
    
    @Id
    @Column(name = "bloodidx", insertable = false, updatable = false)
    private Long bloodIdx;

    @ManyToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false) // 중복 매핑 방지
    private LabTest labtest;

    @Column(name = "sodium")
    private Long sodium;

    @Column(name = "potassium")
    private String potassium;

    @Column(name = "chloride")
    private Long chloride;

    @Column(name = "regdate")
    private LocalDateTime  regDate;

    // Getters and Setters
}
