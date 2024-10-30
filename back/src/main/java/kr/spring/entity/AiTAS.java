package kr.spring.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Entity
@Table(name = "aiTAS")
@Data
public class AiTAS {
	
	@Id
	@Column
	@JsonIgnore
	private Long id;
	
	@Column
	private Long level1;
	@Column
	private Long level2;
	@Column
	private Long level3;
	
	@JsonIgnore
    @Column(name = "stayid")  // `visit` 객체를 참조하지 않고, stayId만 매핑
    private Long stayId;
	
	
	
	

}
