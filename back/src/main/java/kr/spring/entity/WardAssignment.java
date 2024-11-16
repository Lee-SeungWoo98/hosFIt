package kr.spring.entity;

import java.time.LocalDateTime;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "WardAssignment")
public class WardAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "stayid", nullable = false)
    private Visit visit;
    
    private LocalDateTime assignmentDateTime;
    
    private Float level1;
    private Float level2;
    private Float level3;
    
    @Column(nullable = false)
    private String wardCode;
    
    @Column(name = "chartnum", nullable = false)
    private String chartNum;

    public Long getStayId() {
        return visit != null ? visit.getStayId() : null;
    }
}
