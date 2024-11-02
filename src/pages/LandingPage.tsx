import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Lightbulb, MessageCircle, Database } from 'lucide-react';
import { RiDiscordFill } from 'react-icons/ri';
import { mockUniversities } from '../data/mockUniversities';

const LandingPage: React.FC = () => {
  return (
    <div className="sketch-bg min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-gray-800 dark:via-gray-900 dark:to-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Ace Your College Application <br/>with Lomo</h1>
          <p className="text-xl mb-12 text-blue-100">The Ultimate College Application Assistant</p>
          
          {/* University Logo Marquee */}
          <div className="relative w-full overflow-hidden py-12 marquee-container">
            <div className="animate-marquee">
              {[...mockUniversities, ...mockUniversities].map((uni, index) => (
                <div key={`${uni.id}-${index}`} className="flex-none w-48 h-24 bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center justify-center">
                  <img 
                    src={uni.logo} 
                    alt={uni.name}
                    className="max-h-16 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Our Powerful Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<PenTool size={48} />}
              title="AI Essay Writing Assistant"
              description="Craft compelling essays with our AI-powered editor and personalized suggestions."
              link="/essay-assistant"
            />
            <FeatureCard
              icon={<Lightbulb size={48} />}
              title="Extracurricular Recommendations"
              description="Discover activities that align with your athletic background and academic interests."
              link="/extracurricular-recommendations"
            />
            <FeatureCard
              icon={<MessageCircle size={48} />}
              title="AI College Counselor"
              description="Get instant answers to all your college application questions from our AI counselor."
              link="/ai-college-counselor"
            />
            <FeatureCard
              icon={<Database size={48} />}
              title="University Database"
              description="Explore a comprehensive database of universities and athletic programs."
              link="/university-database"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">Ready to Elevate Your College Application?</h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">Join thousands of students who have found success with Lomo.</p>
          
          {/* Join Discord Button */}
          <a 
            href="https://discord.gg/NRJrJQWB7F" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            <RiDiscordFill size={24} className="mr-2" />
            Join Discord Server
          </a>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; link: string }> = ({ icon, title, description, link }) => (
  <Link to={link} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
    <div className="text-blue-600 dark:text-blue-400 mb-6">{icon}</div>
    <h3 className="text-xl font-semibold mb-4 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </Link>
);

export default LandingPage;
