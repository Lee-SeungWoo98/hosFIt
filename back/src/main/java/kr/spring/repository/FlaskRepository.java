package kr.spring.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import kr.spring.dto.FlaDTO;
import kr.spring.entity.VitalSigns;

@Repository
public interface FlaskRepository extends JpaRepository<VitalSigns, String> {

   @Query(nativeQuery = true, value = 
       "SELECT " +
       "   v.chartnum, " +
       "   v.heartrate, " +
       "   v.resprate, " +
       "   v.o2sat, " +
       "   v.sbp, " +
       "   v.dbp, " +
       "   v.temperature, " +
       "   c.ALT AS alanineAminotransferase, " +
       "   c.albumin AS albumin, " +
       "   c.alkalinephosphatase AS alkalinePhosphatase, " +
       "   c.ammonia AS ammonia, " +
       "   c.amylase AS amylase, " +
       "   c.AST AS asparateAminotransferase, " +
       "   c.betahydroxybutyrate AS betahydroxybutyrate, " +
       "   c.bicarbonate AS bicarbonate, " +
       "   c.bilirubin AS bilirubinTotal, " +
       "   c.CRP AS cReactiveProtein, " +
       "   c.calcium AS calciumTotal, " +
       "   c.co2 AS calculatedTotalCO2, " +
       "   c.chloride AS chloride, " +
       "   e.CK AS creatineKinase, " +
       "   e.CKMB AS creatineKinaseMbIsoenzyme, " +
       "   e.creatinine AS creatinine, " +
       "   e.DDimer AS ddimer, " +
       "   e.GGT AS gammaGlutamyltransferase, " +
       "   e.glucose AS glucose, " +
       "   b.Hemoglobin AS hemoglobin, " +
       "   e.INRPT AS inrpt, " +
       "   e.Lactate AS lactate, " +
       "   e.LD AS lactateDehydrogenase, " +
       "   e.Lipase AS lipase, " +
       "   e.Magnesium AS magnesium, " +
       "   e.NTproBNP AS ntprobnp, " +
       "   etc.PT AS PT, " +
       "   etc.PTT AS PTT, " +
       "   b.PlateletCount AS plateletCount, " +
       "   el.Potassium AS potassium, " +
       "   b.RBC AS redBloodCells, " +
       "   b.sedimentationRate AS sedimentationRate, " +
       "   el.Sodium AS sodium, " +
       "   etc.TroponinT AS troponinT, " +
       "   etc.UreaNitrogen AS ureaNitrogen, " +
       "   b.WBC AS whiteBloodCells, " +
       "   bg.pCO2 AS pCO2, " +
       "   bg.pH AS pH, " +
       "   bg.pO2 AS pO2, " +
       "   CAST(p.gender AS UNSIGNED) AS gender, " +
       "   CAST(vis.arrivaltransport AS UNSIGNED) AS arrivalTransport, " +
       "   p.age AS age, " +
       "   vis.loshours AS losHours, " +
       "   vis.TAS AS tas, " +
       "   vis.pain AS pain " +
       "FROM vitalsigns v " +
       "JOIN visit vis ON v.stayid = vis.stayid " +
       "LEFT JOIN labtest l ON vis.stayid = l.stayid " +
       "LEFT JOIN chemicalexaminationsenzymes c ON l.bloodidx = c.bloodidx " + 
       "LEFT JOIN EnzymesMetabolism e ON l.bloodidx = e.bloodidx " +
       "LEFT JOIN bloodlevels b ON l.bloodidx = b.bloodidx " +
       "LEFT JOIN bloodgasanalysis bg ON l.bloodidx = bg.bloodidx " +
       "JOIN patient p ON vis.subjectid = p.subjectid " +
       "LEFT JOIN etc ON l.bloodidx = etc.bloodidx " +
       "LEFT JOIN electrolytelevel el ON l.bloodidx = el.bloodidx " +
       "WHERE p.subjectid = :subjectId")
   List<FlaDTO> getPatientData(@Param("subjectId") Long subjectId);

