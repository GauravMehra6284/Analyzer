"use client";
import React, { useEffect, useState } from 'react';
import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  StarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

const ScoreCircle = ({ score, label, color = 'purple' }) => {
  const displayScore = typeof score === 'number' ? score : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  const colorClasses = {
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={colorClasses[color] || 'text-purple-600'}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{Number.isFinite(displayScore) ? displayScore : 0}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700 mt-2 text-center">{label}</p>
    </div>
  );
};

export default function AnalysisResults({ analysis }) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayAnalysis, setDisplayAnalysis] = useState(null);

  useEffect(() => {
  try {
    if (analysis && typeof analysis === 'object') {
      const resumeData = analysis.analysis || analysis; // 👈 handles nested case

      const technical = resumeData.skills?.technical || [];
      const soft = resumeData.skills?.soft || [];
      const tools = resumeData.skills?.tools || [];

      setDisplayAnalysis({
        fileName: analysis.file_name || "resume.pdf",
        atsScore: Number(resumeData.ats_score) || 0,
        clarityScore: Number(resumeData.clarity_score) || 0,
        skills: [...technical, ...soft, ...tools],
        strengths: Array.isArray(resumeData.strengths) ? resumeData.strengths : [],
        weaknesses: Array.isArray(resumeData.weaknesses) ? resumeData.weaknesses : [],
        education: resumeData.education || "Not provided",
        experience: resumeData.experience || "Not provided",
        trend: resumeData.trend || "neutral"
      });
    } else {
      console.error("Invalid analysis object", analysis);
    }
  } catch (error) {
    console.error("Error processing analysis:", error);
  } finally {
    setIsLoading(false);
  }
}, [analysis]);


  if (isLoading) return <LoadingState />;
  if (!displayAnalysis) return <EmptyState />;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Header />
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <AnalysisHeader analysis={displayAnalysis} />
        <ScoreSection analysis={displayAnalysis} />
        <div className="space-y-8">
          <StrengthsWeaknessesSection analysis={displayAnalysis} />
          <SkillsSection analysis={displayAnalysis} />
          <EducationExperienceSection analysis={displayAnalysis} />
        </div>
      </div>
    </div>
  );
}

// Subcomponents (keep unchanged or update as needed)
function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-20">
        <ArrowPathIcon className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Resume</h2>
        <p className="text-gray-600">Processing your resume...</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center py-12">
        <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analysis Available</h2>
        <p className="text-gray-600 mb-6">Upload a resume to see detailed results</p>
        <a
          href="/upload"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          Upload Resume
        </a>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Analysis Results</h1>
      <p className="text-lg text-gray-600">Detailed breakdown of your resume's performance</p>
    </div>
  );
}

function AnalysisHeader({ analysis }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{analysis.fileName}</h2>
        <p className="text-gray-600">Last analyzed: {new Date().toLocaleDateString()}</p>
      </div>
      <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
        <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
        <span className="text-green-800 font-medium">
          {analysis.trend === 'up' ? 'Improved' : 
           analysis.trend === 'down' ? 'Needs work' : 'New analysis'}
        </span>
      </div>
    </div>
  );
}

function ScoreSection({ analysis }) {
  const text = `${analysis.experience} ${analysis.education}`.toLowerCase();

  const skillCount = analysis.skills.length;
  const toolKeywords = [
    'git', 'docker', 'kubernetes', 'vscode', 'postman', 'anaconda',
    'jupyter', 'mysql', 'mongodb', 'linux', 'tensorflow', 'keras', 'pytorch'
  ];

  const keywordHits = [
    'agile', 'ci/cd', 'cloud', 'api', 'machine learning', 'deep learning',
    'data science', 'nlp', 'ai', 'ml', 'computer vision', 'react', 'node'
  ];

  const actionVerbs = [
    'developed', 'built', 'created', 'managed', 'led', 'designed', 'initiated',
    'increased', 'launched', 'collaborated', 'executed', 'achieved'
  ];

  const passivePhrases = ['responsible for', 'tasked with', 'involved in'];

  const numberMentions = analysis.experience.match(/\d+%|\$\d+|\d+\+/g) || [];

  const foundTools = toolKeywords.filter(tool =>
    analysis.skills.join(' ').toLowerCase().includes(tool)
  );

  const foundKeywords = keywordHits.filter(kw => text.includes(kw));
  const foundActions = actionVerbs.filter(verb => text.includes(verb));
  const passiveMatches = passivePhrases.filter(p => text.includes(p));

  const atsScore = Math.min(100,
    skillCount * 2 +
    foundTools.length * 2 +
    foundKeywords.length * 3 +
    numberMentions.length * 3 +
    (foundActions.length > 3 ? 10 : 0) +
    (passiveMatches.length === 0 ? 5 : -5) +
    (analysis.weaknesses.length <= 1 ? 10 : 0) +
    (analysis.experience.length > 300 ? 5 : 0)
  );

  const avgSentenceLength = analysis.experience.split('.').reduce((acc, sentence) =>
    acc + sentence.trim().split(/\s+/).length, 0) / (analysis.experience.split('.').length || 1);

  const hasBullets = analysis.experience.includes('•') || analysis.experience.includes('- ');
  const hasDegree = /(btech|b\.tech|mtech|bachelor|master|degree)/.test(text);
  const structureComplete = analysis.experience && analysis.education && analysis.strengths;
  const clearLanguage = avgSentenceLength < 25;
  const goodFormatting = hasBullets;

  const clarityScore = Math.max(0, Math.min(100,
    (analysis.strengths.length * 2) +
    (-3 * analysis.weaknesses.length) +
    (clearLanguage ? 10 : 0) +
    (goodFormatting ? 10 : 0) +
    (hasDegree ? 10 : 0) +
    (structureComplete ? 20 : 0)
  ));

  const overallScore = Math.round((atsScore + clarityScore) / 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <ScoreCircle score={atsScore} label="ATS Score (est.)" color="purple" />
      <ScoreCircle score={clarityScore} label="Clarity Score (est.)" color="blue" />
      <ScoreCircle score={overallScore} label="Overall Score (est.)" color="green" />
    </div>
  );
}



function StrengthsWeaknessesSection({ analysis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
          Strengths
        </h3>
        <ul className="space-y-3">
          {analysis.strengths.map((strength, index) => (
            <li key={index} className="flex items-start">
              <StarIcon className="w-4 h-4 text-yellow-500 mt-1 mr-2" />
              <span className="text-gray-800">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 mr-2" />
          Areas for Improvement
        </h3>
        <ul className="space-y-3">
          {analysis.weaknesses.length > 0 ? (
            analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-800">{weakness}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No weaknesses identified</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function SkillsSection({ analysis }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ChartBarIcon className="w-5 h-5 text-blue-600 mr-2" />
        Skills Match
      </h3>
      <div className="flex flex-wrap gap-3">
        {analysis.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function EducationExperienceSection({ analysis }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
        <p className="text-gray-800">{analysis.education}</p>
      </div>
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
        <p className="text-gray-800">{analysis.experience}</p>
      </div>
    </div>
  );
}
