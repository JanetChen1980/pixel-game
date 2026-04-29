import { useState } from 'react';

function Home({ onStart }) {
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim().length > 0) {
      onStart(id.trim());
    }
  };

  return (
    <div className="home-screen">
      <h1>PIXEL QUIZ GAME</h1>
      <p>請輸入你的玩家 ID</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={id} 
          onChange={(e) => setId(e.target.value)} 
          placeholder="Player ID"
          required
        />
        <br />
        <button type="submit">INSERT COIN (START)</button>
      </form>
    </div>
  );
}

export default Home;
