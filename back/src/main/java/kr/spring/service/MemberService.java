package kr.spring.service;


import kr.spring.entity.Member;
import kr.spring.entity.MemberInterface;
import kr.spring.repository.MemberRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.sun.corba.se.spi.activation.Repository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository repository;
    
    public List<MemberInterface> getAllMembers() {
        return repository.findMemberList();
    }

    public MemberInterface getMemberInfo(String username) {
        return repository.findMemberInfo(username);
    }
    
    public Member authenticate(String username, String password) {
        return repository.findByUsernameAndPassword(username, password);
    }
    
    
  
}