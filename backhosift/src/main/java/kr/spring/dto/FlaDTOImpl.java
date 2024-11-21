// FlaDTOImpl.java
package kr.spring.dto;

public class FlaDTOImpl implements FlaDTO {
    private String chartnum;
    private Long heartrate;
    private Long resprate;
    private String o2sat;
    private Long sbp;
    private Long dbp;
    private String temperature;

    private Long alanineAminotransferase;
    private Long albumin;
    private Long alkalinePhosphatase;
    private Long ammonia;
    private Long amylase;
    private Long asparateAminotransferase;
    private Long betahydroxybutyrate;
    private Long bicarbonate;
    private Long bilirubinTotal;
    private Long creactiveProtein;
    private Long calciumTotal;
    private Long calculatedTotalCO2;
    private Long chloride;
    private Long creatineKinase;
    private Long creatineKinaseMbIsoenzyme;
    private Long creatinine;
    private Long ddimer;
    private Long gammaGlutamyltransferase;
    private Long glucose;
    private Long hemoglobin;
    private Long inrpt;
    private Long lactate;
    private Long lactateDehydrogenase;
    private Long lipase;
    private Long magnesium;
    private Long ntprobnp;
    private String pt;
    private String ptt;
    private Long plateletCount;
    private Long potassium;
    private Long redBloodCells;
    private Long sedimentationRate;
    private Long sodium;
    private Long troponinT;
    private Long ureaNitrogen;
    private Long whiteBloodCells;
    private Long pCO2;
    private Long pH;
    private Long pO2;

    private String gender;
    private Long age;
    private String losHours;
    private Long tas;
    private Long pain;
    private Long arrivalTransport;

    // Getter and Setter implementations
    @Override
    public String getChartnum() { return chartnum; }
    public void setChartnum(String chartnum) { this.chartnum = chartnum; }

    @Override
    public Long getHeartrate() { return heartrate; }
    public void setHeartrate(Long heartrate) { this.heartrate = heartrate; }

    @Override
    public Long getResprate() { return resprate; }
    public void setResprate(Long resprate) { this.resprate = resprate; }

    @Override
    public String getO2sat() { return o2sat; }
    public void setO2sat(String o2sat) { this.o2sat = o2sat; }

    @Override
    public Long getSbp() { return sbp; }
    public void setSbp(Long sbp) { this.sbp = sbp; }

    @Override
    public Long getDbp() { return dbp; }
    public void setDbp(Long dbp) { this.dbp = dbp; }

    @Override
    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    @Override
    public Long getAlanineAminotransferase() { return alanineAminotransferase; }
    public void setAlanineAminotransferase(Long alanineAminotransferase) { this.alanineAminotransferase = alanineAminotransferase; }

    @Override
    public Long getAlbumin() { return albumin; }
    public void setAlbumin(Long albumin) { this.albumin = albumin; }

    @Override
    public Long getAlkalinePhosphatase() { return alkalinePhosphatase; }
    public void setAlkalinePhosphatase(Long alkalinePhosphatase) { this.alkalinePhosphatase = alkalinePhosphatase; }

    @Override
    public Long getAmmonia() { return ammonia; }
    public void setAmmonia(Long ammonia) { this.ammonia = ammonia; }

    @Override
    public Long getAmylase() { return amylase; }
    public void setAmylase(Long amylase) { this.amylase = amylase; }

    @Override
    public Long getAsparateAminotransferase() { return asparateAminotransferase; }
    public void setAsparateAminotransferase(Long asparateAminotransferase) { this.asparateAminotransferase = asparateAminotransferase; }

    @Override
    public Long getBetahydroxybutyrate() { return betahydroxybutyrate; }
    public void setBetahydroxybutyrate(Long betahydroxybutyrate) { this.betahydroxybutyrate = betahydroxybutyrate; }

    @Override
    public Long getBicarbonate() { return bicarbonate; }
    public void setBicarbonate(Long bicarbonate) { this.bicarbonate = bicarbonate; }

    @Override
    public Long getBilirubinTotal() { return bilirubinTotal; }
    public void setBilirubinTotal(Long bilirubinTotal) { this.bilirubinTotal = bilirubinTotal; }

    @Override
    public Long getCreactiveProtein() { return creactiveProtein; }
    public void setCreactiveProtein(Long creactiveProtein) { this.creactiveProtein = creactiveProtein; }

    @Override
    public Long getCalciumTotal() { return calciumTotal; }
    public void setCalciumTotal(Long calciumTotal) { this.calciumTotal = calciumTotal; }

    @Override
    public Long getCalculatedTotalCO2() { return calculatedTotalCO2; }
    public void setCalculatedTotalCO2(Long calculatedTotalCO2) { this.calculatedTotalCO2 = calculatedTotalCO2; }

    @Override
    public Long getChloride() { return chloride; }
    public void setChloride(Long chloride) { this.chloride = chloride; }

