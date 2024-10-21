package kr.spring.entity;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "EnzymesMetabolism")
public class EnzymesMetabolism {

    @Id
    @Column(name = "bloodidx")
    private Integer bloodidx;

    @Column(name = "CK")
    private Integer ck;

    @Column(name = "CKMB")
    private Integer ckmb;

    @Column(name = "Creatinine")
    private Float creatinine;

    @Column(name = "DDimer")
    private Integer dDimer;

    @Column(name = "GGT")
    private Integer ggt;

    @Column(name = "Glucose")
    private Integer glucose;

    @Column(name = "INRPT")
    private Float inrpt;

    @Column(name = "Lactate")
    private Float lactate;

    @Column(name = "LD")
    private Integer ld;

    @Column(name = "Lipase")
    private Integer lipase;

    @Column(name = "Magnesium")
    private Float magnesium;

    @Column(name = "NTproBNP")
    private Integer ntproBNP;

    @Column(name = "regdate")
    private Date regdate;

    // 외래키 관계 설정
    @ManyToOne
    @JoinColumn(name = "bloodidx", insertable = false, updatable = false)
    private BloodCheck bloodCheck;

    // getter, setter 생략
}