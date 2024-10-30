package kr.spring.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.dto.PatientDTO;
import kr.spring.entity.Patient;
import kr.spring.entity.Visit;
import kr.spring.entity.VitalSigns;
import kr.spring.service.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;
    
   // @CrossOrigin
    //환자리스트
    @GetMapping("/list")
    public Page<PatientDTO> getAllPatients(@RequestParam(defaultValue = "0") int page) {
        System.out.println("[PatientController - getAllPatients] Fetching page: " + page);
        return patientService.getAllPatients(page);
    }
    //환자검색 
    @GetMapping("/search")
    public @ResponseBody List<PatientDTO> getPatients(@RequestParam(required = false) String name) {
        System.out.println("[PatientController - getPatients] Calling PatientService to search patients with name: " + name);
        return patientService.getPatients(name);
    }

    // 환자 상세조회 + 이전 기록들
    @GetMapping("/{subjectId}/visits")
    public ResponseEntity<Patient> getPatientWithVisits(@PathVariable Long subjectId) {
        Patient patient = patientService.getPatientWithVisits(subjectId);
        return ResponseEntity.ok(patient);
    }
    // 특정tas만 조회 
    @GetMapping("/byTAS")
    public List<Patient> getPatientsByTAS(@RequestParam("tas") Long tas) {
        System.out.println("[PatientController - getPatientsByTAS] TAS level: " + tas);
        return patientService.getPatientsByTAS(tas);
    }
    // 전체tas조회
    @GetMapping("/byStaystatus")
    public Map<String, Object> getPatientsByStaystatus(@RequestParam int page) { // page 파라미터를 추가
        return patientService.getPatientsByStaystatus(page); // page 전달
    }
    // 환자 생체 데이터
    @GetMapping("/{stayId}/vitalsigns")
    public List<VitalSigns> getPatientVitalSigns(@PathVariable Long stayId){
    	return patientService.getVitalSigns(stayId);
           }
    //tas값만 병상용조회 
    @GetMapping("/bybed")
    public ResponseEntity<Map<Integer, Long>> getPatientsByTas() {
        System.out.println("[PatientController - getPatientsByTas] Fetching TAS count");
        Map<Integer, Long> result = patientService.getPatientsByTas();
        
        // 결과를 확인하여 응답을 반환
        if (result.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(result);
        }
    
      
        
   
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}