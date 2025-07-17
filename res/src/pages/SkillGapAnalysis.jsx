import {
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  PlayIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon as TrendingUpIcon, // ✅ FIXED: Correct import name
} from '@heroicons/react/24/outline'

const skillGaps = [
  {
    skill: 'TypeScript',
    currentLevel: 30,
    requiredLevel: 85,
    importance: 'High',
    demandScore: 92,
    courses: [
      {
        title: 'TypeScript Fundamentals',
        provider: 'Udemy',
        duration: '12 hours',
        rating: 4.8,
        students: '45,000',
        price: '$89',
        level: 'Beginner',
      },
      {
        title: 'Advanced TypeScript',
        provider: 'Pluralsight',
        duration: '8 hours',
        rating: 4.6,
        students: '23,000',
        price: '$29/month',
        level: 'Advanced',
      },
    ],
  },
  {
    skill: 'AWS Cloud Services',
    currentLevel: 20,
    requiredLevel: 75,
    importance: 'High',
    demandScore: 88,
    courses: [
      {
        title: 'AWS Certified Solutions Architect',
        provider: 'AWS Training',
        duration: '40 hours',
        rating: 4.7,
        students: '125,000',
        price: '$199',
        level: 'Intermediate',
      },
      {
        title: 'AWS for Beginners',
        provider: 'Coursera',
        duration: '20 hours',
        rating: 4.5,
        students: '67,000',
        price: '$49/month',
        level: 'Beginner',
      },
    ],
  },
  {
    skill: 'Docker & Kubernetes',
    currentLevel: 40,
    requiredLevel: 80,
    importance: 'Medium',
    demandScore: 85,
    courses: [
      {
        title: 'Docker & Kubernetes Complete Guide',
        provider: 'Udemy',
        duration: '22 hours',
        rating: 4.6,
        students: '89,000',
        price: '$119',
        level: 'Intermediate',
      },
    ],
  },
  {
    skill: 'GraphQL',
    currentLevel: 15,
    requiredLevel: 70,
    importance: 'Medium',
    demandScore: 78,
    courses: [
      {
        title: 'GraphQL with React',
        provider: 'Frontend Masters',
        duration: '6 hours',
        rating: 4.4,
        students: '12,000',
        price: '$39/month',
        level: 'Intermediate',
      },
    ],
  },
]

const ProgressBar = ({ current, required }) => {
  const gap = required - current

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Current Level</span>
        <span className="text-gray-600">{current}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${current}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm">
        <span className="font-medium">Required Level</span>
        <span className="text-gray-600">{required}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${required}%` }}
        ></div>
      </div>

      <div className="bg-orange-50 p-3 rounded-lg">
        <p className="text-orange-800 text-sm">
          <strong>Gap:</strong> {gap}% improvement needed
        </p>
      </div>
    </div>
  )
}

const CourseCard = ({ course }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
        <p className="text-sm text-gray-600">{course.provider}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-green-600">{course.price}</div>
        <div className="text-xs text-gray-500">{course.level}</div>
      </div>
    </div>

    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
      <div className="flex items-center">
        <ClockIcon className="w-4 h-4 mr-1" />
        {course.duration}
      </div>
      <div className="flex items-center">
        <StarIcon className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
        {course.rating}
      </div>
      <div className="flex items-center">
        <AcademicCapIcon className="w-4 h-4 mr-1" />
        {course.students}
      </div>
    </div>

    <button className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors">
      <PlayIcon className="w-4 h-4 mr-2" />
      Start Learning
    </button>
  </div>
)

export default function SkillGapAnalysis() {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-10 px-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Skill Gap Analysis</h1>
            <p className="text-orange-100 text-lg">
              Identify missing skills and accelerate your career growth
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{skillGaps.length}</div>
              <div className="text-orange-100">Skills to Improve</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Gaps</p>
              <p className="text-3xl font-bold text-red-600">2</p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="text-3xl font-bold text-yellow-600">2</p>
            </div>
            <TrendingUpIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses Available</p>
              <p className="text-3xl font-bold text-blue-600">7</p>
            </div>
            <AcademicCapIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Est. Learning Time</p>
              <p className="text-3xl font-bold text-green-600">108h</p>
            </div>
            <ClockIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Skill Gaps */}
      <div className="space-y-6">
        {skillGaps.map((gap, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{gap.skill}</h3>
                <p className="text-gray-600">
                  Market demand: {gap.demandScore}% • {gap.courses.length} courses available
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                  gap.importance
                )}`}
              >
                {gap.importance} Priority
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProgressBar current={gap.currentLevel} required={gap.requiredLevel} />
              </div>
              <div className="lg:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-4">Recommended Courses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gap.courses.map((course, courseIndex) => (
                    <CourseCard key={courseIndex} course={course} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
