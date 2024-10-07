// frontend/src/components/HomeScreen.js
import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

function HomeScreen({ onJoin, players, startGame, isPlayer }) {
  const [name, setName] = useState('');

  return (
    <div className="home-screen">
      <h1>KBC Quiz Game</h1>
      {!isPlayer && (
        <>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={() => onJoin(name)}>Join Game</button>
        </>
      )}
      <h2>Scan QR Code to join on mobile</h2>
      {/* QR Code for players to join from their mobile devices */}
      <QRCodeCanvas value="https://quiz-game-mjrii53bf-simhachalams-projects.vercel.app" size={200} />

      <div>
        <h3>Players Joined:</h3>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.name}</li>
          ))}
        </ul>
        {players.length > 0 && (
          <button onClick={startGame}>Start Game</button>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
