package kr.spring.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import kr.spring.entity.Member;
import kr.spring.entity.MemberInterface;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    
	// 관리자 리스트
	@Query(nativeQuery = true,
			value = "SELECT A.username, A.name, A.position, A.department, A.major, A.num, B.logintime\r\n"
					+ "FROM Insa5_SpringA_final_2.member A LEFT JOIN\r\n"
					+ "(SELECT username, max(logintime) logintime\r\n"
					+ "FROM Insa5_SpringA_final_2.loginlogs\r\n"
					+ "GROUP BY username) B ON A.username = B.username")
	List<MemberInterface> findMemberList();
		
	// 관리자 상세보기
	@Query(nativeQuery = true, value = "SELECT m.name, m.position, m.department, m.major FROM member m WHERE m.username = :username")
	MemberInterface findMemberInfo(@Param("username") String username);
		
	// 사용자명과 비밀번호로 사용자 찾기
	Member findByUsernameAndPassword(String username, String password);

	// 멤버 로그인 시간
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "Insert into loginlogs(username, logintime) values (:username, date_format(now(), '%Y%m%d %H%i%s'))")
	void saveLoginTime(String username);
    
}
