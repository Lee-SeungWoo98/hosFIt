package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Table(name = "bloodlevels")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodLevels {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;
    
    @OneToOne  // ManyToOne에서 OneToOne으로 변경
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private LabTest labTest;
    
    @Column(name = "hemoglobin")
    private Long hemoglobin;  // String에서 Long으로 변경
    
    @Column(name = "plateletcount")
    private Long plateletCount;
    
    @Column(name = "wbc")
    private Long wbc;  // String에서 Long으로 변경
    
    @Column(name = "rbc")
    private Long rbc;  // String에서 Long으로 변경
    
    @Column(name = "sedimentationrate")
    private Long sedimentationRate;
    
    @Column(name = "regdate")
    private LocalDateTime regDate;
}
