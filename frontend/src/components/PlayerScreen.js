// frontend/src/components/PlayerScreen.js
import React, { useState, useEffect } from 'react';

function PlayerScreen({ socket, playerName }) {
  const [question, setQuestion] = useState(null);  // Holds the current question
  const [selectedAnswer, setSelectedAnswer] = useState('');  // Stores player's answer
  const [feedback, setFeedback] = useState('');  // Shows feedback (e.g., wrong answer)

  useEffect(() => {
    // Listen for the question from the server
    socket.on('update_question', (questionData) => {
      setQuestion(questionData);
      setFeedback('');  // Clear feedback on new question
    });

    // Listen for wrong answer feedback
    socket.on('wrong_answer', () => {
      setFeedback('Sorry, that was incorrect.');
    });
  }, [socket]);

  // Handle answer submission
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
                value={option[0]}  // Answer value (A, B, C, D)
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
