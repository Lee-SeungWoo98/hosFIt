package kr.spring.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Chemicalexaminationsenzymes")
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

    @Column(name = "Alkaline_Phosphatase")
    private Integer alkalinePhosphatase;

    @Column(name = "Ammonia")
    private Integer ammonia;

    @Column(name = "Amylase")
    private Integer amylase;

    @Column(name = "AST")
    private Integer ast;

    @Column(name = "Beta_Hydroxybutyrate")
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
    private Date regdate;

    // 외래키 관계 설정
    @ManyToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private BloodCheck bloodCheck;

    // getter, setter 생략
}
