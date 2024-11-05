package kr.spring.dto;

import java.util.List;

import javax.persistence.NamedEntityGraph;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data // getter, setter, toString, equals, hashCode 자동 생성
@AllArgsConstructor
@NamedEntityGraph  // 파라미터 없는 기본 생성자 자동 생성
public class PatientDTO {
  

    // 기본 생성자 (필수)
		public PatientDTO() {
    }

		private Long subjectId;
	    private String name;
	    private String gender;
	    private String birthdate;
	    private Long age;
	    private String address;
	    private String pregnancystatus;
	    private Long phoneNumber;
	    private String residentNum;
	    private String icd;
	    private List<VisitDTO> visits; // List<Visit>에서 List<VisitDTO>로 변경

	    // getter, setter
	    public List<VisitDTO> getVisits() {
	        return visits;
	    }

	    public void setVisits(List<VisitDTO> visits) {
	        this.visits = visits;
	    }   // 방문 기록 정보 리스트
}
