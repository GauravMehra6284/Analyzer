import {
  DocumentTextIcon,
  ChartBarIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [backendMessage, setBackendMessage] = useState('');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [stats, setStats] = useState([]);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/sample/')
      .then((res) => setBackendMessage(res.data.message))
      .catch((err) => console.error("Failed to fetch backend sample:", err));

    axios.get('http://127.0.0.1:8000/api/current-analysis/')
      .then((res) => setCurrentAnalysis(res.data))
      .catch((err) => console.error("Current analysis fetch error:", err));

    axios.get('http://127.0.0.1:8000/api/dashboard-stats/')
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Dashboard stats fetch error:", err));

    axios.get('http://127.0.0.1:8000/api/recent-analyses/')
      .then((res) => {
        console.log("Recent Analyses from backend:", res.data);
        setRecentAnalyses(res.data);
      })
      .catch((err) => console.error("Recent analyses fetch error:", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
            <p className="text-purple-100 text-lg">Ready to optimize your resume and land your dream job?</p>
            {backendMessage && (
              <p className="mt-2 text-sm bg-purple-700 px-4 py-2 rounded-lg inline-block">
                🧠 Backend says: {backendMessage}
              </p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link to="/upload" className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm">
            Upload New Resume
          </Link>
          <Link to="/analysis" className="border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors backdrop-blur-sm">
            View Latest Analysis
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(stats.length ? stats : getDefaultStats()).map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                  <span className="text-gray-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Analysis & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Analysis</h3>
          {currentAnalysis ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Latest Resume Analysis</h4>
                  <p className="text-sm text-gray-600">ATS Score: {currentAnalysis.atsScore}%</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{currentAnalysis.atsScore}%</div>
                  <div className="text-xs text-gray-500">ATS Compatible</div>
                </div>
              </div>
              <Link to="/analysis" className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                View Full Analysis
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No resume analyzed yet</p>
              <Link to="/upload" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
                Upload Your First Resume
              </Link>
            </div>
          )}
        </div>

        {/* Recent Analyses */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Analyses</h3>
            <Link to="/history" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentAnalyses.length === 0 ? (
              <p className="text-sm text-gray-500">No recent analyses available.</p>
            ) : (
              recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{analysis.name}</p>
                      <p className="text-xs text-gray-500">{analysis.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{analysis.score}%</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      analysis.score >= 90 ? 'bg-green-100 text-green-800' :
                      analysis.score >= 80 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {analysis.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard to="/upload" icon={DocumentTextIcon} title="Upload Resume" desc="Analyze a new resume" />
          <ActionCard to="/job-matching" icon={BriefcaseIcon} title="Find Jobs" desc="Match with job openings" />
          <ActionCard to="/skill-gap" icon={AcademicCapIcon} title="Skill Analysis" desc="Identify skill gaps" />
        </div>
      </div>
    </div>
  );
}

// Default fallback if API doesn't return anything (optional)
function getDefaultStats() {
  return [
    { name: 'Total Resumes Analyzed', value: '0', icon: DocumentTextIcon, color: 'bg-blue-500', change: '0%' },
    { name: 'Average ATS Score', value: '0%', icon: ChartBarIcon, color: 'bg-green-500', change: '0%' },
    { name: 'Job Matches Found', value: '0', icon: BriefcaseIcon, color: 'bg-purple-500', change: '0%' },
    { name: 'Skills Improved', value: '0', icon: AcademicCapIcon, color: 'bg-orange-500', change: '0%' },
  ];
}

function getDefaultRecentAnalyses() {
  return [];
}

function ActionCard({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
      <Icon className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mr-3" />
      <div>
        <h4 className="font-medium text-gray-900 group-hover:text-purple-900">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}
