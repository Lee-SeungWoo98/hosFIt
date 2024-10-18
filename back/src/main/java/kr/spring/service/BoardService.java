package kr.spring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import kr.spring.entity.Board;
import kr.spring.repository.BoardRepository;

@Service
public class BoardService {
	@Autowired
	private BoardRepository repository;

	public void list(Model model) {
		List<Board> list = repository.findAll();
		model.addAttribute("list", list);

	}

	public Board get(Long idx) {
		// TODO Auto-generated method stub
		Optional<Board> vo  = repository.findById(idx);
		
		return vo.get();
	}

	public void register(Board vo) {
		// TODO Auto-generated method stub
		repository.save(vo);
		
		//다시 리스트로 이동하게 해준다 
		
	}

	public void remove(Long idx) {
		// TODO Auto-generated method stub
		repository.deleteById(idx);
		
	}
}
