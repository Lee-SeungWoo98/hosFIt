package kr.spring.entity;

import java.io.Serializable;
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
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "visit")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
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

    @Builder(builderClassName = "VisitBuilder", buildMethodName = "buildVisit")
    public Visit(Long stayId, Patient patient, Long pain, String losHours, Long tas, 
                Long arrivalTransport, Long label, LocalDateTime visitDate, Long staystatus, 
                String comment) {
        this.stayId = stayId;
        this.patient = patient;
        this.pain = pain;
        this.losHours = losHours;
        this.tas = tas;
        this.arrivalTransport = arrivalTransport;
        this.label = label;
        this.visitDate = visitDate;
        this.staystatus = staystatus;
        this.comment = comment;
        this.labTests = new HashSet<>();
        this.vitalSigns = new HashSet<>();
    }

    // Helper methods for managing relationships
    public void addLabTest(LabTest labTest) {
        this.labTests.add(labTest);
        labTest.setVisit(this);
    }

    public void removeLabTest(LabTest labTest) {
        this.labTests.remove(labTest);
        labTest.setVisit(null);
    }

    public void addVitalSign(VitalSigns vitalSign) {
        this.vitalSigns.add(vitalSign);
        vitalSign.setVisit(this);
    }

    public void removeVitalSign(VitalSigns vitalSign) {
        this.vitalSigns.remove(vitalSign);
        vitalSign.setVisit(null);
    }

    public long getSubjectId() {
        return patient != null ? patient.getSubjectId() : 0;
    }

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

    // Static builder class
    public static class VisitBuilder {
        public Visit build() {
            return buildVisit();
        }
    }
}