package kr.spring.controller;



import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.spring.entity.Member;


import kr.spring.service.MemberService;

@RestController
public class MemberController {

    @Autowired
    private MemberService service;

    public ResponseEntity<?> memberLogin(@RequestBody Map<String, String> loginData, HttpSession session) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        // 사용자 인증
        Member authenticatedMember = service.authenticate(username, password);
        if (authenticatedMember != null) {
            // 세션에 사용자 정보 저장
            session.setAttribute("loggedInUser", authenticatedMember);
            return ResponseEntity.ok(authenticatedMember);
        } else {
            // 인증 실패 시 401 Unauthorized 반환
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }
    @GetMapping("/memberList")
    public @ResponseBody List<Member> memberList() {
    	System.out.println(service.getAllMembers().toString());
        return service.getAllMembers();
    }
    
    @GetMapping("/login")
    public @ResponseBody Member memberLogin(@RequestParam String username, @RequestParam String password) {
        // authenticate 메서드 호출로 인증 처리
        Member member = service.authenticate(username, password);

        // 인증 결과에 따른 로그 출력
        if (member != null) {
            System.out.println("Authenticated Member: " + member.toString());
        } else {
            System.out.println("Invalid credentials");
        }

        return member;
    }

}
