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
    @GetMapping("/checkSession")
    public ResponseEntity<?> checkSession(HttpSession session) {
        // 세션에서 로그인된 사용자 정보 가져오기
        Member loggedInUser = (Member) session.getAttribute("loggedInUser");

        if (loggedInUser != null) {
            // 로그인된 상태면 true와 사용자 정보를 반환
            return ResponseEntity.ok().body(Map.of(
                "isAuthenticated", true,
                "user", loggedInUser  // 필요에 따라 사용자 정보를 보낼 수 있음
            ));
        } else {
            // 세션에 로그인 정보가 없으면 인증되지 않은 상태
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "isAuthenticated", false,
                "message", "로그인되지 않음"
            ));
        }
    }
    
    @GetMapping("/memberList")
    public @ResponseBody List<Member> memberList() {
    	System.out.println(service.getAllMembers().toString());
        return service.getAllMembers();
    }

}
