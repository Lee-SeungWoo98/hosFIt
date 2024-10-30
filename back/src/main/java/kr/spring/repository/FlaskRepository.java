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
                "c.ALT AS alanineaminotransferase, c.albumin, c.alkalinephosphatase, c.ammonia, c.amylase, " +
                "c.AST AS asparateaminotransferase, c.betahydroxybutyrate, c.bicarbonate, " +
                "c.bilirubin AS bilirubintotal, c.calcium AS calciumtotal, c.chloride, " +
                "e.CK AS creatinekinase, e.CKMB AS creatinekinasembisoenzyme, e.creatinine, " +
                "e.DDimer AS ddimer, e.GGT AS gammaglutamyltransferase, e.glucose, " +
                "e.INRPT AS inrpt, e.Lactate AS lactate, e.LD AS lactatedehydrogenase, " +
                "e.Lipase AS lipase, e.Magnesium AS magnesium, " +
                "b.RBC AS redbloodcells, b.WBC AS whitebloodcells, b.PlateletCount AS plateletcount, " +
                "b.Hemoglobin, b.sedimentationrate, " +
                "el.Sodium, el.Potassium, " + // 추가된 부분
                "p.gender, p.age, " +
                "vis.loshours, vis.TAS, vis.pain, vis.arrivaltransport, " +
                "bg.pCO2, bg.pH, bg.pO2, " +
                "etc.PT, etc.PTT, etc.TroponinT, etc.UreaNitrogen " + // 추가된 부분
                "FROM vitalsigns v " +
                "JOIN visit vis ON v.stayid = vis.stayid " +
                "JOIN labtest l ON vis.stayid = l.stayid " +
                "JOIN chemicalexaminationsenzymes c ON l.bloodidx = c.bloodidx " +
                "JOIN EnzymesMetabolism e ON l.bloodidx = e.bloodidx " +
                "JOIN bloodlevels b ON l.bloodidx = b.bloodidx " +
                "JOIN bloodgasanalysis bg ON l.bloodidx = bg.bloodidx " +
                "JOIN patient p ON vis.subjectid = p.subjectid " +
                "JOIN etc ON l.bloodidx = etc.bloodidx " +
                "JOIN electrolytelevel el ON l.bloodidx = el.bloodidx " + // 추가된 부분
                "WHERE p.subjectid = ?";

        return jdbcTemplate.query(sql, new Object[]{subjectId}, new FlaDTOMapper());
    }

    private static class FlaDTOMapper implements RowMapper<FlaDTO> {
        @Override
        public FlaDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            FlaDTO data = new FlaDTO(
                rs.getInt("heartrate"),
                rs.getInt("resprate"),
                rs.getInt("o2sat"),
                rs.getInt("sbp"),
                rs.getInt("dbp"),
                rs.getFloat("temperature"),
                rs.getInt("alanineaminotransferase"),
                rs.getFloat("albumin"),
                rs.getInt("alkalinephosphatase"),
                rs.getInt("ammonia"),
                rs.getInt("amylase"),
                rs.getInt("asparateaminotransferase"),
                rs.getFloat("betahydroxybutyrate"),
                rs.getInt("bicarbonate"),
                rs.getFloat("bilirubintotal"),
                rs.getFloat("calciumtotal"),
                rs.getInt("chloride"),
                rs.getInt("creatinekinase"),
                rs.getInt("creatinekinasembisoenzyme"),
                rs.getFloat("creatinine"),
                rs.getFloat("ddimer"),
                rs.getInt("gammaglutamyltransferase"),
                rs.getFloat("glucose"),
                rs.getFloat("inrpt"),
                rs.getFloat("lactate"),
                rs.getInt("lactatedehydrogenase"),
                rs.getInt("lipase"),
                rs.getFloat("magnesium"),
                rs.getFloat("redbloodcells"),
                rs.getFloat("whitebloodcells"),
                rs.getInt("plateletcount"),
                rs.getFloat("hemoglobin"),
                rs.getInt("sedimentationrate"),
                rs.getFloat("Sodium"), // 추가된 부분
                rs.getFloat("Potassium"), // 추가된 부분
                rs.getString("gender"),
                rs.getInt("age"),
                rs.getInt("loshours"),
                rs.getInt("tas"),
                rs.getInt("pain"),
                rs.getString("arrivaltransport"),
                rs.getFloat("pCO2"),
                rs.getFloat("pH"),
                rs.getFloat("pO2"),
                rs.getFloat("PT"), // 추가된 부분
                rs.getFloat("PTT"), // 추가된 부분
                rs.getFloat("TroponinT"), // 추가된 부분
                rs.getFloat("UreaNitrogen") // 추가된 부분
            );
            return data;
        }
    }
}
