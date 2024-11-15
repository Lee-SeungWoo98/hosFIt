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

import kr.spring.Application;
import kr.spring.config.ThresholdConfig;
import kr.spring.entity.AiTAS;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.AiTASRepository;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.anyString;

import java.util.Optional;

@SpringBootTest(
		   classes = Application.class,
		   properties = "spring.config.location=classpath:application-test.properties"
		)
		@AutoConfigureMockMvc
		@Import(ThresholdConfig.class)
		public class PatientAssignmentServiceTest {
		   @Autowired
		   private MockMvc mockMvc;
		   
		   @MockBean
		   private FlaskService flaskService;
		   
		   @MockBean
		   private VitalSignsService vitalSignsService;
		   
		   @MockBean
		   private AiTASRepository aiTASRepository;
		   
		   @MockBean
		   private PatientAssignmentService assignmentService;
		   
		   @BeforeEach
		   void setUp() {
		       // VitalSigns mock 데이터 생성
		       VitalSigns mockVitalSigns = new VitalSigns();
		       mockVitalSigns.setChartNum("TEST123");

		       // AiTAS mock 데이터 설정
		       AiTAS mockAiTAS = new AiTAS();
		       mockAiTAS.setVitalSigns(mockVitalSigns);
		       mockAiTAS.setLevel1(0.70f);
		       mockAiTAS.setLevel2(0.20f);
		       mockAiTAS.setLevel3(0.10f);
		       
		       // findFirstByVitalSigns_ChartNum 메서드 mock 동작 설정
		       when(aiTASRepository.findFirstByVitalSigns_ChartNum(anyString()))
		           .thenReturn(Optional.of(mockAiTAS));
		           
		       // determineWardByAiTAS 메서드가 chartNum만 받도록 설정
		       when(assignmentService.determineWardByAiTAS(anyString()))
		           .thenReturn("CRITICAL_CARE");
		   }

		   @Test
		   void testWardAssignmentEndpoint() throws Exception {
		       Long stayId = 1L;
		       int subjectId = 100;
		       String chartNum = "TEST123";
		       
		       mockMvc.perform(get("/ward-assignment/{stayId}/{subjectId}/{chartNum}", 
		                          stayId, subjectId, chartNum)
		                  .accept(MediaType.APPLICATION_JSON))
		                  .andDo(print())
		                  .andExpect(status().isOk())
		                  .andExpect(jsonPath("$.wardAssignment").value("CRITICAL_CARE"));
		   }

		   @Test
		   void testThresholdUpdateEndpoint() throws Exception {
		       String newThresholds = "{"
		               + "\"criticalCareThreshold\": 0.7,"
		               + "\"intermediateCareThreshold\": 0.5,"
		               + "\"generalWardThreshold\": 0.3"
		               + "}";
		       
		       mockMvc.perform(put("/thresholds/aitas")
		               .contentType(MediaType.APPLICATION_JSON)
		               .accept(MediaType.APPLICATION_JSON)
		               .content(newThresholds))
		              .andDo(print())
		              .andExpect(status().isOk())
		              .andExpect(jsonPath("$.criticalCareThreshold").value(0.7))
		              .andExpect(jsonPath("$.intermediateCareThreshold").value(0.5))
		              .andExpect(jsonPath("$.generalWardThreshold").value(0.3));
		   }
		}
