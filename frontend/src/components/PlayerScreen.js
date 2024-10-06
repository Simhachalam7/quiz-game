// frontend/src/components/PlayerScreen.js
import React, { useState, useEffect } from 'react';

function PlayerScreen({ socket, playerName }) {
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    socket.on('update_question', (questionData) => {
      setQuestion(questionData);
      setFeedback('');
    });

    socket.on('wrong_answer', () => {
      setFeedback('Incorrect! Try again.');
    });
  }, [socket]);

  const handleSubmit = () => {
    if (selectedAnswer) {
      socket.emit('submit_answer', { playerName, answer: selectedAnswer });
    }
  };

  return (
    <div className="player-screen">
      <h1>Welcome, {playerName}!</h1>
      {question && (
        <>
          <h2>{question.question}</h2>
          {question.options.map((option, index) => (
            <div key={index}>
              <input
                type="radio"
                name="answer"
                value={option[0]}
                onChange={() => setSelectedAnswer(option[0])}
              />
              {option}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Answer</button>
        </>
      )}
      {feedback && <h3>{feedback}</h3>}
    </div>
  );
}

export default PlayerScreen;
