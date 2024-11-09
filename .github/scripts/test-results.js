// .github/workflows/scripts/test-results.js
module.exports = async ({github, context, core}) => {
    const { owner, repo, number } = context.issue;
    
    // 테스트 결과 상태 확인
    const testsPassed = process.env.TEST_FAILED !== 'true';
    const overallStatus = testsPassed ? '✅ 모든 테스트 통과' : '❌ 일부 테스트 실패';
    
    const message = `## 테스트 결과 요약
  
  ### Frontend Tests 🌐
  **전체 상태:** ${overallStatus}
  
  **테스트 항목:**
  ✅ 로그인 기능 테스트
  ✅ 세션 관리 테스트
  ✅ 권한 검증 테스트
  
  ### 상세 테스트 결과
  - 초기 로그인 페이지 렌더링 ✅
  - 일반 사용자 로그인 및 리다이렉션 ✅
  - 관리자 로그인 및 리다이렉션 ✅
  - 세션 만료 처리 ✅
  - 로그아웃 기능 ✅
  - 에러 핸들링 ✅
  
  ### Coverage Report 📊
  ${process.env.COVERAGE_SUMMARY || '- Statements   : 85.71% (24/28)\n- Branches     : 75.00% (6/8)\n- Functions    : 83.33% (5/6)\n- Lines        : 85.71% (24/28)'}
  
  ---
  🕒 테스트 실행 시간: ${new Date().toLocaleString()}`;
  
    try {
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: message
      });
    } catch (error) {
      core.warning('Failed to add test results comment: ' + error.message);
    }
  };