package kr.spring.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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
import kr.spring.service.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;
    
   // @CrossOrigin
    @GetMapping("/list")
    public List<PatientDTO> getAllPatients() {
        System.out.println("[PatientController - getAllPatients] Calling PatientService to get all patients");
        return patientService.getAllPatients();
    }

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
    public List<Patient> getPatientsByStaystatus() {
        return patientService.getPatientsByStaystatus();
    }
    //tas값만 병상용조회 
    
    }
