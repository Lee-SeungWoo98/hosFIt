package kr.spring.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "label_change_history")
public class LabelChangeHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "stayid")
    private Long stayId;
    
    @Column(name = "old_label")
    private Long oldLabel;
    
    @Column(name = "new_label")
    private Long newLabel;
    
    @Column(name = "change_time")
    private LocalDateTime changeTime;
    
    @Column(name = "changed_by")
    private String changedBy;
    
    @Column(name = "comment")
    private String comment;
}
