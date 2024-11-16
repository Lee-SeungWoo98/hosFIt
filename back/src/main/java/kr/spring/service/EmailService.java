package kr.spring.service;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import kr.spring.dto.ErrorEmailRequestDTO;


@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void sendErrorNotification(ErrorEmailRequestDTO request) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(request.getRecipientEmail());
        helper.setSubject("[Error Log] " + request.getErrorName());
        
        String content = createEmailContent(request);
        helper.setText(content, true);

        mailSender.send(message);
    }

    private String createEmailContent(ErrorEmailRequestDTO request) {
        StringBuilder content = new StringBuilder();
        content.append("<html>")
               .append("<body style=\"font-family: Arial, sans-serif; padding: 20px;\">")
               .append("<h2 style=\"color: #d32f2f;\">에러 로그 상세 정보</h2>")
               .append("<h3 style=\"color: #333;\">기본 정보</h3>")
               .append("<ul>")
               .append("<li>Log ID: ").append(request.getLogId() != null ? request.getLogId() : "N/A").append("</li>")
               .append("<li>발생시각: ").append(request.getCreatedAt() != null ? request.getCreatedAt() : "N/A").append("</li>")
               .append("<li>에러명: ").append(request.getErrorName() != null ? request.getErrorName() : "N/A").append("</li>")
               .append("<li>심각도: ").append(request.getSeverity() != null ? request.getSeverity() : "N/A").append("</li>")
               .append("</ul>")
               .append("<h3 style=\"color: #333;\">에러 상세</h3>")
               .append("<ul>")
               .append("<li>타입: ").append(request.getErrorType() != null ? request.getErrorType() : "N/A").append("</li>")
               .append("<li>메시지: ").append(request.getMessage() != null ? request.getMessage() : "N/A").append("</li>")
               .append("<li>URL: ").append(request.getUrl() != null ? request.getUrl() : "N/A").append("</li>")
               .append("</ul>")
               .append("<h3 style=\"color: #333;\">사용자 정보</h3>")
               .append("<ul>")
               .append("<li>사용자 ID: ").append(request.getUserId() != null ? request.getUserId() : "N/A").append("</li>")
               .append("<li>브라우저: ").append(request.getBrowser() != null ? request.getBrowser() : "N/A").append("</li>")
               .append("</ul>")
               .append("<div style=\"background-color: #f5f5f5; padding: 15px; margin-top: 20px; border-radius: 5px;\">")
               .append("<h3 style=\"color: #333; margin-top: 0;\">스택 트레이스</h3>")
               .append("<pre style=\"overflow-x: auto; white-space: pre-wrap;\">")
               .append(request.getStackTrace() != null ? request.getStackTrace() : "스택 트레이스 없음")
               .append("</pre>")
               .append("</div>")
               .append("</body>")
               .append("</html>");
        
        return content.toString();
    }
}