    @Override
    public Long getCreatineKinase() { return creatineKinase; }
    public void setCreatineKinase(Long creatineKinase) { this.creatineKinase = creatineKinase; }

    @Override
    public Long getCreatineKinaseMbIsoenzyme() { return creatineKinaseMbIsoenzyme; }
    public void setCreatineKinaseMbIsoenzyme(Long creatineKinaseMbIsoenzyme) { this.creatineKinaseMbIsoenzyme = creatineKinaseMbIsoenzyme; }

    @Override
    public Long getCreatinine() { return creatinine; }
    public void setCreatinine(Long creatinine) { this.creatinine = creatinine; }

    @Override
    public Long getDdimer() { return ddimer; }
    public void setDdimer(Long ddimer) { this.ddimer = ddimer; }

    @Override
    public Long getGammaGlutamyltransferase() { return gammaGlutamyltransferase; }
    public void setGammaGlutamyltransferase(Long gammaGlutamyltransferase) { this.gammaGlutamyltransferase = gammaGlutamyltransferase; }

    @Override
    public Long getGlucose() { return glucose; }
    public void setGlucose(Long glucose) { this.glucose = glucose; }

    @Override
    public Long getHemoglobin() { return hemoglobin; }
    public void setHemoglobin(Long hemoglobin) { this.hemoglobin = hemoglobin; }

    @Override
    public Long getInrpt() { return inrpt; }
    public void setInrpt(Long inrpt) { this.inrpt = inrpt; }

    @Override
    public Long getLactate() { return lactate; }
    public void setLactate(Long lactate) { this.lactate = lactate; }

    @Override
    public Long getLactateDehydrogenase() { return lactateDehydrogenase; }
    public void setLactateDehydrogenase(Long lactateDehydrogenase) { this.lactateDehydrogenase = lactateDehydrogenase; }

    @Override
    public Long getLipase() { return lipase; }
    public void setLipase(Long lipase) { this.lipase = lipase; }

    @Override
    public Long getMagnesium() { return magnesium; }
    public void setMagnesium(Long magnesium) { this.magnesium = magnesium; }

    @Override
    public Long getNtprobnp() { return ntprobnp; }
    public void setNtprobnp(Long ntprobnp) { this.ntprobnp = ntprobnp; }

    @Override
    public String getPT() { return pt; }
    public void setPT(String pt) { this.pt = pt; }

    @Override
    public String getPTT() { return ptt; }
    public void setPTT(String ptt) { this.ptt = ptt; }

    @Override
    public Long getPlateletCount() { return plateletCount; }
    public void setPlateletCount(Long plateletCount) { this.plateletCount = plateletCount; }

    @Override
    public Long getPotassium() { return potassium; }
    public void setPotassium(Long potassium) { this.potassium = potassium; }

    @Override
    public Long getRedBloodCells() { return redBloodCells; }
    public void setRedBloodCells(Long redBloodCells) { this.redBloodCells = redBloodCells; }

    @Override
    public Long getSedimentationRate() { return sedimentationRate; }
    public void setSedimentationRate(Long sedimentationRate) { this.sedimentationRate = sedimentationRate; }

    @Override
    public Long getSodium() { return sodium; }
    public void setSodium(Long sodium) { this.sodium = sodium; }

    @Override
    public Long getTroponinT() { return troponinT; }
    public void setTroponinT(Long troponinT) { this.troponinT = troponinT; }

    @Override
    public Long getUreaNitrogen() { return ureaNitrogen; }
    public void setUreaNitrogen(Long ureaNitrogen) { this.ureaNitrogen = ureaNitrogen; }

    @Override
    public Long getWhiteBloodCells() { return whiteBloodCells; }
    public void setWhiteBloodCells(Long whiteBloodCells) { this.whiteBloodCells = whiteBloodCells; }

    @Override
    public Long getPCO2() { return pCO2; }
    public void setPCO2(Long pCO2) { this.pCO2 = pCO2; }

    @Override
    public Long getPH() { return pH; }
    public void setPH(Long pH) { this.pH = pH; }

    @Override
    public Long getPO2() { return pO2; }
    public void setPO2(Long pO2) { this.pO2 = pO2; }

    @Override
    public String getGender() { return gender; }
    public void setGender(String string) { this.gender = string; }

    @Override
    public Long getAge() { return age; }
    public void setAge(Long age) { this.age = age; }

    @Override
    public String getLosHours() { return losHours; }
    public void setLosHours(String losHours) { this.losHours = losHours; }

    @Override
    public Long getTas() { return tas; }
    public void setTas(Long tas) { this.tas = tas; }

    @Override
    public Long getPain() { return pain; }
    public void setPain(Long pain) { this.pain = pain; }

    @Override
    public Long getArrivalTransport() { return arrivalTransport; }
    public void setArrivalTransport(Long arrivalTransport) { this.arrivalTransport = arrivalTransport; }
}
