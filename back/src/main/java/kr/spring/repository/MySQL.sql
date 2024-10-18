INSERT INTO BOARD(TITLE, CONTENT, WRITER)
VALUES('신선한 가을이 왔습니다', '다같이 단풍구경 가는건 어떨까요?', '이경준');
INSERT INTO BOARD(TITLE, CONTENT, WRITER)
VALUES('신선한 가을이 왔습니다', '다같이 단풍구경 가는건 어떨까요?', '이경준');
INSERT INTO BOARD(TITLE, CONTENT, WRITER)
VALUES('신선한 가을이 왔습니다', '다같이 단풍구경 가는건 어떨까요?', '이경준');
INSERT INTO BOARD(TITLE, CONTENT, WRITER)
VALUES('신선한 가을이 왔습니다', '다같이 단풍구경 가는건 어떨까요?', '이경준');

select * from Board;

CREATE TABLE Patient (
    patient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT,
    age INT,
    gender INT,
    arrival_transport INT
);

CREATE TABLE Stay (
    stay_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT,
    charttime VARCHAR(255),
    los_hours DOUBLE,
    pain INT,
    TAS INT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);

CREATE TABLE VitalSigns (
    vital_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stay_id BIGINT,
    heartrate DOUBLE,
    resprate DOUBLE,
    o2sat DOUBLE,
    sbp INT,
    dbp INT,
    temperature DOUBLE,
    FOREIGN KEY (stay_id) REFERENCES Stay(stay_id)
);

CREATE TABLE LabResults (
    lab_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stay_id BIGINT,
    acetone DOUBLE,
    pH DOUBLE,
    pCO2 DOUBLE,
    pO2 DOUBLE,
    FOREIGN KEY (stay_id) REFERENCES Stay(stay_id)
);

CREATE TABLE SeverityLevel (
    severity_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stay_id BIGINT,
    severity_level INT,
    assigned_unit VARCHAR(255),
    room_id BIGINT,
    FOREIGN KEY (stay_id) REFERENCES Stay(stay_id),
    FOREIGN KEY (room_id) REFERENCES Room(room_id)
);

CREATE TABLE Room (
    room_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_type VARCHAR(255),
    is_occupied BOOLEAN
);

INSERT INTO Patient (subject_id, age, gender, arrival_transport)
VALUES (101, 34, 1, 2), 
       (102, 58, 0, 1);
       
INSERT INTO Stay (patient_id, charttime, los_hours, pain, TAS)
VALUES (1, '2024-10-10 14:30', 12.5, 3, 2), 
       (2, '2024-10-11 09:15', 24.0, 5, 4);
       
INSERT INTO VitalSigns (stay_id, heartrate, resprate, o2sat, sbp, dbp, temperature)
VALUES (1, 75, 18, 97, 120, 80, 36.5),
       (1, 78, 19, 98, 118, 78, 36.6),
       (2, 85, 22, 96, 130, 85, 37.2);
       
INSERT INTO LabResults (stay_id, acetone, pH, pCO2, pO2)
VALUES (1, 0.3, 7.35, 45, 98), 
       (2, 0.5, 7.28, 50, 95);
	INSERT INTO Room (room_type, is_occupied)
	VALUES ('일반 병동', TRUE), 
	       ('중환자실', TRUE),
	       ('일반 병동', FALSE);
	       
INSERT INTO SeverityLevel (stay_id, severity_level, assigned_unit, room_id)
VALUES (1, 2, '일반 병동', 1), 
       (2, 3, '중환자실', 2);
       
SELECT * FROM Member;

DROP TABLE IF EXISTS SeverityLevel;
DROP TABLE IF EXISTS LabResults;
DROP TABLE IF EXISTS VitalSigns;
DROP TABLE IF EXISTS Stay;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS member;
DROP TABLE IF EXISTS Member;


CREATE TABLE Member (
    username VARCHAR(50) NOT NULL,
    name VARCHAR(50),
    password VARCHAR(50),
    PRIMARY KEY (username)
) ENGINE=InnoDB;

INSERT INTO Member (username, password, name)
VALUES ('admin', '1234', 'doctor1')

INSERT INTO Member (username, password, name)
VALUES ('nlnh', '1234', 'doctor2')

commit;

select * from member;