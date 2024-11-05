package kr.spring.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "visit")
@Data
public class Visit implements Serializable {
    @Id
    @Column(name = "stayid")
    private Long stayId;

    @ManyToOne
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

    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<LabTest> labTests;

    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<VitalSigns> vitalSigns;

    @Override
    public int hashCode() {
        return Objects.hash(stayId);
    }

    @Override
    public String toString() {
        return "Visit{stayId=" + stayId + ", pain=" + pain + ", losHours=" + losHours + "}";
    }

    public void setVitalsigns(List<VitalSigns> vitalsignsList) {
        if (vitalsignsList != null) {
            this.vitalSigns = new HashSet<>(vitalsignsList);
        }
    }
}
