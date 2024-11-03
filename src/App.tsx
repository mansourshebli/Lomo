// import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import EssayAssistant from './pages/EssayAssistant';
import ExtracurricularRecommendations from './pages/ExtracurricularRecommendations';
import AICollegeCounselor from './pages/AICollegeCounselor';
import UniversityDatabase from './pages/UniversityDatabase';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/essay-assistant" element={<EssayAssistant />} />
            <Route path="/extracurricular-recommendations" element={<ExtracurricularRecommendations />} />
            <Route path="/ai-college-counselor" element={<AICollegeCounselor />} />
            <Route path="/university-database" element={<UniversityDatabase />} />
          </Routes>
        </main>
      </div>
      <Analytics/>
    </Router>
  );
}

export default App;