   @Query(nativeQuery = true, value = 
       "SELECT " +
       "   v.chartnum, " +
       "   v.heartrate, " +
       "   v.resprate, " +
       "   v.o2sat, " +
       "   v.sbp, " +
       "   v.dbp, " +
       "   v.temperature, " +
       "   c.ALT AS alanineAminotransferase, " +
       "   c.albumin AS albumin, " +
       "   c.alkalinephosphatase AS alkalinePhosphatase, " +
       "   c.ammonia AS ammonia, " +
       "   c.amylase AS amylase, " +
       "   c.AST AS asparateAminotransferase, " +
       "   c.betahydroxybutyrate AS betahydroxybutyrate, " +
       "   c.bicarbonate AS bicarbonate, " +
       "   c.bilirubin AS bilirubinTotal, " +
       "   c.CRP AS cReactiveProtein, " +
       "   c.calcium AS calciumTotal, " +
       "   c.co2 AS calculatedTotalCO2, " +
       "   c.chloride AS chloride, " +
       "   e.CK AS creatineKinase, " +
       "   e.CKMB AS creatineKinaseMbIsoenzyme, " +
       "   e.creatinine AS creatinine, " +
       "   e.DDimer AS ddimer, " +
       "   e.GGT AS gammaGlutamyltransferase, " +
       "   e.glucose AS glucose, " +
       "   b.Hemoglobin AS hemoglobin, " +
       "   e.INRPT AS inrpt, " +
       "   e.Lactate AS lactate, " +
       "   e.LD AS lactateDehydrogenase, " +
       "   e.Lipase AS lipase, " +
       "   e.Magnesium AS magnesium, " +
       "   e.NTproBNP AS ntprobnp, " +
       "   etc.PT AS PT, " +
       "   etc.PTT AS PTT, " +
       "   b.PlateletCount AS plateletCount, " +
       "   el.Potassium AS potassium, " +
       "   b.RBC AS redBloodCells, " +
       "   b.sedimentationRate AS sedimentationRate, " +
       "   el.Sodium AS sodium, " +
       "   etc.TroponinT AS troponinT, " +
       "   etc.UreaNitrogen AS ureaNitrogen, " +
       "   b.WBC AS whiteBloodCells, " +
       "   bg.pCO2 AS pCO2, " +
       "   bg.pH AS pH, " +
       "   bg.pO2 AS pO2, " +
       "   CAST(p.gender AS UNSIGNED) AS gender, " +
       "   CAST(vis.arrivaltransport AS UNSIGNED) AS arrivalTransport, " +
       "   p.age AS age, " +
       "   vis.loshours AS losHours, " +
       "   vis.TAS AS tas, " +
       "   vis.pain AS pain " +
       "FROM vitalsigns v " +
       "JOIN visit vis ON v.stayid = vis.stayid " +
       "LEFT JOIN labtest l ON vis.stayid = l.stayid " +
       "LEFT JOIN chemicalexaminationsenzymes c ON l.bloodidx = c.bloodidx " + 
       "LEFT JOIN EnzymesMetabolism e ON l.bloodidx = e.bloodidx " +
       "LEFT JOIN bloodlevels b ON l.bloodidx = b.bloodidx " +
       "LEFT JOIN bloodgasanalysis bg ON l.bloodidx = bg.bloodidx " +
       "JOIN patient p ON vis.subjectid = p.subjectid " +
       "LEFT JOIN etc ON l.bloodidx = etc.bloodidx " +
       "LEFT JOIN electrolytelevel el ON l.bloodidx = el.bloodidx " +
       "WHERE v.chartnum = :chartNum " +
       "LIMIT 1")
   List<FlaDTO> getPatientDataByChartNum(@Param("chartNum") String chartNum);

   @Query(value = "SELECT vs.chartnum FROM vitalsigns vs " +
           "JOIN visit v ON vs.stayid = v.stayid " +
           "WHERE v.subjectid = :subjectId",
           nativeQuery = true)
   List<String> findChartNumsBySubjectId(@Param("subjectId") Long subjectId);
}