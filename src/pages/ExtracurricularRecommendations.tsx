import React, { useState, useEffect } from 'react'
import { Lightbulb, Plus, Check, X } from 'lucide-react'
import { generateActivities } from '../lib/cohere'

interface Activity {
  id: number
  name: string
  description: string
  added: boolean
}

const ExtracurricularRecommendations: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, name: 'Volunteer Coach for Youth Sports', description: 'Share your athletic skills by coaching younger athletes in your sport.', added: false },
    { id: 2, name: 'Sports Analytics Club', description: 'Start or join a club that analyzes sports data and statistics.', added: false },
    { id: 3, name: 'Athletic Leadership Program', description: 'Participate in a program that develops leadership skills in student-athletes.', added: false },
    { id: 4, name: 'Sports Journalism', description: 'Write for your school newspaper or start a sports blog.', added: false },
  ])
  const [savedActivities, setSavedActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load saved activities from localStorage on component mount
  useEffect(() => {
    const savedActivitiesData = localStorage.getItem('savedActivities')
    if (savedActivitiesData) {
      setSavedActivities(JSON.parse(savedActivitiesData))
      // Update the 'added' status in activities list
      const savedIds = JSON.parse(savedActivitiesData).map((a: Activity) => a.id)
      setActivities(activities.map(activity => ({
        ...activity,
        added: savedIds.includes(activity.id)
      })))
    }
  }, [])

  // Save activities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedActivities', JSON.stringify(savedActivities))
  }, [savedActivities])

  const toggleActivity = (id: number) => {
    const activity = activities.find(a => a.id === id)
    if (activity) {
      if (activity.added) {
        setSavedActivities(savedActivities.filter(a => a.id !== id))
      } else {
        setSavedActivities([...savedActivities, { ...activity, added: true }])
      }
      setActivities(activities.map(a =>
        a.id === id ? { ...a, added: !a.added } : a
      ))
    }
  }

  const handleGenerateMore = async () => {
    setIsLoading(true)
    try {
      const newActivities = await generateActivities()
      const formattedActivities = newActivities.map((activity: any, index: number) => ({
        id: Date.now() + index,
        name: activity.name,
        description: activity.description,
        added: false
      }))
      setActivities(formattedActivities)
    } catch (error) {
      console.error('Error generating activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const recommendedActivities = activities.filter(activity => !activity.added)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Extracurricular Recommendations</h1>
      
      {savedActivities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Your Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedActivities.map(activity => (
              <div key={activity.id} className="bg-green-100 dark:bg-green-800 rounded-lg p-4 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold dark:text-white">{activity.name}</h3>
                  <button
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 dark:text-white">Recommended Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedActivities.map(activity => (
          <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold dark:text-white">{activity.name}</h3>
              <button
                className={`p-2 rounded-full ${activity.added ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                onClick={() => toggleActivity(activity.id)}
              >
                {activity.added ? <Check size={20} /> : <Plus size={20} />}
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300">{activity.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button 
          className={`bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center mx-auto transition duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          onClick={handleGenerateMore}
          disabled={isLoading}
        >
          <Lightbulb className="mr-2" />
          {isLoading ? 'Generating...' : 'Generate More Recommendations'}
        </button>
      </div>
    </div>
  )
}

export default ExtracurricularRecommendations