import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function UploadResume({ onAnalysisComplete }) {
  const navigate = useNavigate()
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf'
    )

    if (droppedFiles.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...droppedFiles.map((file) => ({
          file,
          id: Date.now() + Math.random(),
          status: 'ready',
        })),
      ])
    }
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      (file) => file.type === 'application/pdf'
    )

    if (selectedFiles.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...selectedFiles.map((file) => ({
          file,
          id: Date.now() + Math.random(),
          status: 'ready',
        })),
      ])
    }
  }

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const simulateAnalysis = async (fileObj) => {
    const formData = new FormData()
    formData.append('file', fileObj.file)

    try {
      setUploading(true)

      const response = await fetch('http://localhost:8000/api/upload-resume/', {
        method: 'POST',
        body: formData,
      })

      setUploading(false)
      setAnalyzing(true)

      const result = await response.json()
      setAnalyzing(false)

      if (response.ok) {
        const normalized = {
          fileName: result.analysis.file_name,
          atsScore: result.analysis.ats_score,
          clarityScore: result.analysis.clarity_score,
          skills: result.analysis.skills_match || [],
          strengths: result.analysis.strengths || [],
          weaknesses: result.analysis.weaknesses || [],
          education: result.analysis.education,
          experience: result.analysis.experience,
          trend: result.analysis.trend,
          status: result.analysis.status,
          previousScore: result.analysis.previous_score || 0,
        }

        // Step 1: Save to backend history
await fetch('http://localhost:8000/api/analyses/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(normalized),
});

// Step 2: Trigger frontend update
onAnalysisComplete(normalized);

// Step 3: Navigate
navigate('/analysis');
// Redirect to analysis page after successful analysis

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileObj.id ? { ...f, status: 'completed' } : f
          )
        )
      } else {
        alert(result.error || 'Something went wrong during analysis.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploading(false)
      setAnalyzing(false)
      alert('Failed to connect to backend server.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Resume</h1>
        <p className="text-lg text-gray-600">Get instant AI-powered analysis and improve your job prospects</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div
          className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drop your resume here, or click to browse
          </h3>
          <p className="text-gray-600 mb-4">Supports PDF files up to 10MB</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
          >
            Choose Files
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
          <div className="space-y-3">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900">{fileObj.file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {fileObj.status === 'ready' && (
                    <>
                      <button
                        onClick={() => simulateAnalysis(fileObj)}
                        disabled={uploading || analyzing}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50"
                      >
                        Analyze
                      </button>
                      <button
                        onClick={() => removeFile(fileObj.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {fileObj.status === 'completed' && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Analyzed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(uploading || analyzing) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <DocumentTextIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {uploading ? 'Uploading Resume...' : 'Analyzing with AI...'}
            </h3>
            <p className="text-gray-600 mb-4">
              {uploading
                ? 'Securely uploading your resume to our servers'
                : 'Our AI is analyzing your resume for ATS compatibility, skills, and job matches'}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: uploading ? '30%' : '70%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">This usually takes 10-15 seconds</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Tips for Best Results</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Use a clean, professional PDF format</li>
              <li>• Include relevant keywords for your target role</li>
              <li>• Quantify your achievements with numbers and metrics</li>
              <li>• Keep your resume to 1-2 pages maximum</li>
              <li>• Use standard section headings (Experience, Education, Skills)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}