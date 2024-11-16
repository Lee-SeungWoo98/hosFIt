package kr.spring.service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.spring.entity.Member;
import kr.spring.entity.MemberInterface;
import kr.spring.repository.MemberRepository;

@Service
public class MemberService {

	@Autowired
    private MemberRepository repository;
    
    public List<MemberInterface> getAllMembers() {
        return repository.findMemberList();
    }

    public Member getMemberInfo(String username) {
    	Optional<Member> vo = repository.findById(username);
        return vo.get();
    }
    
    public Member authenticate(String username, String password) {
        return repository.findByUsernameAndPassword(username, password);
    }
    
    public void recordLogintime(String username) {
    	repository.saveLoginTime(username);
    }

//	public void recordLogouttime(String username) {
//		repository.saveLogoutTime(username);
//	}
  
}