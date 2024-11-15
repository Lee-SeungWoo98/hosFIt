package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "system_thresholds")
@Getter
@Setter
public class ThresholdEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String thresholdKey;
    private Float thresholdValue;
    private String description;
    
    @Column(name = "lastmodifieddate")
    private LocalDateTime lastModifiedDate;
    
    @Column(name = "lastmodifiedby")
    private String lastModifiedBy;
}