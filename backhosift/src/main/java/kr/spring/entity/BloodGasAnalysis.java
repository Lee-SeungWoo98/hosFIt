package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "bloodgasanalysis")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodGasAnalysis {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;
    
    @Column(name = "pCO2")
    private Long pCO2;  // String에서 Long으로 변경
    
    @Column(name = "pH")
    private Long pH;    // String에서 Long으로 변경
    
    @Column(name = "pO2")
    private Long pO2;   // String에서 Long으로 변경
    
    @Column(name = "regdate")
    private LocalDateTime regDate;
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private LabTest labTest;
}