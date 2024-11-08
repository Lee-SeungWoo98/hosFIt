// ThresholdConfig.java
package kr.spring.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "patient.threshold")
public class ThresholdConfig {
	private AiTASThreshold aiTAS;
    
    @Data
    public static class AiTASThreshold {
        private double criticalCareThreshold = 0.5;  // level1 임계값
        private double intermediateCareThreshold = 0.4;  // level2 임계값
        private double generalWardThreshold = 0.3;  // level3 임계값
    }
}

