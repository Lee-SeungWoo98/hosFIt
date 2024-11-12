package kr.spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // 이 부분이 있는지 확인
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}