package kr.spring.entity;

import java.security.Timestamp;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "labtest")
@Data
public class LabTest {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @ManyToOne
    @JoinColumn(name = "stayid", referencedColumnName = "stayid")
    private Visit visit;

    @Column(name = "testname")
    private String testName;

    @Column(name = "testresult")
    private String testResult;

    @Column(name = "testunit")
    private String testUnit;

    @Column(name = "testtime")
    private String testTime;

    @Column(name = "diagnosis")
    private String diagnosis;

    @Column(name = "diagnosiscode")
    private String diagnosisCode;

    @Column(name = "regdate")
    private LocalDateTime  regDate;

	public void setBloodLevels(List<BloodLevels> bloodLevels) {
		// TODO Auto-generated method stub
		
	}

	public void setEnzymesMetabolisms(List<EnzymesMetabolism> enzymesMetabolisms) {
		// TODO Auto-generated method stub
		
	}

	public void setElectrolyteLevels(List<ElectrolyteLevel> electrolyteLevels) {
		// TODO Auto-generated method stub
		
	}

	public void setChemicalExaminationsEnzymes(List<ChemicalExaminationsEnzymes> chemicalExaminationsEnzymes) {
		// TODO Auto-generated method stub
		
	}
	
	@OneToMany(mappedBy = "labtest", cascade = CascadeType.ALL)
    private List<BloodLevels> bloodLevels;

    @OneToMany(mappedBy = "labtest", cascade = CascadeType.ALL)
    private List<EnzymesMetabolism> enzymesMetabolisms;

    @OneToMany(mappedBy = "labtest", cascade = CascadeType.ALL)
    private List<ElectrolyteLevel> electrolyteLevels;

    @OneToMany(mappedBy = "labtest", cascade = CascadeType.ALL)
    private List<ChemicalExaminationsEnzymes> chemicalExaminationsEnzymes;

    // Getters and Setters
}
