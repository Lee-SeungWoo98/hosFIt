import axios from 'axios';

class ErrorEmailService {
  constructor() {
    this.baseURL = 'http://localhost:8082/boot/errors';
  }

  async sendErrorLog(log) {
    try {
      if (!log || !log.id) {
        throw new Error('유효하지 않은 로그 데이터입니다.');
      }

      // 서버에 맞는 형식으로 데이터 변환
      const emailRequest = {
        id: log.id,
        errorname: log.errorname,
        errormessage: log.errormessage,
        errorstack: log.errorstack,
        errortype: log.errortype,
        severitylevel: log.severitylevel,
        url: log.url,
        userid: log.userid || '미로그인',
        browser: log.browser,
        createdat: new Date(),
        isresolved: log.isresolved
      };

      const response = await axios.post(
        `${this.baseURL}/send-email`,
        emailRequest,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return {
          success: true,
          message: '이메일이 성공적으로 전송되었습니다.'
        };
      } else {
        throw new Error(response.data.message || '이메일 전송에 실패했습니다.');
      }

    } catch (error) {
      console.error('Email sending error:', error);
      
      if (error.response) {
        throw new Error(
          `서버 에러 (${error.response.status}): ${error.response.data.message || '알 수 없는 에러'}`
        );
      }
      
      if (error.request) {
        throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      }
      
      throw error;
    }
  }
}

export default new ErrorEmailService();