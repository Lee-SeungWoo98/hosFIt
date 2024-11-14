package kr.spring.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.dto.PatientDTO;
import kr.spring.dto.VisitDTO;
import kr.spring.dto.VitalSignsDTO;
import kr.spring.entity.AiTAS;
import kr.spring.entity.Patient;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.AiTASRepository;
import kr.spring.service.PatientAssignmentService;
import kr.spring.service.PatientService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/patients")
@Slf4j
public class PatientController {
      private final PatientService patientService;
      private final PatientAssignmentService patientAssignmentService;
      private final AiTASRepository aiTASRepository;
      
      @Autowired
      public PatientController(
              PatientService patientService,
              PatientAssignmentService patientAssignmentService,
              AiTASRepository aiTASRepository) {
          this.patientService = patientService;
          this.patientAssignmentService = patientAssignmentService;
          this.aiTASRepository = aiTASRepository;
      }

    // 1. 환자 목록 조회 (페이징 + 필터링)
      @GetMapping("/list")
      public ResponseEntity<Map<String, Object>> getPatientsList(
              @RequestParam(defaultValue = "0") int page,
              @RequestParam(required = false) String name,
              @RequestParam(required = false) Long gender,
              @RequestParam(required = false) Long tas,
              @RequestParam(required = false) Long pain,
              @RequestParam(required = false) String maxLevel) {
          
          log.info("Fetching patients list with filters: name={}, gender={}, TAS={}, pain={}, maxLevel={}, page={}", 
                  name, gender, tas, pain, maxLevel, page);
          
          Map<String, Object> result = patientService.getPatientsByStaystatus(page, name, gender, tas, pain, maxLevel);
          
          // 중복 제거: patients 리스트에서 subjectId 기준으로 중복 제거
          List<PatientDTO> patients = ((List<PatientDTO>) result.get("patients"))
              .stream()
              .filter(Objects::nonNull)
              .collect(Collectors.collectingAndThen(
                  Collectors.toMap(
                      PatientDTO::getSubjectId,  // 키로 사용할 필드
                      Function.identity(),        // 값으로 사용할 객체
                      (existing, replacement) -> existing  // 중복 시 기존 것 유지
                  ),
                  map -> new ArrayList<>(map.values())
              ));
          
          result.put("patients", patients);
          return ResponseEntity.ok(result);}

    // 2. 환자 검색 (이름으로)
    @GetMapping("/search")
    public ResponseEntity<List<PatientDTO>> searchPatients(
            @RequestParam(required = false) String name) {
        
        log.info("Searching patients with name: {}", name);
        List<PatientDTO> patients = patientService.getPatients(name);
        return ResponseEntity.ok(patients);
    }

    // 3. 환자 상세 정보 조회 (방문 기록과 ward 배정 정보 포함)
    @GetMapping("/{subjectId}/details")
    public ResponseEntity<PatientDTO> getPatientDetails(
            @PathVariable Long subjectId,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        log.info("Fetching patient details for subjectId: {} with sortDirection: {}", 
                subjectId, sortDirection);
        
        PatientDTO patientData = patientService.getPatientWithVisitsAndVitals(subjectId);
        
        // Ward 배정 정보 추가
        if (patientData.getVisits() != null) {
            for (VisitDTO visit : patientData.getVisits()) {
                if (visit.getVitalSigns() != null) {
                    for (VitalSignsDTO vital : visit.getVitalSigns()) {
                        try {
                            String wardCode = patientAssignmentService.determineWardByAiTAS(vital.getChartNum());
                            if (wardCode != null) {
                                vital.setWardCode(wardCode);
                                Map<String, Object> wardAssignment = new HashMap<>();
                                wardAssignment.put("wardCode", wardCode);
                                
                                Optional<AiTAS> aiTAS = aiTASRepository.findFirstByVitalSigns_ChartNum(vital.getChartNum());
                                if (aiTAS.isPresent()) {
                                    wardAssignment.put("level1", aiTAS.get().getLevel1());
                                    wardAssignment.put("level2", aiTAS.get().getLevel2());
                                    wardAssignment.put("level3", aiTAS.get().getLevel3());
                                }
                                
                                visit.setWardAssignment(wardAssignment);
                            }
                        } catch (Exception e) {
                            log.warn("Failed to get ward assignment for chartNum: {}", vital.getChartNum());
                        }
                    }
                }
            }
        }
        
        return ResponseEntity.ok(patientData);
    }
    // 4. 환자 생체 데이터 조회
    @GetMapping("/{stayId}/vitals")
    public ResponseEntity<List<VitalSigns>> getPatientVitals(
            @PathVariable Long stayId) {
        
        log.info("Fetching vital signs for stayId: {}", stayId);
        List<VitalSigns> vitalSigns = patientService.getVitalSigns(stayId);
        return ResponseEntity.ok(vitalSigns);
    }

    // 5. TAS 통계 조회 (병상용)
    @GetMapping("/statistics/tas")
    public ResponseEntity<Map<Integer, Long>> getTasStatistics() {
        log.info("Fetching TAS statistics");
        Map<Integer, Long> tasStats = patientService.getPatientsByTas();
        
        return tasStats.isEmpty() 
            ? ResponseEntity.noContent().build() 
            : ResponseEntity.ok(tasStats);
    }

    // 6. 특정 TAS 환자 조회
    @GetMapping("/tas/{tasLevel}")
    public ResponseEntity<List<Patient>> getPatientsByTasLevel(
            @PathVariable("tasLevel") Long tas) {
        
        log.info("Fetching patients with TAS level: {}", tas);
        List<Patient> patients = patientService.getPatientsByTas(tas);
        return ResponseEntity.ok(patients);
    }

    // 7. Ward 배정 실행 (새로 추가)
    @PostMapping("/{chartNum}/assign-ward")
    public ResponseEntity<String> assignWard(@PathVariable String chartNum) {
        try {
            String wardCode = patientAssignmentService.determineWardByAiTAS(chartNum);
            return ResponseEntity.ok(wardCode);
        } catch (Exception e) {
            log.error("Error assigning ward for chartNum: {}", chartNum, e);
            return ResponseEntity.internalServerError().body("Ward 배정 중 오류가 발생했습니다.");
        }
    }
}