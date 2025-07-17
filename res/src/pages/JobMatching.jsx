import { useState } from 'react'
import axios from 'axios'
import {
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline'

export default function JobMatching() {
  const [resume, setResume] = useState(null)
  const [jd, setJd] = useState(null)
  const [matchScore, setMatchScore] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('jd', jd)

    try {
      const res = await axios.post('http://localhost:8000/api/match-resume-jd/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMatchScore(res.data.match_score)
      setSuggestions(res.data.suggestions)
    } catch (err) {
      console.error(err)
      setError('❌ Failed to analyze. Make sure both files are valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 py-12 px-4 flex flex-col items-center">
      {/* Animated Header */}
      <div className="text-center space-y-4 animate-fade-in-down">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white shadow-lg">
          <SparklesIcon className="w-6 h-6 animate-pulse" />
          <span className="font-semibold">AI-Powered Resume & JD Match</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
          Resume Matcher
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Upload your resume & job description to instantly discover your match score and personalized suggestions powered by AI.
        </p>
      </div>

      {/* Upload Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl mt-12 bg-white/80 backdrop-blur-sm border-0 shadow-2xl p-8 rounded-2xl space-y-8 animate-fade-in-up"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setResume(e.target.files[0])}
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 bg-white/90"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-800">Upload Job Description</label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setJd(e.target.files[0])}
              required
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white/90"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-xl hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg font-bold"
          >
            {loading && <ArrowPathIcon className="w-6 h-6 animate-spin" />}
            {loading ? 'Analyzing...' : 'Analyze Match'}
          </button>
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <XCircleIcon className="w-6 h-6 text-red-500" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}
      </form>

      {/* Match Result */}
      {matchScore !== null && (
        <div className="w-full max-w-3xl mt-12 space-y-8 animate-fade-in-up">
          <div className="bg-gradient-to-r from-emerald-100 via-green-50 to-indigo-50 border border-emerald-200 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-emerald-800">🎯 Match Score</h2>
                <p className="text-5xl font-black text-emerald-700 animate-pulse">{matchScore}%</p>
              </div>
              <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">🛠️ Suggestions to Improve Your Resume:</h3>
              <ul className="space-y-3">
                {suggestions.map((sug, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl shadow hover:shadow-lg transition-transform duration-300 transform hover:scale-[1.02] border-l-4 border-emerald-400"
                  >
                    <ClipboardDocumentCheckIcon className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    <p className="text-gray-700 font-medium leading-relaxed">{sug}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
