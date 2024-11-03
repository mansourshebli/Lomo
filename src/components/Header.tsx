import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`fixed w-full z-10 transition-all duration-300 ${isSticky ? 'bg-white bg-opacity-90 dark:bg-gray-800 dark:bg-opacity-90 shadow-md' : 'bg-blue-600 dark:bg-gray-800'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap size={32} className={isSticky ? 'text-blue-600 dark:text-white' : 'text-white'} />
          <span className={`text-2xl font-bold ${isSticky ? 'text-blue-600 dark:text-white' : 'text-white'}`}>Lomo</span>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link to="/deadline-calendar" className={`hover:text-blue-200 ${isSticky ? 'text-gray-800 dark:text-white' : 'text-white'}`}>Calendar</Link>
          <Link to="/essay-assistant" className={`hover:text-blue-200 ${isSticky ? 'text-gray-800 dark:text-white' : 'text-white'}`}>Essay Assistant</Link>
          <Link to="/recommendation-letters" className={`hover:text-blue-200 ${isSticky ? 'text-gray-800 dark:text-white' : 'text-white'}`}>Recommendations</Link>
          <Link to="/extracurricular-recommendations" className={`hover:text-blue-200 ${isSticky ? 'text-gray-800 dark:text-white' : 'text-white'}`}>Extracurriculars</Link>
          <Link to="/ai-college-counselor" className={`hover:text-blue-200 ${isSticky ? 'text-gray-800 dark:text-white' : 'text-white'}`}>AI Counselor</Link>
          <Link to="/university-database" className={`hover:text-blue-200 ${isSticky ? 'text-gray-800 dark:text-white' : 'text-white'}`}>Universities</Link>
        </nav>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-md ${isSticky ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : 'hover:bg-blue-700 dark:hover:bg-gray-700'} transition-colors`}
        >
          {isDarkMode ? <Sun size={24} className="text-white" /> : <Moon size={24} className={isSticky ? 'text-gray-800 dark:text-white' : 'text-white'} />}
        </button>
      </div>
    </header>
  );
};

export default Header;