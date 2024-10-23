package kr.spring.entity;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;


@Entity
@Table(name = "bloodgasanalysis")
@Data
public class BloodGasAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @Column(name = "pCO2")
    private String pCO2;

    @Column(name = "pH")
    private String pH;

    @Column(name = "pO2")
    private String pO2;

    @Column(name = "regdate")
    private LocalDateTime  regDate;

    @ManyToOne
    @JoinColumn(name = "bloodidx", referencedColumnName = "bloodidx", insertable = false, updatable = false)
    private LabTest labtest;
}