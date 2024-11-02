import React, { useState, useEffect } from 'react'
import { PenTool, Sparkles, Save, Smile } from 'lucide-react'
import { getEssayFeedback } from '../lib/cohere'

interface SavedEssay {
  id: string;
  title: string;
  content: string;
  emoji: string;
  notes: string;
  dateCreated: string;
}

const EssayAssistant: React.FC = () => {
  const [essay, setEssay] = useState('')
  const [feedback, setFeedback] = useState('')
  const [savedEssays, setSavedEssays] = useState<SavedEssay[]>([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [essayTitle, setEssayTitle] = useState('')
  const [essayEmoji, setEssayEmoji] = useState('📝')
  const [essayNotes, setEssayNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load saved essays from localStorage on component mount
  useEffect(() => {
    const savedEssaysData = localStorage.getItem('savedEssays')
    if (savedEssaysData) {
      setSavedEssays(JSON.parse(savedEssaysData))
    }

    // Load current essay draft if exists
    const draftEssay = localStorage.getItem('currentEssay')
    if (draftEssay) {
      setEssay(draftEssay)
    }

    const lastFeedback = localStorage.getItem('lastFeedback')
    if (lastFeedback) {
      setFeedback(lastFeedback)
    }
  }, [])

  // Save current essay draft when it changes
  useEffect(() => {
    localStorage.setItem('currentEssay', essay)
  }, [essay])

  // Save feedback when it changes
  useEffect(() => {
    localStorage.setItem('lastFeedback', feedback)
  }, [feedback])

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssay(e.target.value)
  }

  const generateFeedback = async () => {
    if (!essay.trim()) {
      setFeedback("Please write your essay first before requesting feedback.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getEssayFeedback(essay);
      setFeedback(response);
    } catch (error) {
      console.error('Error generating feedback:', error);
      setFeedback("Sorry, there was an error generating feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const saveEssay = () => {
    setShowSaveModal(true)
  }

  const handleSaveConfirm = () => {
    const newEssay: SavedEssay = {
      id: Date.now().toString(),
      title: essayTitle,
      content: essay,
      emoji: essayEmoji,
      notes: essayNotes,
      dateCreated: new Date().toLocaleString()
    }
    const updatedEssays = [...savedEssays, newEssay]
    setSavedEssays(updatedEssays)
    localStorage.setItem('savedEssays', JSON.stringify(updatedEssays))
    setShowSaveModal(false)
    setEssayTitle('')
    setEssayEmoji('📝')
    setEssayNotes('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AI Essay Writing Assistant</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <PenTool className="mr-2 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold dark:text-white">Your Essay</h2>
          </div>
          <textarea
            className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={essay}
            onChange={handleEssayChange}
            placeholder="Start writing your essay here..."
          ></textarea>
          <div className="flex justify-between mt-4">
            <button
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
              onClick={generateFeedback}
              disabled={isLoading}
            >
              <Sparkles className="mr-2" />
              {isLoading ? 'Generating...' : 'Generate Feedback'}
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition duration-300"
              onClick={saveEssay}
            >
              <Save className="mr-2" />
              Save Essay
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="mr-2 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold dark:text-white">AI Feedback</h2>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg h-64 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : feedback ? (
              <div 
                className="dark:text-white whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: feedback }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Generate feedback to see AI suggestions here.</p>
            )}
          </div>
        </div>
      </div>
      {savedEssays.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Saved Essays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedEssays.map(savedEssay => (
              <div key={savedEssay.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{savedEssay.emoji}</span>
                  <h3 className="text-lg font-semibold dark:text-white">{savedEssay.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Created: {savedEssay.dateCreated}</p>
                <p className="text-sm dark:text-gray-300">{savedEssay.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Save Essay</h2>
            <input
              type="text"
              placeholder="Essay Title"
              value={essayTitle}
              onChange={(e) => setEssayTitle(e.target.value)}
              className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            />
            <div className="flex items-center mb-4">
              <Smile className="mr-2" />
              <select
                value={essayEmoji}
                onChange={(e) => setEssayEmoji(e.target.value)}
                className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="📝">📝</option>
                <option value="✍️">✍️</option>
                <option value="🎓">🎓</option>
                <option value="💡">💡</option>
                <option value="🏆">🏆</option>
              </select>
            </div>
            <textarea
              placeholder="Notes"
              value={essayNotes}
              onChange={(e) => setEssayNotes(e.target.value)}
              className="w-full p-2 mb-4 border rounded h-24 resize-none dark:bg-gray-700 dark:text-white"
            ></textarea>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition duration-300"
                onClick={() => setShowSaveModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                onClick={handleSaveConfirm}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EssayAssistant