<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="cpath" value="${pageContext.request.contextPath }" />
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<script
	src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
<script
	src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
<script
	src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script
	src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
	<div class="card">
		<div class="card-header">
			<div class="jumbotron jumbotron-fluid">
				<div class="container">
					<h1>Decision</h1>
					<p>oo님의 중증도는 ${SeverityLevel.severity_level}입니다.</p>
					<button type="submit">
						yes
						</p>
						<button type="submit">
							no
							</p>
				</div>
			</div>
		</div>
		<form action="login.do">
			<div class="form-group">
				<label for="id">아이디</label> <input type="text" class="form-control"
					id="id" name="id">
			</div>
			<div class="form-group">
				<label for="pw">비밀번호</label> <input type="password"
					class="form-control" id="pw" name="pw">
			</div>
			<button type="submit" class="btn btn-sm btn-primary form-control">로그인</button>

		</form>

<script type="text/javascript">
	$("#loginBtn").on("click", function(e) {
    e.preventDefault();
    let username = $("#id").val();
    let password = $("#pw").val();

    $.ajax({
        url: "${cpath}/login",
        type: "POST",
        contentType: "application/json", // JSON 형식으로 보낼 것을 명시
        data: JSON.stringify({
            "username": username,
            "password": password
        }),
        dataType: "json",
        success: function(response) {
            // 로그인 성공 시 서버에서 받은 응답 처리
            if (response.success) {
                alert(response.message);
                window.location.href = "${cpath}/decision";
            } else {
                alert(response.message);
            }
        },
        error: function() {
            // 로그인 실패 시 처리
            alert("로그인 실패!");
        }
    });
});

</script>

		</script>
</body>
</html>







