package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "chemicalexaminationsenzymes")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChemicalExaminationsEnzymes {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private LabTest labTest;
    
    @Column(name = "acetone")
    private Long acetone;
    
    @Column(name = "alt")
    private Long alt;
    
    @Column(name = "albumin")
    private Long albumin;
    
    @Column(name = "alkalinephosphatase")
    private Long alkalinePhosphatase;
    
    @Column(name = "ammonia")
    private Long ammonia;
    
    @Column(name = "amylase")
    private Long amylase;
    
    @Column(name = "ast")
    private Long ast;
    
    @Column(name = "betahydroxybutyrate")
    private Long betaHydroxybutyrate;
    
    @Column(name = "bicarbonate")
    private Long bicarbonate;
    
    @Column(name = "bilirubin")
    private Long bilirubin;
    
    @Column(name = "crp")
    private Long crp;
    
    @Column(name = "calcium")
    private Long calcium;
    
    @Column(name = "co2")
    private Long co2;
    
    @Column(name = "chloride")
    private Long chloride;
    
    @Column(name = "regdate")
    private LocalDateTime regdate;
}

