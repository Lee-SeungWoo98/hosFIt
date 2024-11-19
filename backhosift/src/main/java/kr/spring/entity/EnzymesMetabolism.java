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
@Table(name = "EnzymesMetabolism")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnzymesMetabolism {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private LabTest labTest;
    
    @Column(name = "ck")
    private Long ck;
    
    @Column(name = "ckmb")
    private Long ckmb;
    
    @Column(name = "creatinine")
    private Long creatinine;
    
    @Column(name = "ddimer")
    private Long dDimer;
    
    @Column(name = "ggt")
    private Long ggt;
    
    @Column(name = "glucose")
    private Long glucose;
    
    @Column(name = "inrpt")
    private Long inrpt;
    
    @Column(name = "lactate")
    private Long lactate;
    
    @Column(name = "ld")
    private Long ld;
    
    @Column(name = "lipase")
    private Long lipase;
    
    @Column(name = "magnesium")
    private Long magnesium;
    
    @Column(name = "ntprobnp")
    private Long ntproBNP;
    
    @Column(name = "regdate")
    private LocalDateTime regdate;
}