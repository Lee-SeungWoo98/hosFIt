package kr.spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
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

    @GetMapping("/list")
    public @ResponseBody List<Patient> getAllPatients() {
        System.out.println("[PatientController - getAllPatients] Calling PatientService to get all patients");
        return patientService.getAllPatients();
    }

    @GetMapping("/search")
    public @ResponseBody List<Patient> getPatients(@RequestParam(required = false) String name) {
        System.out.println("[PatientController - getPatients] Calling PatientService to search patients with name: " + name);
        return patientService.getPatients(name);
    }

    // 환자 상세조회 + 이전 기록들
    @GetMapping("/details")
    public @ResponseBody List<Visit> getMedicalRecord(@RequestParam Long subjectId) {
        System.out.println("[PatientController - getMedicalRecord] Calling PatientService to get visits for subjectId: " + subjectId);
        Visit visits = patientService.getVisitsRecordBySubjectId(subjectId);
        System.out.println("[PatientController - getMedicalRecord] Result: " + visits);
        return visits;
    }
    
    ///새로운 글을 추가해봤습니다 하니가 뉴진스에서 제일 잘 하니?
}
