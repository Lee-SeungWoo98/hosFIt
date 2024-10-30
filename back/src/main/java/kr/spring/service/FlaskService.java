package kr.spring.service;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.Visit;
import kr.spring.repository.AiTASRepository;
import kr.spring.repository.FlaskRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.web.client.RestTemplate;

@Service
public class FlaskService {
	@Autowired
	private  FlaskRepository flaskRepository;
	
	@Autowired
	private  AiTASRepository aiTASRepository;

    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String flaskAnalysisUrl = "http://localhost:5000/analyze";
    private final String flaskResultUrl = "http://localhost:5000/getResult";  // '/getResult' 엔드포인트가 Flask에 있는지 확인 필요

    // 분석 요청 메서드
    public void startAnalysis(String data) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<String> request = new HttpEntity<>(data, headers);

        // 플라스크에 분석 요청 전송
        restTemplate.postForEntity(flaskAnalysisUrl, request, String.class);
    }

    // 결과 요청 메서드
    public ResponseEntity<List<Double>> getAnalysisResult() {
        ResponseEntity<List<Double>> response = restTemplate.exchange(
            flaskResultUrl, HttpMethod.GET, null, new ParameterizedTypeReference<List<Double>>() {});
        return response;
}
    
    public FlaskService(FlaskRepository flaskRepository) {
        this.flaskRepository = flaskRepository;
    }

    public List<FlaDTO> getPatientData(int subjectId) {
        return flaskRepository.getPatientData(subjectId);
    }

	public AiTAS getAiTAS(Long stayId) {
		// TODO Auto-generated method stub
		return aiTASRepository.findByStayId(stayId);
	}

	public List<AiTAS> getAiTASAll() {
		// TODO Auto-generated method stub
		return aiTASRepository.findAll();
	}
}