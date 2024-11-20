package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.*;

import lombok.*;

@Entity
@Table(name = "bedinfo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BedInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bednum")
    private Long bedNum;

    @Column(name = "roomnum")
    private Long roomNum;

    @Column(name = "total_beds", nullable = false)
    private Integer totalBeds;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @Column(name = "last_updated_by")
    private String lastUpdatedBy;
}
