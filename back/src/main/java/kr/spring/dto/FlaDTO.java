package kr.spring.dto;

public interface FlaDTO {
    String getChartnum();
    Long getHeartrate();
    Long getResprate();  
    String getO2sat();
    Long getSbp();
    Long getDbp();
    String getTemperature();
    
    // 모든 필드에 대해 null을 허용하도록 Long 타입 사용
    Long getAlanineAminotransferase();
    Long getAlbumin();
    Long getAlkalinePhosphatase();
    Long getAmmonia();
    Long getAmylase();
    Long getAsparateAminotransferase();
    Long getBetahydroxybutyrate();
    Long getBicarbonate();
    Long getBilirubinTotal();
    Long getCreactiveProtein();  // 대소문자 주의
    Long getCalciumTotal();
    Long getCalculatedTotalCO2();
    Long getChloride();
    Long getCreatineKinase();
    Long getCreatineKinaseMbIsoenzyme();
    Long getCreatinine();
    Long getDdimer();
    Long getGammaGlutamyltransferase();
    Long getGlucose();
    Long getHemoglobin();
    Long getInrpt();
    Long getLactate();
    Long getLactateDehydrogenase();
    Long getLipase();
    Long getMagnesium();
    Long getNtprobnp();
    Long getPT();
    Long getPTT();
    Long getPlateletCount();
    Long getPotassium();
    Long getRedBloodCells();
    Long getSedimentationRate();
    Long getSodium();
    Long getTroponinT();
    Long getUreaNitrogen();
    Long getWhiteBloodCells();
    Long getPCO2();
    Long getPH();
    Long getPO2();
    
    String getGender();
    Long getAge();
    String getLosHours();  // VARCHAR 타입이므로 String
    Long getTas();
    Long getPain();
    Long getArrivalTransport();
	void setHeartrate(Long heartrate);
	void setResprate(Long resprate);
	void setO2sat(String o2sat);
	void setSbp(Long sbp);
	void setDbp(Long dbp);
	void setTemperature(String temperature);
	
	FlaDTO dto = new FlaDTOImpl();

	void setPain(Long pain);
	void setLosHours(String losHours);
	void setTas(Long tas);
	void setArrivalTransport(Long arrivalTransport);

}