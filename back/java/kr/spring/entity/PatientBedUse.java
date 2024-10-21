package kr.spring.entity;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "patientbeduse")
public class PatientBedUse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Long idx;

    @ManyToOne
    @JoinColumn(name = "subjectid", referencedColumnName = "subjectid")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "bednum", referencedColumnName = "bednum")
    private BedInfo bedInfo;

    @Column(name = "TAS")
    private Long TAS;

    @Column(name = "startdatetime")
    private String startDateTime;

    @Column(name = "endtimestamp")
    private String endTimestamp;
    
    @Column(name = "aitasid")
    private Long AiTasId;
    

    // Getters and Setters
}