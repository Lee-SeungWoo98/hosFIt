<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="cpath" value="${pageContext.request.contextPath }" />
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
   <div class="card">
       <div class="card-header">
          <div class="jumbotron jumbotron-fluid">
           <div class="container">
             <h1>웹기반 인공지능 Track2_A</h1>
             <p>Spring Boot와 JPA를 활용한 게시판...</p>
           </div>
         </div>
       </div>
       <div class="card-body">
          <h4 class="card-title">Spring boot</h4>
          <div class="row">
             <div class="col-lg-2">
                <div class="card" style="min-height: 500px; max-height: 1000px">
                   <div class="card-body">
                      <h4 class="card-title">GUEST</h4>
                      <p class="card-text">회원님 Welcome!</p>
                      <form action="">
                         <div class="form-group">
                            <label for="id">아이디</label>
                            <input type="text" class="form-control" id="id" name="id">
                         </div>
                         <div class="form-group">
                            <label for="pw">비밀번호</label>
                            <input type="password" class="form-control" id="pw" name="pw">
                         </div>
                         <button type="button" class="btn btn-sm btn-primary form-control">로그인</button>
                         
                      </form>
                   </div>
                </div>
             </div>
             <div class="col-lg-5">
                <div class="card" style="min-height: 500px; max-height: 1000px">
                   <div class="card-body">
                      <table class="table table-bordered table-hover">
                         <thead>
                            <tr>
                               <th>번호</th>
                               <th>제목</th>
                               <th>작성자</th>
                               <th>작성일</th>
                               <th>조회수</th>
                            </tr>
                         </thead>
                         <tbody>
                            <c:forEach var="vo" items="${list}" varStatus="i">
                               <tr>
                                  <td>${i.count}</td>
                                  <td>
                                  <a href="${vo.idx}">
                                  ${vo.title}
                                  </a>
                                  </td>
                                  <td>${vo.writer}</td>
                                  <td><fmt:formatDate pattern="yyyy-MM-dd" value="${vo.indate}"/> </td>
                                  <td>${vo.count}</td>
                               </tr>
                            </c:forEach>
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
             <div class="col-lg-5">
                <div class="card" style="min-height: 500px; max-height: 1000px">
                   <div class="card-body">
                      <form action="${cpath}/register" method="post">
                         <div class="form-group">
                            <label for="title">제목</label>
                            <input placeholder="Enter Title" type="text" class="form-control" id="title" name="title">
                         </div>
                         <div class="form-group">
                            <label for="content">내용</label>
                            <textarea placeholder="Enter Content" name="content" id="content" class="form-control" rows="7" cols=""></textarea>
                         </div>
                         <div class="form-group">
                            <label for="writer">작성자</label>
                            <input placeholder="Enter Writer" type="text" class="form-control" id="writer" name="writer">
                         </div>
                         <div id ="regDiv">
                         <button type="submit" class="btn btn-sm btn-primary">등록</button>
                         <button type="reset" class="btn btn-sm btn-warning">취소</button>
                         </div>
                         	
                           <div id ="updateDiv" style="display: none;">
                         <button type="button" onclick="location.href = '${cpath}/list'"id = "list" class="btn btn-sm btn-primary">목록</button>
                         <span id = "update">
                         <button type="button" onclick="updateFormDo()" id = "updateForm"class="btn btn-sm btn-warning">수정</button>
                         </span>
                         <input type="hidden" id="idx" name="idx">
                         <button type="button" onclick="remove()" id = "delete" class="btn btn-sm btn-warning">삭제</button>
                         </div>
                         
                         
                      </form>
                   </div>
                </div>
             </div>
          </div>
       </div> 
       <div class="card-footer">스프링-박병관</div>
   </div>
   
   <script type ="text/javascript">
   	$("a").on("click", function(e){// 해당 a태그를 클릭한 요소를 e라는 변수에 담겠다
   		e.preventDefault();
   		let idx = $(this).attr("href");//href를 속성으로 가져온다 
   		
   		$.ajax({
   			url: "${cpath}/get",
   			type:"get",
   			data:{"idx" : idx},
   			dataType: "json",
   			success : makeView,
   			error: function(){alert("error");}
   		});
   		
   		
   	});
   		
   	function makeView(data){
   		$("#title").val(data.title);
   		$("#title").attr("readonly", true);
   		
   		$("#writer").val(data.writer);
   		$("#writer").attr("readonly", true);
   		
   		$("#content").val(data.content);
   		$("#content").attr("readonly", true);
   		
   		$("#regDiv").css("display", "none");
   		$("#updateDiv").css("display","block");
   		
   		$("#idx").val(data.idx);
   		
   		
   	}
   	function remove(){
   		
   		let idx=$("#idx").val();//얘는ajax가아니다 고로 동기이다
   		location.href = "${cpath}/remove?idx=" + idx;
   	}
   	
   	function updateFormDo(){
   		$("#title").attr("readonly", false);
   		$("#content").attr("readonly", false);
   		
   		let upBtn = "<button type = 'submit' class = 'btn btn-sm btn-warning'>수정하기</button>";
   		$('#update').html(upBtn);
   		
   		
   	}
   	
   </script>
</body>
</html>







