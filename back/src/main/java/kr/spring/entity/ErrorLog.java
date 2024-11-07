package kr.spring.entity;


import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "errorlogs")
public class ErrorLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "bigint")
    private Long id;
    
    
    
    @Column(name = "errorname", length = 200, nullable = true)
    private String errorname;
    
    @Column(name = "errormessage", columnDefinition = "text", nullable = true)
    private String errormessage;
    
    @Column(name = "errorstack", columnDefinition = "text", nullable = true)
    private String errorstack;
    
    @Column(name = "errortype", length = 50, nullable = true)
    private String errortype;
    
    @Column(name = "severitylevel", length = 20, nullable = true)
    private String severitylevel;
    
    @Column(name = "url", length = 500, nullable = true)
    private String url;
    
    @Column(name = "userid", length = 100, nullable = true)
    private String userid;
    
    @Column(name = "browser", length = 100, nullable = true)
    private String browser;
    
    @Column(name = "createdat", columnDefinition = "timestamp", nullable = true)
    private LocalDateTime createdat;
    
    @Column(name = "isresolved", columnDefinition = "tinyint", nullable = true)
    private Boolean isresolved;
}
