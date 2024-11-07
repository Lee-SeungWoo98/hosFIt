package kr.spring.service;

import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import kr.spring.entity.VitalSigns;
import kr.spring.repository.VitalSignsRepository;
import java.util.List;

@Service
public class VitalSignsService {
    @Autowired
    private VitalSignsRepository vitalSignsRepository;

    @Transactional
    public List<VitalSigns> getVitalSignsByStayId(Long stayId) {
        return vitalSignsRepository.findByVisitStayId(stayId);
        
        
    }
    
    public List<VitalSigns> getVitalSigns2ByStayId(Long stayId) {
        return vitalSignsRepository.findByVisitStayIdOrderByChartTime(stayId);
    }
}
