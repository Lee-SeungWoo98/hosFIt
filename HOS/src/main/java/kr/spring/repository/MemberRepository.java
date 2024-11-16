package kr.spring.repository;

import kr.spring.entity.Member;
import kr.spring.entity.MemberInterface;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    
	// 관리자 리스트
	@Query(nativeQuery = true, value = "SELECT m.name, m.position, m.department, m.major FROM member m")
	List<MemberInterface> findMemberList();
		
	// 관리자 상세보기
	@Query(nativeQuery = true, value = "SELECT m.name, m.position, m.department, m.major FROM member m WHERE m.username = :username")
	MemberInterface findMemberInfo(@Param("username") String username);
		
	// 사용자명과 비밀번호로 사용자 찾기
	Member findByUsernameAndPassword(String username, String password);
    
    
    
}
