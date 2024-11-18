package kr.spring.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.spring.entity.VitalSignsMessage;
import kr.spring.service.VitalSignsService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ServerEndpoint("/ws")
@Component
@Controller
public class F5Controller {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final VitalSignsService vitalSignsService;  // 서비스 추가

    // 생성자 주입
    public F5Controller(SimpMessagingTemplate messagingTemplate, 
                       VitalSignsService vitalSignsService) {
        this.messagingTemplate = messagingTemplate;
        this.vitalSignsService = vitalSignsService;
    }

    @Scheduled(fixedRate = 10000)  // 10초마다 실행
    public void sendVitalSigns() {
        try {
            // 테스트용 더미 데이터 생성
            Map<String, String> vitalSigns = new HashMap<>();
            vitalSigns.put("heartRate", "75");
            vitalSigns.put("bloodPressure", "120/80");
            vitalSigns.put("temperature", "36.5");
            vitalSigns.put("oxygenSaturation", "98");

            // 실제 데이터를 사용하려면 아래 코드 사용
            // VitalSigns vitalSigns = vitalSignsService.getLatestVitalSigns();
            
            // WebSocket으로 데이터 전송
            messagingTemplate.convertAndSend("/topic/vital-signs", vitalSigns);
            
        } catch (Exception e) {
            log.error("Error sending vital signs", e);
        }
    }

    // WebSocket 연결 테스트용 엔드포인트
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public String greeting(String message) {
        return "Server received: " + message;
    }
}