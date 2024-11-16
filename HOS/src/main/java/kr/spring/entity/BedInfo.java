package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "bedinfo")
@Data
public class BedInfo {
    @Id
    @Column(name = "bednum")
    private Long bedNum;

    @Column(name = "roomnum")
    private Long roomNum;

    // Getters and Setters
}