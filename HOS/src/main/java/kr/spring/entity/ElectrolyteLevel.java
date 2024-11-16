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
@Table(name = "electrolytelevel")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElectrolyteLevel {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;
    
    @OneToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private LabTest labTest;
    
    @Column(name = "sodium")
    private Long sodium;
    
    @Column(name = "potassium")
    private Long potassium;  // String에서 Long으로 변경
    
    @Column(name = "chloride")
    private Long chloride;
    
    @Column(name = "regdate")
    private LocalDateTime regDate;
}