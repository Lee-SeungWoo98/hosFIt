package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.service.BedService;

@RestController
public class BedController {
	
	@Autowired
    private BedService bedService;

	 @GetMapping("/count")
	 public ResponseEntity<Long> getTotalBedCount() {
	        long count = bedService.countAllBeds();
	        return new ResponseEntity<>(count, HttpStatus.OK);
	    }
	
	 @GetMapping("/bedSetting")
	 public void setBedsNum(int num) {
		 bedService.setBedsNum(num);
	 }

}
