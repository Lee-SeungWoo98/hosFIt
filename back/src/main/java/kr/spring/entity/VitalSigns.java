package kr.spring.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
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

    // getAiTAS 메소드 수정
    public Set<AiTAS> getAiTAS() {
        return this.aiTAS;
    }
}