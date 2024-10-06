// frontend/src/components/GameScreen.js
import React, { useState, useEffect } from 'react';

function GameScreen({ socket }) {
  const [question, setQuestion] = useState(null);
  const [winner, setWinner] = useState('');

  useEffect(() => {
    socket.on('update_question', (questionData) => {
      setQuestion(questionData);
      setWinner('');
    });

    socket.on('correct_answer', (playerName) => {
      setWinner(playerName);
    });

    socket.on('game_over', (players) => {
      alert('Game over! Check the scores!');
    });
  }, [socket]);

  return (
    <div className="game-screen">
      <h1>KBC Quiz Game</h1>
      {winner && <h2>🎉 {winner} got it right! 🎉</h2>}
      {question && (
        <>
          <h2>{question.question}</h2>
          <ul>
            {question.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default GameScreen;
