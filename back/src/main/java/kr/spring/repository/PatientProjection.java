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

	    String getChartNum();
	    String getChartTime();
	    Long getHeartrate();
	    Long getResprate();
	    String getO2sat();
	    Long getSbp();
	    Long getDbp();
	    String getTemperature();
	    LocalDateTime getRegDate();

	    
	    Long getId();
	    Long getLevel1();
	    Long getLevel2();
	    Long getLevel3();

}
