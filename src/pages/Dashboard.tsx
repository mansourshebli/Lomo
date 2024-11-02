import React from 'react'
import { Link } from 'react-router-dom'
import { PenTool, Lightbulb, MessageCircle, Database, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Please sign in to access your dashboard</h1>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardCard
          title="Application Progress"
          content={
            <div className="space-y-2">
              <ProgressItem label="Personal Information" completed={true} />
              <ProgressItem label="Essay Draft" completed={true} />
              <ProgressItem label="Extracurricular Activities" completed={false} />
              <ProgressItem label="University Shortlist" completed={false} />
            </div>
          }
        />
        <DashboardCard
          title="Upcoming Deadlines"
          content={
            <ul className="space-y-2">
              <li>Essay Submission - May 1, 2024</li>
              <li>Stanford Early Action - November 1, 2023</li>
              <li>Common App Deadline - January 1, 2024</li>
            </ul>
          }
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionCard
          icon={<PenTool />}
          title="Continue Essay"
          description="Pick up where you left off on your personal statement."
          link="/essay-assistant"
        />
        <QuickActionCard
          icon={<Lightbulb />}
          title="Explore Activities"
          description="Discover new extracurricular opportunities."
          link="/extracurricular-recommendations"
        />
        <QuickActionCard
          icon={<MessageCircle />}
          title="Ask AI Counselor"
          description="Get instant answers to your application questions."
          link="/ai-college-counselor"
        />
        <QuickActionCard
          icon={<Database />}
          title="Research Universities"
          description="Explore and compare potential schools."
          link="/university-database"
        />
      </div>
    </div>
  )
}

const DashboardCard: React.FC<{ title: string; content: React.ReactNode }> = ({ title, content }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {content}
  </div>
)

const ProgressItem: React.FC<{ label: string; completed: boolean }> = ({ label, completed }) => (
  <div className="flex items-center">
    <CheckCircle className={`mr-2 ${completed ? 'text-green-500' : 'text-gray-300'}`} />
    <span className={completed ? 'text-gray-800' : 'text-gray-500'}>{label}</span>
  </div>
)

const QuickActionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string }> = ({ icon, title, description, link }) => (
  <Link to={link} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Link>
)

export default Dashboard