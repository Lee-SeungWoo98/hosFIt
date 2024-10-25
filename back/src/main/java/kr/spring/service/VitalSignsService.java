package kr.spring.service;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.entity.VitalSigns;

import kr.spring.repository.VitalSignsRepository;
@Service
public class VitalSignsService {
	 @Autowired
	    private VitalSignsRepository vitalSignsRepository;
	@Transactional
	public  VitalSigns getChartNum(Long stayId) {
		// TODO Auto-generated method stub
		return vitalSignsRepository.findByVisitStayId(stayId);
	}

	

}
