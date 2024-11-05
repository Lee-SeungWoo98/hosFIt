package kr.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonPropertyOrder({
    "heartrate", "resprate", "o2sat", "sbp", "dbp", "temperature",
    "alanineAminotransferase", "albumin", "alkalinePhosphatase",
    "ammonia", "amylase", "asparateAminotransferase", "betahydroxybutyrate",
    "bicarbonate", "bilirubinTotal", "cReactiveProtein", "calciumTotal",
    "calculatedTotalCO2", "chloride", "creatineKinase", "creatineKinaseMbIsoenzyme",
    "creatinine", "ddimer", "gammaGlutamyltransferase", "glucose", "hemoglobin",
    "inrpt", "lactate", "lactateDehydrogenase", "lipase", "magnesium", "ntprobnp",
    "pt", "ptt", "plateletCount", "potassium", "redBloodCells", "sedimentationRate",
    "sodium", "troponinT", "ureaNitrogen", "whiteBloodCells", "pCO2", "pH", "pO2",
    "gender", "age", "losHours", "tas", "pain", "arrivalTransport"
})


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
    private int alanineAminotransferase; // Alanine Aminotransferase (ALT)
    private float albumin; // Albumin
    private int alkalinePhosphatase; // Alkaline Phosphatase
    private int ammonia; // Ammonia
    private int amylase; // Amylase
    private int asparateAminotransferase; // Asparate Aminotransferase (AST)
    private float betahydroxybutyrate; // Beta Hydroxybutyrate
    private int bicarbonate; // Bicarbonate
    private float bilirubinTotal; // Bilirubin, Total
    private float cReactiveProtein; // C-Reactive Protein
    private float calciumTotal; // Calcium, Total
    private float calculatedTotalCO2; // Calculated Total CO2
    private int chloride; // Chloride
    private int creatineKinase; // Creatine Kinase (CK)
    private int creatineKinaseMbIsoenzyme; // Creatine Kinase, MB Isoenzyme
    private float creatinine; // Creatinine
    private float ddimer; // D-Dimer
    private int gammaGlutamyltransferase; // Gamma Glutamyltransferase
    private float glucose; // Glucose
    private float hemoglobin; // Hemoglobin
    private float inrpt; // INR(PT)
    private float lactate; // Lactate
    private int lactateDehydrogenase; // Lactate Dehydrogenase (LD)
    private int lipase; // Lipase
    private float magnesium; // Magnesium
    private float ntprobnp; // NTproBNP
    private float pt; // PT
    private float ptt; // PTT
    private int plateletCount; // Platelet Count
    private float potassium; // Potassium
    private float redBloodCells; // Red Blood Cells
    private int sedimentationRate; // Sedimentation Rate
    private float sodium; // Sodium
    private float troponinT; // Troponin T
    private float ureaNitrogen; // Urea Nitrogen
    private float whiteBloodCells; // White Blood Cells
    private float pCO2; // pCO2
    private float pH; // pH
    private float pO2; // pO2
    private int gender; // gender
    private int age; // age
    private int losHours; // los_hours
    private int tas; // TAS
    private int pain; // pain
    private int arrivalTransport; // arrival_transport
}
