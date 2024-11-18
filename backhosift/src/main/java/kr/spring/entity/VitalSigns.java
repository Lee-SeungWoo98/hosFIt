package kr.spring.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "vitalsigns")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalSigns {
    @Id
    @Column(name = "chartnum")
    private String chartNum;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stayid")
    @JsonBackReference
    private Visit visit;
    
    @Builder.Default
    @OneToMany(mappedBy = "vitalSigns", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
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
    
    @Transient
    private Float level1;
    
    @Transient
    private Float level2;
    
    @Transient
    private Float level3;
    
    @Transient
    private String wardCode;
    
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
    
    public Object getStayId() {
        return visit != null ? visit.getStayId() : null;
    }

    public Object getLabel() {
        return null;
    }
    
    public void setLabel(Long label) {
        // Implementation if needed
    }
}