package kr.spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

public class ResultController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/getAnalysisResult")
    public ResponseEntity<String> getAnalysisResult() {
        // 플라스크 서버의 결과 요청 URL 설정
        String flaskResultUrl = "http://localhost:5000/getResult";

        // 플라스크 서버에서 분석 결과를 요청하고 JSON 형식으로 받음
        ResponseEntity<String> response = restTemplate.getForEntity(flaskResultUrl, String.class);

        // 받은 결과를 반환
        return response;
    }
}