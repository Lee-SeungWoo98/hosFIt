package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "bedinfo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BedInfo {
    @Id
    @Column(name = "bednum")
    private Long bedNum;

    @Column(name = "roomnum")
    private Long roomNum;
    
    @Column(name = "total_beds")
    private Integer totalBeds;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @Column(name = "last_updated_by")
    private String lastUpdatedBy;
}