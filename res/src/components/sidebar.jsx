import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  DocumentArrowUpIcon, 
  ChartBarIcon, 
  BriefcaseIcon, 
  AcademicCapIcon, 
  ClockIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Upload Resume', href: '/upload', icon: DocumentArrowUpIcon },
  { name: 'Analysis Results', href: '/analysis', icon: ChartBarIcon },
  { name: 'Job Matching', href: '/job-matching', icon: BriefcaseIcon },
  { name: 'Skill Gap Analysis', href: '/skill-gap', icon: AcademicCapIcon },
  { name: 'History', href: '/history', icon: ClockIcon },
]

export default function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="flex h-full flex-col bg-white shadow-xl border-r border-gray-200">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RA</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <Bars3Icon className="w-5 h-5 text-gray-600" />
            ) : (
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} flex-shrink-0`} />
                {!isCollapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john@example.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}