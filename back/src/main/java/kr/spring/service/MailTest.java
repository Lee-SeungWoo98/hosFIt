package kr.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.mail.internet.MimeMessage;

@SpringBootApplication
@Component
public class MailTest {

    @Autowired
    private JavaMailSender mailSender;

    public void sendTestEmail() throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo("2024skyfordive2024@gmail.com");
        helper.setSubject("SMTP 테스트 메일");
        helper.setText("이것은 SMTP 설정 테스트를 위한 이메일입니다.", true);

        mailSender.send(message);
        System.out.println("테스트 메일이 성공적으로 전송되었습니다.");
    }

    public static void main(String[] args) {
        // Spring Application Context를 로드하여 Bean을 사용할 수 있도록 함
        SpringApplication.run(MailTest.class, args)
                .getBean(MailTest.class)
                .runTest();
    }

    public void runTest() {
        try {
            sendTestEmail();
        } catch (Exception e) {
            System.err.println("테스트 메일 전송에 실패했습니다: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
