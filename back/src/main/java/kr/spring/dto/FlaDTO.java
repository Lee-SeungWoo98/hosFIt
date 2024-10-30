package kr.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FlaDTO {

    private int heartrate;
    private int resprate;
    private int o2sat;
    private int sbp;
    private int dbp;
    private float temperature;
    private int alanineAminotransferase;
    private float albumin;
    private int alkalinePhosphatase;
    private int ammonia;
    private int amylase;
    private int asparateAminotransferase;
    private float betahydroxybutyrate;
    private int bicarbonate;
    private float bilirubinTotal;
    private float calciumTotal;
    private int chloride;
    private int creatineKinase;
    private int creatineKinaseMbIsoenzyme;
    private float creatinine;
    private float ddimer;
    private int gammaGlutamyltransferase;
    private float glucose;
    private float inrpt;
    private float lactate;
    private int lactateDehydrogenase;
    private int lipase;
    private float magnesium;
    private float redBloodCells;
    private float whiteBloodCells;
    private int plateletCount;
    private float hemoglobin;
    private int sedimentationRate;
    private float sodium; // 추가된 부분
    private float potassium; // 추가된 부분
    private String gender;
    private int age;
    private int losHours;
    private int tas;
    private int pain;
    private String arrivalTransport;
    private float pCO2;
    private float pH;
    private float pO2;
    private float PT; // 추가된 부분
    private float PTT; // 추가된 부분
    private float TroponinT; // 추가된 부분
    private float UreaNitrogen; // 추가된 부분
}
