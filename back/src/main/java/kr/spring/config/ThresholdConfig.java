// ThresholdConfig.java
package kr.spring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "threshold.aitas")
@Getter
@Setter
@EnableScheduling
public class ThresholdConfig {
    private float criticalCareThreshold;
    private float intermediateCareThreshold;
    private float generalWardThreshold;
}