package kr.spring.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import kr.spring.dto.FlaDTO;

@Repository
public class FlaskRepository {

    private final JdbcTemplate jdbcTemplate;

    public FlaskRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<FlaDTO> getPatientData(int subjectId) {
        String sql = "SELECT " +
                "v.heartrate, v.resprate, v.o2sat, v.sbp, v.dbp, v.temperature, " +
                "c.ALT AS alanineAminotransferase, c.albumin AS albumin, c.alkalinephosphatase AS alkalinePhosphatase, " +
                "c.ammonia AS ammonia, c.amylase AS amylase, " +
                "c.AST AS asparateAminotransferase, c.betahydroxybutyrate AS betahydroxybutyrate, " +
                "c.bicarbonate AS bicarbonate, " +
                "c.bilirubin AS bilirubinTotal, " +
                "c.CRP AS cReactiveProtein, " +
                "c.calcium AS calciumTotal, " +
                "c.co2 AS calculatedTotalCO2, " +
                "c.chloride AS chloride, " +
                "e.CK AS creatineKinase, e.CKMB AS creatineKinaseMbIsoenzyme, " +
                "e.creatinine AS creatinine, " +
                "e.DDimer AS ddimer, e.GGT AS gammaGlutamyltransferase, e.glucose AS glucose, " +
                "b.Hemoglobin AS hemoglobin, e.INRPT AS inrpt, e.Lactate AS lactate, " +
                "e.LD AS lactateDehydrogenase, e.Lipase AS lipase, e.Magnesium AS magnesium, " +
                "e.NTproBNP AS ntprobnp, " +
                "etc.PT AS PT, etc.PTT AS PTT, " +
                "b.PlateletCount AS plateletCount, " +
                "el.Potassium AS potassium, b.RBC AS redBloodCells, b.sedimentationRate AS sedimentationRate, " +
                "el.Sodium AS sodium, " +
                "etc.TroponinT AS troponinT, " +
                "etc.UreaNitrogen AS ureaNitrogen, " +
                "b.WBC AS whiteBloodCells, bg.pCO2 AS pCO2, bg.pH AS pH, bg.pO2 AS pO2, " +
                "CAST(p.gender AS UNSIGNED) AS gender, CAST(vis.arrivaltransport AS UNSIGNED) AS arrivalTransport, " + 
                "p.age AS age, " +
                "vis.loshours AS losHours, vis.TAS AS tas, vis.pain AS pain " +
                "FROM vitalsigns v " +
                "JOIN visit vis ON v.stayid = vis.stayid " +
                "JOIN labtest l ON vis.stayid = l.stayid " +
                "JOIN chemicalexaminationsenzymes c ON l.bloodidx = c.bloodidx " +
                "JOIN EnzymesMetabolism e ON l.bloodidx = e.bloodidx " +
                "JOIN bloodlevels b ON l.bloodidx = b.bloodidx " +
                "JOIN bloodgasanalysis bg ON l.bloodidx = bg.bloodidx " +
                "JOIN patient p ON vis.subjectid = p.subjectid " +
                "JOIN etc ON l.bloodidx = etc.bloodidx " +
                "JOIN electrolytelevel el ON l.bloodidx = el.bloodidx " +
                "WHERE p.subjectid = ?";

        return jdbcTemplate.query(sql, new Object[]{subjectId}, new FlaDTOMapper());
    }

    private static class FlaDTOMapper implements RowMapper<FlaDTO> {
        @Override
        public FlaDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new FlaDTO(
                rs.getInt("heartrate"),
                rs.getInt("resprate"),
                rs.getInt("o2sat"),
                rs.getInt("sbp"),
                rs.getInt("dbp"),
                rs.getFloat("temperature"),
                rs.getInt("alanineAminotransferase"), // Alanine Aminotransferase (ALT)
                rs.getFloat("albumin"), // Albumin
                rs.getInt("alkalinePhosphatase"), // Alkaline Phosphatase
                rs.getInt("ammonia"), // Ammonia
                rs.getInt("amylase"), // Amylase
                rs.getInt("asparateAminotransferase"), // Asparate Aminotransferase (AST)
                rs.getFloat("betahydroxybutyrate"), // Beta Hydroxybutyrate
                rs.getInt("bicarbonate"), // Bicarbonate
                rs.getFloat("bilirubinTotal"), // Bilirubin, Total
                rs.getFloat("cReactiveProtein"), // C-Reactive Protein
                rs.getFloat("calciumTotal"), // Calcium, Total
                rs.getFloat("calculatedTotalCO2"), // Calculated Total CO2
                rs.getInt("chloride"), // Chloride
                rs.getInt("creatineKinase"), // Creatine Kinase (CK)
                rs.getInt("creatineKinaseMbIsoenzyme"), // Creatine Kinase, MB Isoenzyme
                rs.getFloat("creatinine"), // Creatinine
                rs.getFloat("ddimer"), // D-Dimer
                rs.getInt("gammaGlutamyltransferase"), // Gamma Glutamyltransferase
                rs.getFloat("glucose"), // Glucose
                rs.getFloat("hemoglobin"), // Hemoglobin
                rs.getFloat("inrpt"), // INR(PT)
                rs.getFloat("lactate"), // Lactate
                rs.getInt("lactateDehydrogenase"), // Lactate Dehydrogenase (LD)
                rs.getInt("lipase"), // Lipase
                rs.getFloat("magnesium"), // Magnesium
                rs.getFloat("ntprobnp"), // NTproBNP
                rs.getFloat("pt"), // PT
                rs.getFloat("ptt"), // PTT
                rs.getInt("plateletCount"), // Platelet Count
                rs.getFloat("potassium"), // Potassium
                rs.getFloat("redBloodCells"), // Red Blood Cells
                rs.getInt("sedimentationRate"), // Sedimentation Rate
                rs.getFloat("sodium"), // Sodium
                rs.getFloat("troponinT"), // Troponin T
                rs.getFloat("ureaNitrogen"), // Urea Nitrogen
                rs.getFloat("whiteBloodCells"), // White Blood Cells
                rs.getFloat("pCO2"), // pCO2
                rs.getFloat("pH"), // pH
                rs.getFloat("pO2"), // pO2
                rs.getInt("gender"), // gender
                rs.getInt("age"), // age
                rs.getInt("losHours"), // los_hours
                rs.getInt("tas"), // TAS
                rs.getInt("pain"), // pain
                rs.getInt("arrivalTransport") // arrival_transport
            );
        }
    }
  
       
    }
