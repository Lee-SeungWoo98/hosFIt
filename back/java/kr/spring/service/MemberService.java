package kr.spring.service;

import kr.spring.entity.Board;
import kr.spring.entity.Member;
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
    
    

    public List<Member> getAllMembers() {
    	System.out.println(repository.findAll().size());
        return repository.findAll();
    }

    public Member authenticate(String username, String password) {
        return repository.findByUsernameAndPassword(username, password);
    }
    
    
  
}