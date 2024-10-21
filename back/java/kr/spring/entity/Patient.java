package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "patient")
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

	public void setSubjectId(Long patient) {
		// TODO Auto-generated method stub
		
	}

    // Getters and Setters
}