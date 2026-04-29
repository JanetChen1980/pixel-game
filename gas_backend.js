// Google Apps Script 後端程式碼
// 請將此程式碼貼上到 Google Apps Script 專案中，並將其部署為「網頁應用程式 (Web App)」，權限設定為「所有人」。

const SHEET_NAME_QUESTIONS = '題目';
const SHEET_NAME_ANSWERS = '回答';

function doGet(e) {
  try {
    const count = parseInt(e.parameter.count) || 5;
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_QUESTIONS);
    const data = sheet.getDataRange().getValues();
    
    // 假設第一行是標題: 題號, 題目, A, B, C, D, 解答
    const headers = data[0];
    const questionsList = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;
      questionsList.push({
        id: row[0],
        question: row[1],
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5],
        answer: row[6] // 後端保留答案，不傳給前端
      });
    }
    
    // 隨機抽選
    shuffleArray(questionsList);
    const selectedQuestions = questionsList.slice(0, count).map(q => {
      // 刪除答案欄位，避免前端作弊
      delete q.answer;
      return q;
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: selectedQuestions
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // 處理 GAS 的 CORS 問題通常將 Content-Type 設為 text/plain，這裡我們嘗試解析 contents
    const payload = JSON.parse(e.postData.contents);
    const userId = payload.id;
    const userAnswers = payload.answers; // [{questionId: 1, answer: 'A'}, ...]
    
    // 1. 計算分數
    const qSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_QUESTIONS);
    const qData = qSheet.getDataRange().getValues();
    const answerMap = {};
    for (let i = 1; i < qData.length; i++) {
      answerMap[qData[i][0]] = qData[i][6]; // id -> 解答
    }
    
    let score = 0;
    userAnswers.forEach(item => {
      if (answerMap[item.questionId] && answerMap[item.questionId].toString().toUpperCase() === item.answer.toUpperCase()) {
        score++;
      }
    });
    
    // 2. 寫入或更新成績
    const aSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME_ANSWERS);
    const aData = aSheet.getDataRange().getValues();
    
    let userRowIndex = -1;
    let playCount = 0;
    let maxScore = 0;
    let firstClearScore = '';
    let triesToClear = '';
    
    for (let i = 1; i < aData.length; i++) {
      if (aData[i][0] == userId) {
        userRowIndex = i + 1; // 1-based for Apps Script range
        playCount = parseInt(aData[i][1]) || 0;
        maxScore = parseInt(aData[i][3]) || 0;
        firstClearScore = aData[i][4] || '';
        triesToClear = aData[i][5] || '';
        break;
      }
    }
    
    playCount += 1;
    if (score > maxScore) {
      maxScore = score;
    }
    
    const isPass = score >= 3; // 依賴門檻，假設 GAS 內為 3
    if (isPass && firstClearScore === '') {
      firstClearScore = score;
      triesToClear = playCount;
    }
    
    const now = new Date();
    
    if (userRowIndex !== -1) {
      // 更新: ID(1), 闖關次數(2), 總分(3), 最高分(4), 第一次通關分數(5), 花了幾次通關(6), 最近遊玩時間(7)
      aSheet.getRange(userRowIndex, 2).setValue(playCount);
      const currentTotal = parseInt(aData[userRowIndex-1][2]) || 0;
      aSheet.getRange(userRowIndex, 3).setValue(currentTotal + score);
      aSheet.getRange(userRowIndex, 4).setValue(maxScore);
      aSheet.getRange(userRowIndex, 5).setValue(firstClearScore);
      aSheet.getRange(userRowIndex, 6).setValue(triesToClear);
      aSheet.getRange(userRowIndex, 7).setValue(now);
    } else {
      // 新增
      aSheet.appendRow([
        userId, 
        playCount, 
        score, 
        maxScore, 
        firstClearScore, 
        triesToClear, 
        now
      ]);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: {
        score: score,
        maxScore: maxScore,
        playCount: playCount
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 處理 CORS 的預檢請求 OPTIONS
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON);
}

// 輔助函數：打亂陣列
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
