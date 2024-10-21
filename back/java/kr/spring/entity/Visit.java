package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "visit")
public class Visit {
    @Id
    @Column(name = "stayid")
    private Long stayId;

    @ManyToOne
    @JoinColumn(name = "subjectid")
    @JsonBackReference
    private Patient patient;

    @Column(name = "pain")
    private Long pain;

    @Column(name = "loshours")
    private String losHours;

    @Column(name = "TAS")
    private Long TAS;

    @Column(name = "arrivaltransport")
    private Long arrivalTransport;

    @Column(name = "label")
    private Long label;
    
    @Column(name = "visitdate")
    private LocalDateTime  VisitDate;


}
