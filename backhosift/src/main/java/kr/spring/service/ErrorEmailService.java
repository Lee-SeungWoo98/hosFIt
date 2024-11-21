package kr.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import kr.spring.dto.ErrorEmailRequestDTO;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import javax.mail.internet.MimeMessage;

@Service
public class ErrorEmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendErrorEmail(ErrorEmailRequestDTO request) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo("2024skyfordive2024@gmail.com");
            helper.setSubject("[에러 로그] " + request.getErrorname());

            String emailContent = buildEmailContent(request);
            helper.setText(emailContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("이메일 전송 실패: " + e.getMessage());
        }
    }

    private String buildEmailContent(ErrorEmailRequestDTO request) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-H-m-s");
        String formattedDate = now.format(formatter);
        
        StringBuilder content = new StringBuilder();
        content.append("<html><body style='font-family: Arial, sans-serif;'>");
        
        // 제목
        content.append("<h2 style='color: #e74c3c;'>에러 로그 상세 정보</h2>");
        
        // 기본 정보 섹션
        content.append("<div style='background-color: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 5px;'>");
        content.append("<h3>기본 정보</h3>");
        content.append("<ul style='list-style-type: none; padding-left: 0;'>");
        content.append("<li>Log ID: ").append(request.getId()).append("</li>");
        content.append("<li>발생시각: ").append(formattedDate).append("</li>");
        content.append("<li>에러명: ").append(request.getErrorname()).append("</li>");
        content.append("<li>심각도: ").append(request.getSeveritylevel()).append("</li>");
        content.append("</ul>");
        content.append("</div>");

        // 에러 상세 섹션
        content.append("<div style='background-color: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 5px;'>");
        content.append("<h3>에러 상세</h3>");
        content.append("<ul style='list-style-type: none; padding-left: 0;'>");
        content.append("<li>타입: ").append(request.getErrortype()).append("</li>");
        content.append("<li>메시지: ").append(request.getErrormessage()).append("</li>");
        content.append("<li>URL: ").append(request.getUrl()).append("</li>");
        content.append("</ul>");
        content.append("</div>");

        // 사용자 정보 섹션
        content.append("<div style='background-color: #f8f9fa; padding: 15px; margin-bottom: 20px; border-radius: 5px;'>");
        content.append("<h3>사용자 정보</h3>");
        content.append("<ul style='list-style-type: none; padding-left: 0;'>");
        content.append("<li>사용자 ID: ").append(request.getUserid()).append("</li>");
        content.append("<li>브라우저: ").append(request.getBrowser()).append("</li>");
        content.append("</ul>");
        content.append("</div>");

        // 스택 트레이스
        content.append("<div style='background-color: #f8f9fa; padding: 15px; border-radius: 5px;'>");
        content.append("<h3>스택 트레이스</h3>");
        content.append("<pre style='background-color: #ffffff; padding: 10px; border-radius: 3px; overflow-x: auto;'>");
        content.append(request.getErrorstack());
        content.append("</pre>");
        content.append("</div>");

        content.append("</body></html>");
        return content.toString();
    }
}