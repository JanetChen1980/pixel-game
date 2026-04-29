import { useState, useEffect } from 'react';

function Result({ userId, result, onReset }) {
  const [submitting, setSubmitting] = useState(true);
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    submitAnswers();
  }, []);

  const submitAnswers = async () => {
    try {
      const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      const res = await fetch(url, {
        method: 'POST',
        // GAS 預設對 Content-Type: application/json 的 CORS 支持可能有時需要設定，
        // 若使用 Content-Type: text/plain 可避免預檢請求，但此處維持 json，如果遇到 CORS 可以改 text/plain
        body: JSON.stringify({
          id: userId,
          answers: result
        })
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setScoreData(data.data);
      } else {
        setError('結算失敗: ' + (data.message || '未知錯誤'));
      }
    } catch (err) {
      console.error(err);
      setError('傳送成績失敗');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <div className="loading">CALCULATING SCORE...</div>;
  if (error) return <div className="error">{error}</div>;

  const threshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3');
  const isPass = scoreData.score >= threshold;

  return (
    <div className="result-screen">
      <h1 className={isPass ? 'result-pass' : 'result-fail'}>
        {isPass ? 'STAGE CLEAR!' : 'GAME OVER'}
      </h1>
      <h2>玩家: {userId}</h2>
      <p>本次得分: {scoreData.score} 題</p>
      <p>最高得分: {scoreData.maxScore}</p>
      <p>累積闖關次數: {scoreData.playCount}</p>
      
      <button onClick={onReset} style={{marginTop: '30px'}}>
        PLAY AGAIN
      </button>
    </div>
  );
}

export default Result;
