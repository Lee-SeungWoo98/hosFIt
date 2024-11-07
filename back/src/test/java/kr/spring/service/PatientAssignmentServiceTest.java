package kr.spring.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.context.annotation.Import;

import kr.spring.Application; // 메인 애플리케이션 클래스
import kr.spring.config.ThresholdConfig; // 테스트 설정 클래스

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import java.util.Arrays;

@SpringBootTest(
    classes = Application.class,  // 메인 애플리케이션 클래스 지정
    properties = "spring.config.location=classpath:application-test.properties"
)
@AutoConfigureMockMvc
@Import(ThresholdConfig.class)  // 테스트 설정 클래스 import
public class PatientAssignmentServiceTest {

    @Autowired
    private MockMvc mockMvc;    // MockMvc 주입

    @MockBean
    private FlaskService flaskService;

    @MockBean
    private VitalSignsService vitalSignsService;

    @BeforeEach
    void setUp() {
        // 테스트용 데이터 설정
        when(flaskService.getPatientData(anyInt())).thenReturn(Arrays.asList(/* 테스트 데이터 */));
        when(vitalSignsService.getVitalSigns2ByStayId(anyLong())).thenReturn(Arrays.asList(/* 테스트 데이터 */));
    }

    @Test
    void testWardAssignmentEndpoint() throws Exception {
        // 테스트 데이터
        Long stayId = 1L;
        int subjectId = 100;

        // API 호출 및 검증
        mockMvc.perform(get("/ward-assignment/{stayId}/{subjectId}", stayId, subjectId))
               .andDo(print())  // 결과 출력
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.wardAssignment").exists());
    }


    @Test
    void testThresholdUpdateEndpoint() throws Exception {
        String newThresholds = "{"
                + "\"highHeartRate\": 110,"
                + "\"lowHeartRate\": 55,"
                + "\"highRespRate\": 22,"
                + "\"lowO2Sat\": 93,"
                + "\"highSBP\": 150,"
                + "\"lowSBP\": 85,"
                + "\"highTemp\": 38.5,"
                + "\"lowTemp\": 35.5"
                + "}";
            

        mockMvc.perform(put("/thresholds/vital-signs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newThresholds))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.highHeartRate").value(110));
    }
}