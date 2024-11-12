package kr.spring.dto;

import lombok.Data;

@Data
public class ErrorEmailRequestDTO {
    private Long logId;
    private String errorName;
    private String errorType;
    private String severity;
    private String message;
    private String stackTrace;
    private String url;
    private String userId;
    private String browser;
    private String createdAt;
    private String recipientEmail;
}