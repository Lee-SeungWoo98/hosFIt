package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "member")
public class Member {
    @Id
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name")
    private String name;
    
    @Column(name = "position")
    private String position;
    
    @Column(name = "department")
    private String department;
    
    @Column(name = "major")
    private String major;
    
}
