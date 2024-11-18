package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "labtest")
@Getter @Setter
@NoArgsConstructor
public class LabTest {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stayid")
    @JsonBackReference
    private Visit visit;

    @Column(name = "testname")
    private String testName;

    @Column(name = "testresult")
    private String testResult;

    @Column(name = "testunit")
    private String testUnit;

    @Column(name = "testtime")
    private LocalDateTime testTime;

    @Column(name = "diagnosis")
    private String diagnosis;

    @Column(name = "diagnosiscode")
    private String diagnosisCode;

    @Column(name = "regdate")
    private LocalDateTime regDate;

    @OneToOne(mappedBy = "labTest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ChemicalExaminationsEnzymes chemicalExaminationsEnzymes;

    @OneToOne(mappedBy = "labTest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private EnzymesMetabolism enzymesMetabolism;

    @OneToOne(mappedBy = "labTest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private BloodLevels bloodLevels;

    @OneToOne(mappedBy = "labTest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private BloodGasAnalysis bloodGasAnalysis;

    @OneToOne(mappedBy = "labTest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ElectrolyteLevel electrolyteLevel;

    // 연관관계 편의 메서드
    public void setChemicalExaminationsEnzymes(ChemicalExaminationsEnzymes chemical) {
        this.chemicalExaminationsEnzymes = chemical;
        if (chemical != null) {
            chemical.setLabTest(this);
        }
    }

    public void setEnzymesMetabolism(EnzymesMetabolism enzymes) {
        this.enzymesMetabolism = enzymes;
        if (enzymes != null) {
            enzymes.setLabTest(this);
        }
    }

    public void setBloodLevels(BloodLevels levels) {
        this.bloodLevels = levels;
        if (levels != null) {
            levels.setLabTest(this);
        }
    }

    public void setBloodGasAnalysis(BloodGasAnalysis gas) {
        this.bloodGasAnalysis = gas;
        if (gas != null) {
            gas.setLabTest(this);
        }
    }

    public void setElectrolyteLevel(ElectrolyteLevel level) {
        this.electrolyteLevel = level;
        if (level != null) {
            level.setLabTest(this);
        }
    }
    
    
}
