package kr.spring.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.spring.dto.FlaDTO;

public class JsonTest {
    public static void main(String[] args) throws Exception {
        // FlaDTO 객체 생성 (테스트 데이터를 사용)
        FlaDTO testData = new FlaDTO(
            80, 16, 100, 118, 71, 36.6f,
            30, 4.5f, 100, 50, 120, 25,
            0.5f, 22, 1.2f, 0.3f, 9.5f,
            24, 104, 100, 10, 0.9f, 300,
            35, 120, 13.5f, 1, 1.5f, 180,
            40, 2.1f, 100, 42, 7.36f, 250,
            4.2f, 4.5f, 20, 140, 52,
            0, 7.8f, 40, 7.35f, 95,
            0, 66, 13, 3, 5, 1
        );

        // ObjectMapper로 JSON 변환
        ObjectMapper mapper = new ObjectMapper();
        
        // JSON 문자열로 변환 후 출력
        String jsonResult = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(testData);
        
        System.out.println("JSON Output:\n" + jsonResult);
    }
}