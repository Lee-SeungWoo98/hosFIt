package kr.spring.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "patient")
@ToString
@Data
public class Patient {
    @Id
    @Column(name = "subjectid")
    private Long subjectId;

    @Column(name = "name")
    private String name;

    @Column(name = "gender")
    private String gender;

    @Column(name = "birthdate")
    private String birthdate;

    @Column(name = "age")
    private Long age;

    @Column(name = "address")
    private String address;
    
    @Column(name = "pregnancystatus")
    private String pregnancystatus;
    
    
    @Column(name = "phonenumber")
    private Long PhoneNumber;
    
    
    @Column(name = "residentnum")
    private String ResidentNum;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Visit> visits;


    // Getters and Setters
}