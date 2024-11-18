package kr.spring.config;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LabelConfig {
    @Value("${valid.label.values:1,2,3,4,5}")
    private String labelValuesString;
    
    @Bean
    public List<Long> validLabelValues() {
        return Arrays.stream(labelValuesString.split(","))
                    .map(String::trim)
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
    }
}