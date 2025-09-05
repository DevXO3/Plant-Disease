import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Prediction from './pages/Prediction';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Prediction" element={<Prediction />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;