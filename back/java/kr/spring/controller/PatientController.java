package kr.spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

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
    public List<Patient> getAllPatients() {
        System.out.println("[PatientController - getAllPatients] Calling PatientService to get all patients");
        System.out.println(patientService.getAllPatients().toString());
        return patientService.getAllPatients();
    }

    @GetMapping("/search")
    public @ResponseBody List<Patient> getPatients(@RequestParam(required = false) String name) {
        System.out.println("[PatientController - getPatients] Calling PatientService to search patients with name: " + name);
        return patientService.getPatients(name);
        
        
    }

    // 환자 상세조회 + 이전 기록들
    @GetMapping("/{subjectId}/visits")
    public ResponseEntity<Patient> getPatientWithVisits(@PathVariable Long subjectId) {
        Patient patient = patientService.getPatientWithVisits(subjectId);
        return ResponseEntity.ok(patient);
    }
}