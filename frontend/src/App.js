// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import PlayerScreen from './components/PlayerScreen';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

function App() {
  const [isPlayer, setIsPlayer] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Listen for updates to the players list
    socket.on('players_update', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Listen for game start
    socket.on('start_game', () => {
      setIsGameStarted(true);
    });

    // Listen for the game started warning if trying to join late
    socket.on('game_started', () => {
      alert('Game has already started. You cannot join.');
    });
  }, []);

  const handleJoinGame = (name) => {
    setPlayerName(name);
    setIsPlayer(true);
    socket.emit('join_game', name);
  };

  return (
    <div className="App">
      {!isGameStarted ? (
        <HomeScreen
          onJoin={handleJoinGame}
          players={players}
          startGame={() => socket.emit('start_game')}
          isPlayer={isPlayer}
        />
      ) : isPlayer ? (
        <PlayerScreen socket={socket} playerName={playerName} />
      ) : (
        <GameScreen socket={socket} />
      )}
    </div>
  );
}

export default App;
