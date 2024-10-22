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
@Table(name = "Chemicalexaminationsenzymes")
@Data
public class ChemicalExaminationsEnzymes {

    @Id
    @Column(name = "bloodidx")
    private Integer bloodidx;

    @Column(name = "Acetone")
    private Integer acetone;

    @Column(name = "ALT")
    private Integer alt;

    @Column(name = "Albumin")
    private Float albumin;

    @Column(name = "alkalinephosphatase")
    private Integer alkalinePhosphatase;

    @Column(name = "Ammonia")
    private Integer ammonia;

    @Column(name = "Amylase")
    private Integer amylase;

    @Column(name = "AST")
    private Integer ast;

    @Column(name = "betahydroxybutyrate")
    private Float betaHydroxybutyrate;

    @Column(name = "Bicarbonate")
    private Integer bicarbonate;

    @Column(name = "Bilirubin")
    private Float bilirubin;

    @Column(name = "CRP")
    private Float crp;

    @Column(name = "Calcium")
    private Float calcium;

    @Column(name = "CO2")
    private Integer co2;

    @Column(name = "Chloride")
    private Integer chloride;

    @Column(name = "regdate")
    private LocalDateTime  regdate;

    // 외래키 관계 설정
    @ManyToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private Labtest labtest;

    // getter, setter 생략
}
