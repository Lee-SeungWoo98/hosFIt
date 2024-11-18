package kr.spring.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.github.benmanes.caffeine.cache.Caffeine;
import kr.spring.entity.VitalSigns;
import kr.spring.dto.VitalSignsDTO;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class ModelMapperConfig {
    
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // 매핑 전략 설정
        modelMapper.getConfiguration()
            .setMatchingStrategy(MatchingStrategies.STRICT)
            .setSkipNullEnabled(true);
            
        // VitalSigns -> VitalSignsDTO 매핑 설정
        modelMapper.createTypeMap(VitalSigns.class, VitalSignsDTO.class)
            .addMappings(mapper -> {
                // 기본 필드들은 자동 매핑
                
                // level 값들 안전하게 매핑
                mapper.<Float>map(src -> {
                    if (src != null && src.getAiTAS() != null && !src.getAiTAS().isEmpty()) {
                        return src.getAiTAS().iterator().next().getLevel1();
                    }
                    return null;
                }, VitalSignsDTO::setLevel1);
                
                mapper.<Float>map(src -> {
                    if (src != null && src.getAiTAS() != null && !src.getAiTAS().isEmpty()) {
                        return src.getAiTAS().iterator().next().getLevel2();
                    }
                    return null;
                }, VitalSignsDTO::setLevel2);
                
                mapper.<Float>map(src -> {
                    if (src != null && src.getAiTAS() != null && !src.getAiTAS().isEmpty()) {
                        return src.getAiTAS().iterator().next().getLevel3();
                    }
                    return null;
                }, VitalSignsDTO::setLevel3);
                
                // wardCode는 일반 필드로 매핑
                mapper.<String>map(VitalSigns::getWardCode, VitalSignsDTO::setWardCode);
            });
        
        return modelMapper;
    }

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("patientDetails");
        cacheManager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)                // 최대 캐시 항목 수
                .expireAfterWrite(30, TimeUnit.MINUTES)  // 캐시 만료 시간
                .recordStats());                 // 캐시 통계 기록
        return cacheManager;
    }
}