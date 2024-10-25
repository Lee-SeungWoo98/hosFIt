package kr.spring.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "labtest")
@Data
public class LabTest {
    @Id
    @Column(name = "bloodidx")
    private Long bloodIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stayid", referencedColumnName = "stayid")
    @JsonBackReference  // Visit 엔티티에서 순환 참조 방지
    private Visit visit;

    @Column(name = "testname")
    private String testName;

    @Column(name = "testresult")
    private String testResult;

    @Column(name = "testunit")
    private String testUnit;

    @Column(name = "testtime")
    private LocalDateTime testTime;

    @Column(name = "diagnosis")
    private String diagnosis;

    @Column(name = "diagnosiscode")
    private String diagnosisCode;

    @Column(name = "regdate")
    private LocalDateTime regDate;

    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "labtest", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // 순환 참조 방지를 위해 JSON 직렬화에서 제외
    private Set<BloodLevels> bloodLevels = new HashSet<>();

    // hashCode와 equals 메서드 간소화
    @Override
    public int hashCode() {
        return Objects.hash(bloodIdx);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof LabTest)) return false;
        LabTest other = (LabTest) obj;
        return Objects.equals(bloodIdx, other.bloodIdx);
    }

    // toString() 메서드 간소화하여 순환 참조 방지
    @Override
    public String toString() {
        return "LabTest{bloodIdx=" + bloodIdx + 
               ", testName='" + testName + '\'' +
               ", testResult='" + testResult + '\'' +
               ", testUnit=" + testUnit +
               ", testTime=" + testTime +
               ", diagnosis='" + diagnosis + '\'' +
               ", diagnosisCode='" + diagnosisCode + '\'' +
               ", regDate=" + regDate + "}";
    }
}
