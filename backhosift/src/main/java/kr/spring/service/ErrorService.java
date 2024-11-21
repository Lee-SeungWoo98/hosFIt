package kr.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import kr.spring.dto.ErrorDTO;
import kr.spring.entity.ErrorLog;
import kr.spring.repository.ErrorRepository;

import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class ErrorService {

    @Autowired
    private ErrorRepository errorRepository;

    @Autowired
    private ModelMapper modelMapper;

    public List<ErrorDTO> getAllErrors() {
        return errorRepository.findAll()
            .stream()
            .map(error -> modelMapper.map(error, ErrorDTO.class))
            .collect(Collectors.toList());
    }

    public ErrorDTO getError(Long id) {
        ErrorLog error = errorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Error not found"));
        return modelMapper.map(error, ErrorDTO.class);
    }

    public ErrorDTO createError(ErrorDTO errorDTO) {
        ErrorLog error = modelMapper.map(errorDTO, ErrorLog.class); // Error 대신 ErrorLog 사용
        error = errorRepository.save(error);
        return modelMapper.map(error, ErrorDTO.class);
    }

    public ErrorDTO updateError(Long id, ErrorDTO errorDTO) {
        ErrorLog existingError = errorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Error not found"));

        modelMapper.map(errorDTO, existingError);
        
        existingError = errorRepository.save(existingError);
        return modelMapper.map(existingError, ErrorDTO.class);
    }

    public void deleteError(Long id) {
        errorRepository.deleteById(id);
    }
    public List<ErrorDTO> getErrorsBySeverity(String severity, int limit) {
        return errorRepository.findBySeveritylevelOrderByCreatedatDesc(severity, PageRequest.of(0, limit))
                .stream()
                .map(error -> modelMapper.map(error, ErrorDTO.class))
                .collect(Collectors.toList());
    }

}
