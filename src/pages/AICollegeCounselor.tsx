import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, User, Sparkles, Trash2 } from 'lucide-react'
import { getCounselorResponse } from '../lib/cohere'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  isTyping?: boolean
}

const AICollegeCounselor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your AI College Counselor. How can I assist you with your college application process today?", sender: 'ai' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages))
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const formatMessageText = (text: string) => {
    // Format text for bullet points and line breaks
    return text
      .split('\n')
      .map(line => line.startsWith('- ') ? `<li>${line.slice(2)}</li>` : `<p>${line}</p>`)
      .join('')
      .replace(/<\/p><p>/g, '<br/>') // Ensure line breaks for new paragraphs
      .replace(/<p>- <\/p>/g, '<ul>') // Add <ul> around bullet points
      .replace(/<\/p>/g, '</p></ul>') // Close <ul> tag
  }

  const handleSend = async () => {
    if (input.trim() && !isTyping) {
      const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' }
      setMessages(prev => [...prev, userMessage])
      setInput('')
      setIsTyping(true)

      try {
        const response = await getCounselorResponse(input)
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: formatMessageText(response),
          sender: 'ai'
        }
        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('Error getting AI response:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I apologize, but I'm having trouble responding right now. Please try again.",
          sender: 'ai'
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsTyping(false)
      }
    }
  }

  const handleClearChat = () => {
    setMessages([
      { id: '1', text: "Hello! I'm your AI College Counselor. How can I assist you with your college application process today?", sender: 'ai' }
    ])
    localStorage.removeItem('chatHistory')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl p-6 flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-full">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI College Counselor</h1>
            <p className="text-blue-100">Your 24/7 college application guide</p>
          </div>
          <button onClick={handleClearChat} className="ml-auto text-white bg-red-500 hover:bg-red-600 p-2 rounded-lg">
            <Trash2 size={20} />
          </button>
        </div>
        
        <div className="chat-container rounded-b-2xl p-6 h-[60vh] flex flex-col">
          <div className="flex-grow overflow-y-auto mb-4 space-y-6 pr-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 ml-3' 
                      : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 mr-3'
                  }`}>
                    {message.sender === 'user' ? (
                      <User size={20} className="text-white" />
                    ) : (
                      <Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div 
                    className={`p-4 rounded-2xl message-bubble ${
                      message.sender === 'user' 
                        ? 'user-message text-white' 
                        : 'ai-message text-gray-800 dark:text-white'
                    }`}
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about college applications..."
              className="flex-grow p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-300"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-xl transition-all duration-300 shadow-lg ${
                isTyping || !input.trim() 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
              }`}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AICollegeCounselor
