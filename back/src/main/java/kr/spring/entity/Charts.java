package kr.spring.entity;

import java.security.Timestamp;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "charts")
public class Charts {
    @Id
    @Column(name = "chartnum")
    private String chartNum;

    @Column(name = "charttime")
    private String chartTime;

    @ManyToOne
    @JoinColumn(name = "stayid")
    private Visit visit;

    @Column(name = "heartrate")
    private Long heartrate;

    @Column(name = "resprate")
    private Long resprate;

    @Column(name = "o2sat")
    private String o2sat;

    @Column(name = "sbp")
    private Long sbp;

    @Column(name = "dbp")
    private Long dbp;

    @Column(name = "temperature")
    private String temperature;

    @Column(name = "regdate")
    private String regDate;

    // Getters and Sette
}