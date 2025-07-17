import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import UploadResume from './pages/UploadResume'
import AnalysisResults from './pages/AnalysisResults'
import JobMatching from './pages/JobMatching'
import SkillGapAnalysis from './pages/SkillGapAnalysis'
import History from './pages/History'
import './App.css'

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null)
  const [analysisHistory, setAnalysisHistory] = useState([])

  const addToHistory = (analysis) => {
    const newAnalysis = {
      ...analysis,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    }
    setAnalysisHistory(prev => [newAnalysis, ...prev])
    setCurrentAnalysis(newAnalysis)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64">
            <Header />
            <main className="p-6">
              <Routes>
                <Route path="/" element={<Dashboard currentAnalysis={currentAnalysis} />} />
                <Route path="/upload" element={<UploadResume onAnalysisComplete={addToHistory} />} />
                <Route path="/analysis" element={<AnalysisResults analysis={currentAnalysis} />} />
                <Route path="/job-matching" element={<JobMatching analysis={currentAnalysis} />} />
                <Route path="/skill-gap" element={<SkillGapAnalysis analysis={currentAnalysis} />} />
                <Route path="/history" element={<History history={analysisHistory} onSelectAnalysis={setCurrentAnalysis} />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App

