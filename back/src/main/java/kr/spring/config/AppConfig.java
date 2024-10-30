package kr.spring.config;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import kr.spring.dto.PatientDTO;
import kr.spring.entity.Patient;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
    	 ModelMapper modelMapper = new ModelMapper();
    	 modelMapper.typeMap(Patient.class, PatientDTO.class)
         .addMappings(mapper -> mapper.skip(PatientDTO::setVisits));

    	 return modelMapper;
    }
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}