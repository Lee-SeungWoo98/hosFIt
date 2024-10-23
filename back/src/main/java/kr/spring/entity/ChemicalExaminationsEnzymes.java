package kr.spring.entity;

import java.sql.Date;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "chemicalexaminationsenzymes")
@Data
public class ChemicalExaminationsEnzymes {
	
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @Column(name = "Acetone")
    private Long acetone;

    @Column(name = "ALT")
    private Long alt;

    @Column(name = "Albumin")
    private Long albumin;

    @Column(name = "alkalinephosphatase")
    private Long alkalinePhosphatase;

    @Column(name = "Ammonia")
    private Long ammonia;

    @Column(name = "Amylase")
    private Long amylase;

    @Column(name = "AST")
    private Long ast;

    @Column(name = "betahydroxybutyrate")
    private Long betaHydroxybutyrate;

    @Column(name = "Bicarbonate")
    private Long bicarbonate;

    @Column(name = "Bilirubin")
    private Long bilirubin;

    @Column(name = "CRP")
    private Long crp;

    @Column(name = "Calcium")
    private Long calcium;

    @Column(name = "CO2")
    private Long co2;

    @Column(name = "Chloride")
    private Long chloride;

    @Column(name = "regdate")
    private LocalDateTime  regdate;

    // 외래키 관계 설정
    @ManyToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private LabTest labtest;

    // getter, setter 생략
}
