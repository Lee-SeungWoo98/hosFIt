# bash
# ex)
# 1. 사용할 기본 이미지 설정
FROM openjdk:11-jre-slim as builder

# 2. 작업 디렉토리 설정.
WORKDIR /app/backEnd

# 3. Copy Maven files
COPY pom.xml ./
COPY src ./src

# 4. Build the application
# 주석처리 했을 경우 dockerfile 만들고 밖에서 아래 명령 실행
# -DskipTests 옵션은 생략해주어야 오류나지 않는거 같음
#RUN ./mvnw clean package -DskipTests

# 5. Create a new stage for the runtime
FROM openjdk:11-jre-slim

# 6. Working directory
WORKDIR /app

# 7. Copy the jar file from the builder stage
COPY target/*.jar app.jar

# 8. Expose the port the app runs on
EXPOSE 8082

# 9. 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]