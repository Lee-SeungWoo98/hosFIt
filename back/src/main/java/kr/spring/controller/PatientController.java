package kr.spring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.entity.MedicalRecord;
import kr.spring.entity.Member;
import kr.spring.entity.Patient;

import kr.spring.service.MemberService;
import kr.spring.service.PatientService;

@RestController
public class PatientController {
	
	    @Autowired
	    private PatientService service;

	    
//	    @GetMapping("/PatientList")
//	    public @ResponseBody List<Patient> memberList() {
//	    	
//	        return service.getAllPatients();
//	    }
//	    
//	    
//	    @GetMapping("/searchPatients")
//	    public @ResponseBody List<Patient> getPatients(@RequestParam(required = false) String name) {
//	        List<Patient> patients = service.getPatients(name);
//	        System.out.println(patients.toString());
//	        return patients;
//	    }
//	    
//	    @GetMapping("/selectPatient")
//	    public @ResponseBody Map<String, Object> selectPatient(@RequestParam Long subject_id) {
//	        // 환자 정보를 조회
//	        Patient patient = service.getPatientBySubject_id(subject_id);
//
//	        // 환자의 이전 기록을 조회
//	        List<MedicalRecord> records = service.getPatientRecords(subject_id);
//
//	        // 결과를 Map으로 반환하여 JSON 형태로 전송
//	        Map<String, Object> response = new HashMap<>();
//	        response.put("patient", patient);
//	        response.put("medicalRecords", records);
//
//	        return response;
//	    }
//	    
	    @GetMapping("/subject-ids")
	    public List<Patient> getSubjectIds() {
	        // subject_id 리스트 반환
	    	List<Patient> test =  service.getAllSubjectIds();
	    	System.out.println(test.size());
	    	
	        return test;
	    }
	}
	


