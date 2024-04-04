import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateRoom from './routes/CreateRoom';
import Room from './routes/Room';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomID" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
