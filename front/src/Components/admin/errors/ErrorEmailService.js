import axios from 'axios';

// 클래스 이름을 다르게 지정
class EmailService {
  constructor() {
    this.baseURL = 'http://localhost:8082/boot/errors';
    this.adminEmail = '2024skyfordive2024@gmail.com';
  }

  async sendErrorLog(log) {
    try {
      if (!log || !log.id) {
        throw new Error('유효하지 않은 로그 데이터입니다.');
      }

      const emailData = {
        logId: log.id,
        errorName: log.errorname,
        errorType: log.errortype,
        severity: log.severitylevel,
        message: log.errormessage,
        stackTrace: log.errorstack,
        url: log.url,
        userId: log.userid || '미로그인',
        browser: log.browser,
        createdAt: Array.isArray(log.createdat) ? 
          log.createdat.join('-') : 
          new Date().toISOString(),
        recipientEmail: this.adminEmail
      };

      console.log('Sending email data:', emailData);

      const response = await axios.post(
        `${this.baseURL}/send-email`,
        emailData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Server response:', response.data);

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
        console.error('Response error data:', error.response.data);
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

const errorEmailService = new EmailService();
export default errorEmailService;
