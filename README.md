# 📎 팀명: hosFit
## notion : https://cubic-traffic-14b.notion.site/hosFit-1ad999a5b3d1804a9ce4d00c6f7c6578?pvs=4
![image](https://github.com/user-attachments/assets/00440e78-d1f3-43a4-9843-feb6e103d1d2)



## 👀 서비스 소개
🔹 서비스 명<br>
 ### 의료진 의사 결정 지원을 위한 응급실 환자 모니터링 데이터 시각화 및 퇴실 후 배치 추천 AI 시스템

🔹 서비스 설명<br>
- 응급실 환자의 생체신호와 의료 기록을 분석하여, 퇴실 시 ICU, 일반병동, 퇴원 중 적합한 배치를 예측하는 AI 기반 의사결정 지원 시스템.
- MIMIC-IV 실제 데이터를 학습하여 환자 배치를 객관적이고 일관성 있게 지원함으로써 응급실 과밀화 문제 해결과 운영 효율성 향상을 목표로 함.
- 의료진이 실시간 대시보드로 환자의 상태를 모니터링하고, KTAS 기준과 다양한 필터링 기능을 통해 효율적으로 환자 관리.
- 시스템 운영 현황과 에러 로그를 실시간 관리하며, 배치 가중치 점수 조정이 가능한 유연한 응급실 관리 시스템 제공.

## 📅 프로젝트 기간
2024.10.16 ~ 2024.11.24 (6주)
<br>

## ⭐ 주요 기능
1. <strong>AI 기반 응급실 퇴실 후 환자 배치 추천</strong>
- PyTorch 기반 딥러닝 모델을 활용한 실시간 위험도 평가
- 환자 상태 분석 후 적절한 병상 배치(입원, 퇴원, 중환자실 등) 추천
2. <strong>실시간 생체 데이터 모니터링</strong>
- 심박수, 혈압, 혈액검사 등 환자 데이터를 시각화
- 의료진에게 실시간 대시보드 제공
3. <strong>Spring Boot 기반 백엔드 & React 프론트엔드 개발</strong>
- RESTful API 설계 및 환자 정보 관리
- 의료진을 위한 UI/UX 최적화된 웹 인터페이스 제공
4. <strong>AWS 기반 배포 및 CI/CD 자동화</strong>
- EC2, RDS, S3를 활용한 클라우드 서비스 운영
- GitHub Action을 통한 지속적 배포 및 테스트 자동화

### 핵심 개발 기능
✔️ PyTorch 기반 AI 환자 배치 예측 모델<br>
✔️ Spring Boot 백엔드로 사용자 인증, 의료 데이터 관리<br>
✔️ React 기반 프론트엔드로 데이터 시각화 및 인터페이스 구성<br>
✔️ AWS를 활용한 배포 환경 구성 (EC2, RDS, S3, Docker)<br>
✔️ GitHub Actions를 이용한 CI/CD 자동화
<br>

### 데이터 셋
![image](https://github.com/user-attachments/assets/e80bbd88-cb94-4f02-af37-1ae2a19ba35e)
<br>

## ⛏ 기술스택
<table>
    <tr>
        <th>구분</th>
        <th>내용</th>
    </tr>
    <tr>
        <td>Front-End</td>
        <td>
          <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"/>
          <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"/>
          <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
          <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>Back-End</td>
        <td>
            <img src="https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white"/>
            <img src="https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white"/>
            <img src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>AI</td>
        <td>
            <img src="https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white"/>
            <img src="https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>Database</td>
        <td>
            <img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>DevOps</td>
        <td>
            <img src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"/>
            <img src="https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white"/>
            <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>IDE</td>
        <td>
            <img src="https://img.shields.io/badge/Visual%20Studio-5C2D91.svg?style=for-the-badge&logo=visual-studio&logoColor=white"/>
            <img src="https://img.shields.io/badge/Eclipse-FE7A16.svg?style=for-the-badge&logo=Eclipse&logoColor=white"/>
            <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"/>
        </td>
    </tr>
</table>



<br>

## ⚙ 시스템 아키텍처 
![image](https://github.com/user-attachments/assets/99b628b2-4e96-494f-a864-65f052d20395)

## 📌 서비스 흐름도
![image](https://github.com/user-attachments/assets/b737f3c6-c451-4015-ae45-d5ada38f8efb)
<br>

## 🖥 화면 구성

### 메인 
![image](https://github.com/user-attachments/assets/702d9783-a298-4107-a4c4-44943591dc17)
<br>

### 환자 상세
![image](https://github.com/user-attachments/assets/0132d647-b377-44bc-99fd-07f419831078)
![image](https://github.com/user-attachments/assets/59d829a0-3d70-4357-8e49-fc3bf58e32b1)
![image](https://github.com/user-attachments/assets/4fe234f8-aefe-4a4d-9bda-48c7b0b40d82)
<br>

### 관리자 페이지 (대시보드)
![image](https://github.com/user-attachments/assets/61477b24-421f-42d8-8bca-02d2d0e2ca6e)
<br>

### 관리자 페이지 (의료진 관리)
![image](https://github.com/user-attachments/assets/a38b6945-998e-43cd-b920-d085d73f36c2)
<br>

### 관리자 페이지 (로그)
![image](https://github.com/user-attachments/assets/bdbe4a69-4264-44f1-b6d7-0f665573440a)
<br>

### 관리자 페이지 (설정)
![image](https://github.com/user-attachments/assets/57ef78e8-2296-48a9-8323-720ecae841b8)
<br>


## 👨‍👩‍👦‍👦 팀원 역할
![image](https://github.com/user-attachments/assets/8541bffc-018b-42b1-bb4d-5bf0d09b8dcd)

