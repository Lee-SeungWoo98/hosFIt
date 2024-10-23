package kr.spring.entity;
import javax.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "EnzymesMetabolism")
@Data
public class EnzymesMetabolism {

    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @Column(name = "CK")
    private Long ck;

    @Column(name = "CKMB")
    private Long ckmb;

    @Column(name = "Creatinine")
    private Long creatinine;

    @Column(name = "DDimer")
    private Long dDimer;

    @Column(name = "GGT")
    private Long ggt;

    @Column(name = "Glucose")
    private Long glucose;

    @Column(name = "INRPT")
    private Long inrpt;

    @Column(name = "Lactate")
    private Long lactate;

    @Column(name = "LD")
    private Long ld;

    @Column(name = "Lipase")
    private Long lipase;

    @Column(name = "Magnesium")
    private Long magnesium;

    @Column(name = "NTproBNP")
    private Long ntproBNP;

    @Column(name = "regdate")
    private LocalDateTime  regdate;

    // 외래키 관계 설정
    @ManyToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private LabTest labtest;

    // getter, setter 생략
}