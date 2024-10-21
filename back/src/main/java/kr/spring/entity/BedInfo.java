package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "bedinfo")
public class BedInfo {
    @Id
    @Column(name = "bednum")
    private Long bedNum;

    @Column(name = "roomnum")
    private Long roomNum;

    // Getters and Setters
}