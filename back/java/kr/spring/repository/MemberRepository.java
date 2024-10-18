package kr.spring.repository;

import kr.spring.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    
    // 사용자명과 비밀번호로 사용자 찾기
	Member findByUsernameAndPassword(String username, String password);
    
    
}
