// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const questions = [
  { question: "What is the capital of France?", options: ["A. Berlin", "B. Madrid", "C. Paris", "D. Rome"], correct: "C" },
  { question: "What is the currency of Japan?", options: ["A. Dollar", "B. Yen", "C. Won", "D. Rupee"], correct: "B" },
  { question: "Who wrote 'Macbeth'?", options: ["A. Charles Dickens", "B. Leo Tolstoy", "C. Mark Twain", "D. William Shakespeare"], correct: "D" },
  { question: "What is the largest planet in the Solar System?", options: ["A. Earth", "B. Mars", "C. Jupiter", "D. Saturn"], correct: "C" },
  { question: "Which element has the chemical symbol 'O'?", options: ["A. Oxygen", "B. Gold", "C. Silver", "D. Hydrogen"], correct: "A" },
];

let currentQuestionIndex = 0;
let players = [];
let gameStarted = false;  // Game state

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  // Handle player joining
  socket.on('join_game', (playerName) => {
    if (!gameStarted) { // Prevent players from joining after the game starts
      const player = { id: socket.id, name: playerName, score: 0 };
      players.push(player);
      io.emit('players_update', players);  // Send updated players list to all clients
    } else {
      socket.emit('game_started');  // Notify players they cannot join
    }
  });

  // Handle answer submission
  socket.on('submit_answer', ({ playerName, answer }) => {
    const correctAnswer = questions[currentQuestionIndex].correct;
    const player = players.find((p) => p.name === playerName);

    if (answer === correctAnswer) {
      player.score += 1;
      io.emit('correct_answer', playerName);
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        io.emit('update_question', questions[currentQuestionIndex]);
      } else {
        io.emit('game_over', players);
      }
    } else {
      socket.emit('wrong_answer');
    }
  });

  // Handle game start
  socket.on('start_game', () => {
    if (!gameStarted && players.length > 0) {
      gameStarted = true;
      io.emit('start_game', questions[currentQuestionIndex]);  // Start the game
    }
  });

  // Handle player disconnect
  socket.on('disconnect', () => {
    players = players.filter((player) => player.id !== socket.id);
    io.emit('players_update', players);
    console.log('Player disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('Server running on port 4000');
});
