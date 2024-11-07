package kr.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
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
        Error error = modelMapper.map(errorDTO, Error.class);
        error = errorRepository.save(error);
        return modelMapper.map(error, ErrorDTO.class);
    }

    public ErrorDTO updateError(Long id, ErrorDTO errorDTO) {
        ErrorLog existingError = errorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Error not found"));
        
        // id를 제외한 다른 필드들만 복사
        modelMapper.map(errorDTO, existingError);
        // id는 기존 값 유지
        
        existingError = errorRepository.save(existingError);
        return modelMapper.map(existingError, ErrorDTO.class);
    }

    public void deleteError(Long id) {
        errorRepository.deleteById(id);
    }
}