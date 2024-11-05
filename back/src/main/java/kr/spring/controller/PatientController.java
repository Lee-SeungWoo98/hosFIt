package kr.spring.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.dto.PatientDTO;
import kr.spring.entity.Patient;
import kr.spring.entity.VitalSigns;
import kr.spring.service.PatientService;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/patients")
@Slf4j
public class PatientController {

    private final PatientService patientService;
    
    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // 1. 환자 목록 조회 (페이징 + 필터링)
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getPatientsList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long gender,
            @RequestParam(required = false) Long tas,
            @RequestParam(required = false) Long pain) {
        
        log.info("Fetching patients list with filters: name={}, gender={}, TAS={}, pain={}, page={}", 
                name, gender, tas, pain, page);
        
        Map<String, Object> result = patientService.getPatientsByStaystatus(page, name, gender, tas, pain);
        return ResponseEntity.ok(result);
    }

    // 2. 환자 검색 (이름으로)
    @GetMapping("/search")
    public ResponseEntity<List<PatientDTO>> searchPatients(
            @RequestParam(required = false) String name) {
        
        log.info("Searching patients with name: {}", name);
        List<PatientDTO> patients = patientService.getPatients(name);
        return ResponseEntity.ok(patients);
    }

    // 3. 환자 상세 정보 조회 (방문 기록 포함)
    @GetMapping("/{subjectId}/details")
    public ResponseEntity<PatientDTO> getPatientDetails(
            @PathVariable Long subjectId,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        log.info("Fetching patient details for subjectId: {} with sortDirection: {}", 
                subjectId, sortDirection);
        
        PatientDTO patientData = patientService.getPatientWithSortedVisits(subjectId, sortDirection);
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
}