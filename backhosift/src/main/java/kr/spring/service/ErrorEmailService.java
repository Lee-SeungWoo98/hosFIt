// ErrorEmailService.java
package kr.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.env.Environment;

import kr.spring.dto.ErrorEmailRequestDTO;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.mail.internet.MimeMessage;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ErrorEmailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private Environment env;

    public void sendErrorEmail(ErrorEmailRequestDTO request) {
        try {
            log.info("Creating email message for error: {}", request.getErrorname());
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // 수신자 설정
            String recipientEmail = env.getProperty("error.email.recipient", "2024skyfordive2024@gmail.com");
            helper.setTo(recipientEmail);
            
            // 발신자 설정 
            String senderEmail = env.getProperty("spring.mail.username", "noreply@hosfit.com");
            helper.setFrom(senderEmail);

            helper.setSubject("[에러 로그] " + request.getErrorname());

            String emailContent = buildEmailContent(request);
            helper.setText(emailContent, true);

            log.info("Attempting to send email to: {}", recipientEmail);
            mailSender.send(message);
            log.info("Email sent successfully");
            
        } catch (Exception e) {
            log.error("Failed to send error email", e);
            throw new RuntimeException("이메일 전송 실패: " + e.getMessage());
        }
    }

    private String buildEmailContent(ErrorEmailRequestDTO request) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedDate = now.format(formatter);
        
        StringBuilder content = new StringBuilder();
        content.append("<html><body style='font-family: Arial, sans-serif;'>");
        
        // Header
        content.append("<div style='background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;'>");
        content.append("<h2 style='color: #dc3545; margin: 0;'>에러 로그 알림</h2>");
        content.append("<p style='color: #6c757d; margin: 10px 0 0 0;'>").append(formattedDate).append("</p>");
        content.append("</div>");

        // Error Details
        content.append("<div style='background-color: #fff; padding: 20px; border-radius: 5px; border: 1px solid #dee2e6;'>");
        
        // Basic Info
        content.append("<div style='margin-bottom: 20px;'>");
        content.append("<h3 style='color: #495057; margin: 0 0 10px 0;'>기본 정보</h3>");
        content.append("<p><strong>에러 ID:</strong> ").append(request.getId()).append("</p>");
        content.append("<p><strong>에러명:</strong> ").append(request.getErrorname()).append("</p>");
        content.append("<p><strong>심각도:</strong> ").append(request.getSeveritylevel()).append("</p>");
        content.append("<p><strong>에러 타입:</strong> ").append(request.getErrortype()).append("</p>");
        content.append("</div>");

        // Error Message and Stack Trace
        content.append("<div style='margin-bottom: 20px;'>");
        content.append("<h3 style='color: #495057; margin: 0 0 10px 0;'>에러 상세</h3>");
        content.append("<div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px;'>");
        content.append("<p><strong>에러 메시지:</strong></p>");
        content.append("<p style='color: #dc3545;'>").append(request.getErrormessage()).append("</p>");
        content.append("<p><strong>스택 트레이스:</strong></p>");
        content.append("<pre style='background-color: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto;'>");
        content.append(request.getErrorstack());
        content.append("</pre>");
        content.append("</div>");
        content.append("</div>");

        // Additional Info
        content.append("<div>");
        content.append("<h3 style='color: #495057; margin: 0 0 10px 0;'>추가 정보</h3>");
        content.append("<p><strong>URL:</strong> ").append(request.getUrl()).append("</p>");
        content.append("<p><strong>사용자 ID:</strong> ").append(request.getUserid()).append("</p>");
        content.append("<p><strong>브라우저:</strong> ").append(request.getBrowser()).append("</p>");
        content.append("</div>");

        content.append("</div>");
        content.append("</body></html>");
        
        return content.toString();
    }
}