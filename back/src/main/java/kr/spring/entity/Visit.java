package kr.spring.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "visit")
@Getter
@Setter
public class Visit implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "stayid")
    private Long stayId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subjectid")
    @JsonBackReference   
    private Patient patient;

    @Column(name = "pain")
    private Long pain;

    @Column(name = "loshours")
    private String losHours;

    @Column(name = "TAS")
    private Long tas;

    @Column(name = "arrivaltransport")
    private Long arrivalTransport;

    @Column(name = "label")
    private Long label;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "visitdate")
    private LocalDateTime visitDate;

    @Column(name = "staystatus")
    private Long staystatus;
    
    @Column(name = "comment")
    private String comment;

    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<LabTest> labTests = new HashSet<>();

    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<VitalSigns> vitalSigns = new HashSet<>();

    // 양방향 관계 관리를 위한 헬퍼 메서드
  


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Visit)) return false;
        Visit visit = (Visit) o;
        return Objects.equals(getStayId(), visit.getStayId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getStayId());
    }

    @Override
    public String toString() {
        return "Visit{" +
               "stayId=" + stayId +
               ", pain=" + pain +
               ", losHours='" + losHours + '\'' +
               ", visitDate=" + visitDate +
               '}';
    }

    public long getSubjectId() {
        return patient != null ? patient.getSubjectId() : 0;
    }
}