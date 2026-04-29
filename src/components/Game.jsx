import { useState, useEffect } from 'react';

function Game({ userId, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bossSeed, setBossSeed] = useState('');
  
  // 記錄使用者的答案
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    // 每次換題換一個關主
    if (questions.length > 0) {
      setBossSeed(`boss_${userId}_${currentIndex}_${Math.random()}`);
    }
  }, [currentIndex, questions, userId]);

  const fetchQuestions = async () => {
    try {
      const url = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
      const count = import.meta.env.VITE_QUESTION_COUNT || 5;
      
      const res = await fetch(`${url}?count=${count}`);
      const data = await res.json();
      
      if (data.status === 'success') {
        setQuestions(data.data);
      } else {
        setError('無法載入題目: ' + (data.message || '未知錯誤'));
      }
    } catch (err) {
      console.error(err);
      setError('連線失敗，請檢查設定檔的 GAS URL');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionKey) => {
    const newAnswers = [...userAnswers, { 
      questionId: questions[currentIndex].id, 
      answer: optionKey 
    }];
    setUserAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish(newAnswers);
    }
  };

  if (loading) return <div className="loading">LOADING...</div>;
  if (error) return <div className="error">ERROR: {error}</div>;
  if (questions.length === 0) return <div>找不到題目</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="game-screen">
      <div className="boss-container">
        <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${bossSeed}`} alt="Boss" />
      </div>
      <h2>STAGE {currentIndex + 1}</h2>
      <div className="question-text">{currentQ.question}</div>
      <div className="options-grid">
        <button className="option-btn" onClick={() => handleAnswer('A')}>A. {currentQ.A}</button>
        <button className="option-btn" onClick={() => handleAnswer('B')}>B. {currentQ.B}</button>
        <button className="option-btn" onClick={() => handleAnswer('C')}>C. {currentQ.C}</button>
        <button className="option-btn" onClick={() => handleAnswer('D')}>D. {currentQ.D}</button>
      </div>
    </div>
  );
}

export default Game;
