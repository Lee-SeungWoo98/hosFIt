package kr.spring.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "patient")
@ToString
@Builder
@Getter
@Setter
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
    
    @Column(name = "ICD")
    private String icd;
    
   
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    @ToString.Exclude  // 순환 참조 방지
    @EqualsAndHashCode.Exclude  // hashCode에서 제외
    private Set<Visit> visits;

    @Override
    public int hashCode() {
        return Objects.hash(subjectId);  // subjectId만 사용
    }

	public void setVisits(List<Visit> visits2) {
		// TODO Auto-generated method stub
		
	}


    // Getters and Setters
	
	   protected Patient() {
	        // 기본 생성자는 Hibernate에서 사용됨
	    }

	    // @Builder로 인해 생성된 생성자
	    @Builder
	    public Patient(Long subjectId, String name, String gender, String birthdate, Long age, String address,
	                   String pregnancystatus, Long phoneNumber, String residentNum, String icd, Set<Visit> visits) {
	        this.subjectId = subjectId;
	        this.name = name;
	        this.gender = gender;
	        this.birthdate = birthdate;
	        this.age = age;
	        this.address = address;
	        this.pregnancystatus = pregnancystatus;
	        this.PhoneNumber = phoneNumber;
	        this.ResidentNum = residentNum;
	        this.icd = icd;
	        this.visits = visits;
	    }

	   }