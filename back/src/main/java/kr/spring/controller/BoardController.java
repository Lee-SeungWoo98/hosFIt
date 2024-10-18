package kr.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.spring.entity.Board;
import kr.spring.service.BoardService;

@Controller
public class BoardController {
	// 게시글 전체조회

	@Autowired
	private BoardService service;

	@RequestMapping("/list")
	public String list(Model model) {
		service.list(model);
		
		
		
		return "list";
	}
	
	@RequestMapping("/get")
	public @ResponseBody Board get(Long idx) {
		return service.get(idx);
	}
	@RequestMapping("/register")
	public String register(Board vo) {
		service.register(vo);
		return "redirect:/list";
		//타이틀 컨텐츠 라이터 보내줘야돼? 그걸 어디에뒀더라 vo안에뒀다
		
		
	}
	
	@RequestMapping("/remove")
	public String remove(Long idx) {
		
		service.remove(idx);//requestparam없어도저절로해준다
		return "redirect:/list";
	}
	

	@RequestMapping("/decision")
	public String main() {
		return "decision";}
}
