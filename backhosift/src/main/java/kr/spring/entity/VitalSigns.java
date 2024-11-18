package kr.spring.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vitalsigns")
@Getter
@Setter
public class VitalSigns {
    @Id
    @Column(name = "chartnum")
    private String chartNum;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stayid")
    @JsonBackReference
    private Visit visit;
    
    @OneToMany(mappedBy = "vitalSigns", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<AiTAS> aiTAS = new HashSet<>();
    
    @Column(name = "charttime")
    private LocalDateTime chartTime;
    
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
    
    public VitalSigns() {}
    @Transient  // DB에 저장되지 않는 임시 필드
    private Float level1;
    
    @Transient
    private Float level2;
    
    @Transient
    private Float level3;
    
    @Transient
    private String wardCode;
    // getAiTAS 메소드 수정
    public Set<AiTAS> getAiTAS() {
        return this.aiTAS;
    }

    public Float getLevel1() {
        if (level1 == null && !aiTAS.isEmpty()) {
            return aiTAS.iterator().next().getLevel1();
        }
        return level1;
    }

    public Float getLevel2() {
        if (level2 == null && !aiTAS.isEmpty()) {
            return aiTAS.iterator().next().getLevel2();
        }
        return level2;
    }

    public Float getLevel3() {
        if (level3 == null && !aiTAS.isEmpty()) {
            return aiTAS.iterator().next().getLevel3();
        }
        return level3;
    }

    public void setLevel1(Float level1) {
        this.level1 = level1;
    }

    public void setLevel2(Float level2) {
        this.level2 = level2;
    }

    public void setLevel3(Float level3) {
        this.level3 = level3;
    }

    public void setWardCode(String wardCode) {
        this.wardCode = wardCode;
    }

    public String getWardCode() {
        return this.wardCode;
    }

	public void setLabel(Long label) {
		// TODO Auto-generated method stub
		
	}

	public Object getStayId() {
		// TODO Auto-generated method stub
		return null;
	}

	public Object getLabel() {
		// TODO Auto-generated method stub
		return null;
	}
}