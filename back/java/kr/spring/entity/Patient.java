package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
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
    private Long ResidentNum;
    


    // Getters and Setters
}