import { useEffect, useState } from 'react'
import axios from 'axios'

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/analyses/')
      const data = Array.isArray(response.data) ? response.data : []

      // Sort by upload date descending (latest first)
      const sorted = data.sort(
        (a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)
      )

      setHistory(sorted)
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Failed to load resume history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyses()
  }, [])

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">All Analyzed Resumes</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-500">No resumes analyzed yet.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-800 font-medium"
            >
              {item.fileName}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
