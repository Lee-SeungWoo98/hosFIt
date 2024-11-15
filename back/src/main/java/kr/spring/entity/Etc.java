package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "etc")
public class Etc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "PT")
    private String PT;

    @Column(name = "PTT")
    private String PTT;

    @Column(name = "troponint")
    private String troponinT;

    @Column(name = "ureanitrogen")
    private Long ureaNitrogen;

    // Getters and Setters
}