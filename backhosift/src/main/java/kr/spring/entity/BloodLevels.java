package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Data;

@Entity
@Table(name = "bloodlevels")
@Data
public class BloodLevels {

    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @ManyToOne
    @JoinColumn(name = "bloodidx", referencedColumnName = "bloodidx", insertable = false, updatable = false)
    @JsonBackReference
    private LabTest labtest;

    @Column(name = "hemoglobin")
    private String hemoglobin;

    @Column(name = "plateletcount")
    private Long plateletCount;

    @Column(name = "wbc")
    private String wbc;

    @Column(name = "rbc")
    private String rbc;

    @Column(name = "sedimentationrate")
    private Long sedimentationRate;

    @Column(name = "regdate")
    private LocalDateTime regDate;

    // Getters and Setters
}
