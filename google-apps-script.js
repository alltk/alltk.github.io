// 구글 시트 앱스크립트 코드
// 이 코드를 구글 시트의 앱스크립트 에디터에 복사하여 사용하세요

// 텔레그램 봇 설정
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN'; // 실제 봇 토큰으로 교체
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID'; // 실제 채팅 ID로 교체

// 구글 시트 설정
const SHEET_ID = 'YOUR_SHEET_ID'; // 실제 시트 ID로 교체
const SHEET_NAME = '문의내역'; // 시트 이름

function doPost(e) {
  try {
    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 시트에 데이터 저장
    saveToSheet(data);
    
    // 텔레그램으로 메시지 전송
    sendToTelegram(data);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 구글 시트에 데이터 저장
function saveToSheet(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  // 헤더가 없으면 추가
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 5).setValues([
      ['이름', '연락처', '내용', '접수시간', '처리상태']
    ]);
  }
  
  // 데이터 추가
  sheet.appendRow([
    data.name,
    data.phone,
    data.message,
    data.timestamp,
    '미처리'
  ]);
}

// 텔레그램으로 메시지 전송
function sendToTelegram(data) {
  const message = `
🆕 새로운 문의가 접수되었습니다!

👤 이름: ${data.name}
📞 연락처: ${data.phone}
💬 내용: ${data.message}
⏰ 접수시간: ${data.timestamp}

빠른 답변 부탁드립니다! 🙏
  `;
  
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'HTML'
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}

// 테스트 함수
function testFunction() {
  const testData = {
    name: '테스트 사용자',
    phone: '010-1234-5678',
    message: '테스트 문의입니다.',
    timestamp: new Date().toLocaleString('ko-KR')
  };
  
  saveToSheet(testData);
  sendToTelegram(testData);
  
  console.log('테스트 완료');
}

// 시트 초기화 함수
function initializeSheet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  
  // 헤더 설정
  sheet.getRange(1, 1, 1, 5).setValues([
    ['이름', '연락처', '내용', '접수시간', '처리상태']
  ]);
  
  // 헤더 스타일링
  const headerRange = sheet.getRange(1, 1, 1, 5);
  headerRange.setBackground('#27ae60');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  
  // 열 너비 조정
  sheet.setColumnWidth(1, 100); // 이름
  sheet.setColumnWidth(2, 150); // 연락처
  sheet.setColumnWidth(3, 300); // 내용
  sheet.setColumnWidth(4, 150); // 접수시간
  sheet.setColumnWidth(5, 100); // 처리상태
  
  console.log('시트 초기화 완료');
}
