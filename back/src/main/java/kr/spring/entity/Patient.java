package kr.spring.entity;

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

import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Data;
import lombok.EqualsAndHashCode;
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
}