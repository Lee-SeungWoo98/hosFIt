package kr.spring.entity;

import java.security.Timestamp;
import java.sql.Date;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "labtests")
public class Labtests {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @ManyToOne
    @JoinColumn(name = "stayid")
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

    // Getters and Setters
}
