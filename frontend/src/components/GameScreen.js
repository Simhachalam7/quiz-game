// frontend/src/components/GameScreen.js
import React, { useState, useEffect } from 'react';

function GameScreen({ socket }) {
  const [question, setQuestion] = useState(null);  // Holds the current question
  const [winner, setWinner] = useState('');  // Holds the name of the player who answered correctly

  useEffect(() => {
    // Listen for question updates from the server
    socket.on('update_question', (questionData) => {
      setQuestion(questionData);
      setWinner('');  // Clear previous winner when a new question appears
    });

    // Listen for correct answer notification from server
    socket.on('correct_answer', (playerName) => {
      setWinner(playerName);  // Show the winner
    });

    // Listen for game over signal from server
    socket.on('game_over', (players) => {
      alert('Game over! Check the scores!');
    });
  }, [socket]);

  return (
    <div className="game-screen">
      <h1>KBC Quiz Game</h1>
      {/* Show the winner */}
      {winner && <h2>🎉 {winner} got it right! 🎉</h2>}

      {/* Display the current question and options */}
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
