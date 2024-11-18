package kr.spring.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.config.SchedulingConfig;
import kr.spring.entity.Patient;
import kr.spring.entity.Visit;
import kr.spring.repository.PatientRepository;
import kr.spring.service.RandomDataGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/generator")
@RequiredArgsConstructor
public class DataGeneratorController {
    @Autowired
    private PatientRepository patientRepository;
    private final RandomDataGeneratorService generatorService;
    private final SchedulingConfig schedulingConfig;
    
    @PostMapping("/generate-data")
    public ResponseEntity<?> generateData() {
        try {
            generatorService.generateCompletePatientData();
            return ResponseEntity.ok("Random patient data generated successfully");
        } catch (Exception e) {
            log.error("Error generating random data: ", e);
            return ResponseEntity.internalServerError()
                .body("Error generating data: " + e.getMessage());
        }
    }
    
    @PostMapping("/generate-multiple/{count}")
    public ResponseEntity<?> generateMultipleData(@PathVariable int count) {
        try {
            for (int i = 0; i < count; i++) {
                generatorService.generateCompletePatientData();
            }
            return ResponseEntity.ok("Generated " + count + " sets of random patient data");
        } catch (Exception e) {
            log.error("Error generating multiple random data: ", e);
            return ResponseEntity.internalServerError()
                .body("Error generating multiple data: " + e.getMessage());
        }
    }
    
    @PostMapping("/generate-patient")
    public ResponseEntity<?> generatePatientOnly() {
        try {
            return ResponseEntity.ok(generatorService.generateRandomPatient());
        } catch (Exception e) {
            log.error("Error generating random patient: ", e);
            return ResponseEntity.internalServerError()
                .body("Error generating patient: " + e.getMessage());
        }
    }
    
    @PostMapping("/generate-visit/{subjectId}")
    public ResponseEntity<?> generateVisitForPatient(@PathVariable Long subjectId) {
        try {
            Patient patient = patientRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + subjectId));
            
            Visit visit = generatorService.generateRandomVisit(patient);
            
            return ResponseEntity.ok(visit);
        } catch (Exception e) {
            log.error("Error generating random visit: ", e);
            return ResponseEntity.internalServerError()
                .body("Error generating visit: " + e.getMessage());
        }
    }
    
    @PostMapping("/generate-and-process/{count}")
    public ResponseEntity<?> generateAndProcessData(@PathVariable int count) {
        try {
            List<String> processedChartNums = generatorService.generateAndProcessCompleteData(count);
            Map<String, Object> response = new HashMap<>();
            response.put("message", String.format("Successfully processed %d patient records", count));
            response.put("processedChartNums", processedChartNums);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error in generate and process flow: ", e);
            return ResponseEntity.internalServerError()
                .body("Error in processing: " + e.getMessage());
        }
    }

    @GetMapping("/scheduler/status")
    public ResponseEntity<Map<String, Object>> getSchedulerStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("running", schedulingConfig.isSchedulerRunning());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/scheduler/toggle")
    public ResponseEntity<Map<String, Object>> toggleScheduler() {
        boolean isRunning = schedulingConfig.toggleScheduler();
        Map<String, Object> response = new HashMap<>();
        response.put("running", isRunning);
        response.put("message", isRunning ? "Scheduler started" : "Scheduler stopped");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/scheduler/start")
    public ResponseEntity<Map<String, Object>> startScheduler() {
        schedulingConfig.startScheduler();
        Map<String, Object> response = new HashMap<>();
        response.put("running", true);
        response.put("message", "Scheduler started");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/scheduler/stop")
    public ResponseEntity<Map<String, Object>> stopScheduler() {
        schedulingConfig.stopScheduler();
        Map<String, Object> response = new HashMap<>();
        response.put("running", false);
        response.put("message", "Scheduler stopped");
        return ResponseEntity.ok(response);
    }
}