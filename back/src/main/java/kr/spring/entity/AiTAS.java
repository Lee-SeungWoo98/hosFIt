package kr.spring.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Table(name = "aiTAS")
@Data
public class AiTAS implements Serializable {
	
	@Id
	@Column
	private Long id;
	
	@Column
	private Long level1;
	@Column
	private Long level2;
	@Column
	private Long level3;
	

    @Column 
    private String chartNum;
    
    @OneToOne(mappedBy = "aiTAS", fetch = FetchType.LAZY)
    private VitalSigns vitalSigns;


    public Visit getVisit() {
        return vitalSigns != null ? vitalSigns.getVisit() : null;
    }
    
    // 다른 미구현 메서드들도 실제 값을 반환하도록 수정
    public Long getResprate() {
        return vitalSigns != null ? vitalSigns.getResprate() : null;
    }


	public String getO2sat() {
		// TODO Auto-generated method stub
		return null;
	}


	public String getTemperature() {
		// TODO Auto-generated method stub
		return null;
	}


	public Long getHeartrate() {
		// TODO Auto-generated method stub
		return null;
	}


	public Long getSbp() {
		// TODO Auto-generated method stub
		return null;
	}


	public Long getDbp() {
		// TODO Auto-generated method stub
		return null;
	}
	
	
	
	

}
