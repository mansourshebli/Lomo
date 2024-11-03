import React, { useState, useEffect } from 'react';
import { FileText, Copy, Save, Clock, User, BookOpen, Palette, Trash } from 'lucide-react';
import { generateRecommendationLetter } from '../lib/cohere';

interface LetterRequest {
  id: string;
  teacherName: string;
  subject: string;
  style: string;
  content: string;
  studentName: string; // New field
  currentGrade: string; // New field
  dateCreated: string;
}

const RecommendationLetters: React.FC = () => {
  const [teacherName, setTeacherName] = useState('');
  const [subject, setSubject] = useState('');
  const [style, setStyle] = useState('formal');
  const [studentName, setStudentName] = useState(''); // New state
  const [currentGrade, setCurrentGrade] = useState(''); // New state
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedRequests, setSavedRequests] = useState<LetterRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LetterRequest | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recommendationRequests');
    if (saved) {
      setSavedRequests(JSON.parse(saved));
    }
  }, []);

  const handleGenerate = async () => {
    if (!teacherName || !subject || !studentName || !currentGrade) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const letter = await generateRecommendationLetter(teacherName, subject, style, studentName, currentGrade); // Include student info
      setGeneratedLetter(letter);
    } catch (error) {
      console.error('Error generating letter:', error);
      alert('Failed to generate letter. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!generatedLetter) return;

    const newRequest: LetterRequest = {
      id: Date.now().toString(),
      teacherName,
      subject,
      style,
      content: generatedLetter,
      studentName, // Save student name
      currentGrade, // Save current grade
      dateCreated: new Date().toLocaleString(),
    };

    const updatedRequests = [...savedRequests, newRequest];
    setSavedRequests(updatedRequests);
    localStorage.setItem('recommendationRequests', JSON.stringify(updatedRequests));
    
    // Clear inputs
    setTeacherName('');
    setSubject('');
    setStyle('formal');
    setStudentName('');
    setCurrentGrade('');
    setGeneratedLetter('');
  };

  const handleDelete = (id: string) => {
    const updatedRequests = savedRequests.filter(request => request.id !== id);
    setSavedRequests(updatedRequests);
    localStorage.setItem('recommendationRequests', JSON.stringify(updatedRequests));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert('Letter copied to clipboard!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Recommendation Letter Requests</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generator Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
            <FileText className="mr-2 text-blue-600 dark:text-blue-400" />
            Generate New Request
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                <User className="inline mr-2" />
                Teacher Name
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Mr. John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                <BookOpen className="inline mr-2" />
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Mathematics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                <Palette className="inline mr-2" />
                Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="academic">Academic</option>
              </select>
            </div>

            {/* New Fields for Student Info */}
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                <User className="inline mr-2" />
                Student Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                <User className="inline mr-2" />
                Current Grade
              </label>
              <input
                type="text"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 12th Grade"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Generating...' : 'Generate Request'}
            </button>
          </div>

          {generatedLetter && (
           <div className="mt-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
             {/* Split the generated letter into paragraphs */}
             {generatedLetter.split('\n').map((paragraph, index) => (
               <p key={index} className="mb-2 text-sm dark:text-white">
               {paragraph.trim()}
             </p>
           ))}
           </div>
          <div className="flex gap-2">
            <button
            onClick={handleCopy}
            className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300"
           >
            <Copy className="inline mr-2" size={16} />
         Copy
       </button>
       <button
        onClick={handleSave}
         className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
      >
        <Save className="inline mr-2" size={16} />
        Save
      </button>
    </div>
  </div>
)}

        </div>

        {/* Saved Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white flex items-center">
            <Clock className="mr-2 text-blue-600 dark:text-blue-400" />
            Saved Requests
          </h2>
          
          <div className="space-y-4">
            {savedRequests.map((request) => (
              <div
                key={request.id}
                className="border dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
                onClick={() => setSelectedRequest(request === selectedRequest ? null : request)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg dark:text-white">{request.teacherName}</h3>
                  <button onClick={() => handleDelete(request.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                    <Trash size={16} />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{request.subject}</p>
                <p className="text-gray-600 dark:text-gray-300">{request.dateCreated}</p>
                {selectedRequest === request && (
                  <div className="mt-2 bg-gray-100 dark:bg-gray-600 p-2 rounded-lg">
                    <p><strong>Your Name:</strong> {request.studentName}</p>
                    <p><strong>Current Grade:</strong> {request.currentGrade}</p>
                    <p className="whitespace-pre-wrap">{request.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationLetters;
