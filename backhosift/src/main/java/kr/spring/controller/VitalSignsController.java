package kr.spring.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.spring.entity.Visit;
import kr.spring.repository.VisitRepository;
import kr.spring.service.VitalSignsService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(path = "/vitalsigns", produces = MediaType.APPLICATION_JSON_VALUE)
public class VitalSignsController {
    
    private final VitalSignsService vitalSignsService;
    private final VisitRepository visitRepository;

    @Autowired
    public VitalSignsController(VitalSignsService vitalSignsService, VisitRepository visitRepository) {
        this.vitalSignsService = vitalSignsService;
        this.visitRepository = visitRepository;
    }
    
    // 기존 stayId로 시작하는 엔드포인트
    @PostMapping("/start/{stayId}")
    public Map<String, Object> startGenerating(@PathVariable Long stayId) {
        log.info("Request to start generating vital signs for stayId: {}", stayId);
        Map<String, Object> response = new HashMap<>();
        
        try {
            vitalSignsService.startGenerating(stayId);
            response.put("status", "success");
            response.put("message", "Started generation for stayId: " + stayId);
        } catch (Exception e) {
            log.error("Error starting generation: ", e);
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    // subjectId로 시작하는 엔드포인트
    @PostMapping("/start/subject/{subjectId}")
    public Map<String, Object> startGeneratingBySubject(@PathVariable Long subjectId) {
        log.info("Request to start generating vital signs for subjectId: {}", subjectId);
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Visit> visit = visitRepository.findBySubjectId(subjectId);
            if (visit.isPresent()) {
                Long stayId = visit.get().getStayId();
                vitalSignsService.startGenerating(stayId);
                response.put("status", "success");
                response.put("message", "Started generation for subjectId: " + subjectId + " (stayId: " + stayId + ")");
            } else {
                response.put("status", "error");
                response.put("message", "No visit found for subjectId: " + subjectId);
            }
        } catch (Exception e) {
            log.error("Error starting generation for subjectId {}: ", subjectId, e);
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/stop/{stayId}")
    public Map<String, Object> stopGenerating(@PathVariable Long stayId) {
        log.info("Request to stop generating vital signs for stayId: {}", stayId);
        Map<String, Object> response = new HashMap<>();
        
        try {
            vitalSignsService.stopGenerating(stayId);
            response.put("status", "success");
            response.put("message", "Stopped generation for stayId: " + stayId);
            response.put("stillGenerating", vitalSignsService.isGenerating());
            response.put("remainingStayId", vitalSignsService.getTargetStayId());
        } catch (Exception e) {
            log.error("Error stopping generation: ", e);
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    @PostMapping("/stop/subject/{subjectId}")
    public Map<String, Object> stopGeneratingBySubject(@PathVariable Long subjectId) {
        log.info("Request to stop generating vital signs for subjectId: {}", subjectId);
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Visit> visit = visitRepository.findBySubjectId(subjectId);
            if (visit.isPresent()) {
                Long stayId = visit.get().getStayId();
                vitalSignsService.stopGenerating(stayId);
                response.put("status", "success");
                response.put("message", "Stopped generation for subjectId: " + subjectId + " (stayId: " + stayId + ")");
                response.put("stillGenerating", vitalSignsService.isGenerating());
                response.put("remainingStayId", vitalSignsService.getTargetStayId());
            } else {
                response.put("status", "error");
                response.put("message", "No visit found for subjectId: " + subjectId);
            }
        } catch (Exception e) {
            log.error("Error stopping generation for subjectId {}: ", subjectId, e);
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    @GetMapping("/status")
    public Map<String, Object> getStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("isGenerating", vitalSignsService.isGenerating());
        status.put("targetStayId", vitalSignsService.getTargetStayId());
        return status;
    }
}