import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeNew from './pages/HomeNew';
import AnalysisNew from './pages/AnalysisNew';
import ParticleBackground from './components/layout/ParticleBackground';

const App = () => {
  return (
    <Router>
      <ParticleBackground />
      <Routes>
        <Route path="/" element={<HomeNew />} />
        <Route path="/analysis" element={<AnalysisNew />} />
        <Route path="/prediction" element={<AnalysisNew />} />
      </Routes>
    </Router>
  );
};

export default App;