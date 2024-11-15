package kr.spring.dto;



import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorDTO {
    private Long id;
    private String errorname;
    private String errormessage;
    private String errorstack;
    private String errortype;
    private String severitylevel;
    private String url;
    private String userid;
    private String browser;
    private LocalDateTime createdat;
    private Boolean isresolved;
}
