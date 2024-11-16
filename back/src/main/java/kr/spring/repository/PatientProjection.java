package kr.spring.repository;
import java.time.LocalDate;
import java.time.LocalDateTime;

public interface PatientProjection {
    Long getSubjectId();
    String getName();
    String getGender();
    String getBirthdate();
    Long getAge();
    String getAddress();
    String getPregnancystatus();
    Long getPhoneNumber();
    String getResidentNum();
    String getIcd();
    Long getStayId();
    Long getPain();
    String getLosHours();
    Long getTas();
    Long getArrivalTransport();
    Long getLabel();
    LocalDateTime getVisitDate();
    
    // VitalSigns 관련
    String getChartNum();
    LocalDateTime getChartTime();  // String에서 LocalDateTime으로 변경
    Long getHeartrate();
    Long getResprate();
    String getO2sat();
    Long getSbp();
    Long getDbp();
    String getTemperature();
    LocalDateTime getRegDate();
    
    // AiTAS 관련
    Long getId();
    Float getLevel1();   // Long에서 Float으로 변경
    Float getLevel2();   // Long에서 Float으로 변경
    Float getLevel3();   // Long에서 Float으로 변경
	String getComment();
}