package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "electrolytelevel")
public class ElectrolyteLevel {
    
    @Id
    @Column(name = "bloodidx", insertable = false, updatable = false)
    private Long bloodIdx;

    @ManyToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false) // 중복 매핑 방지
    private BloodCheck bloodCheck;

    @Column(name = "sodium")
    private Long sodium;

    @Column(name = "potassium")
    private String potassium;

    @Column(name = "chloride")
    private Long chloride;

    @Column(name = "regdate")
    private String regDate;

    // Getters and Setters
}
