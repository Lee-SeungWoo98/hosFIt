package kr.spring.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.spring.service.PatientRoomService;

@Controller
public class PatientRoomController {
	
	@Autowired
	public PatientRoomService service;
	
	@RequestMapping("/PatientsRoomList")
	public String room(){
		return "patientsRoom";
	}
	
	@RequestMapping("/getRoomInfo")
	@ResponseBody
	public HashMap<String,Object> getRoomInfo() {
		HashMap<String,Object> map = new HashMap<String,Object>();
		map.put("result", "success");
		map.put("TAS1", 35);
		map.put("TAS2", 29);
		map.put("TAS3", 17);
		map.put("TAS4", 11);
		map.put("TAS5", 5);
		return map;
	}
}
