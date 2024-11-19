package kr.spring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.repository.BedInfoRepository;

@Service
public class BedService {

	@Autowired
	private BedInfoRepository bedInfoRepository;

	public long countAllBeds() {
		return bedInfoRepository.count();//여기카운터는그냥이름정한게아니라jpa에서 제공하는 조회기능 
	}
	
 	public void setBedsNum(int num) {	// 병상 초기화 후 개수만큼 사용 가능
 		bedInfoRepository.saveAvailibleInit();
 		bedInfoRepository.saveAvailible(num);
 	}
	
}
