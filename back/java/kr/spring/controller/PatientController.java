// PatientController.java
package kr.spring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.entity.MedicalRecord;
import kr.spring.entity.Patient;
import kr.spring.service.PatientService;

@RestController
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/PatientList")
    public @ResponseBody List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/searchPatients")
    public @ResponseBody List<Patient> getPatients(@RequestParam(required = false) String name) {
        return patientService.getPatients(name);
    }

    @GetMapping("/selectPatient")
    public @ResponseBody Map<String, Object> selectPatient(@RequestParam Long patientid) {
        // 환자 정보를 조회
        Patient patient = patientService.getPatientById(patientid);

        // 환자의 이전 기록을 조회
        

        // 결과를 Map으로 반환하여 JSON 형태로 전송
        Map<String, Object> response = new HashMap<>();
        response.put("patient", patient);
        

        return response;
    }
}