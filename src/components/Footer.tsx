import React from 'react';
import { MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Lomo</h3>
            <p className="text-sm">Empowering student-athletes to achieve their college dreams.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-300">About Us</a></li>
              <li><a href="#" className="hover:text-blue-300">Contact</a></li>
              <li><a href="#" className="hover:text-blue-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-300">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Features</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-300">Essay Assistant</a></li>
              <li><a href="#" className="hover:text-blue-300">Extracurricular Recommendations</a></li>
              <li><a href="#" className="hover:text-blue-300">AI College Counselor</a></li>
              <li><a href="#" className="hover:text-blue-300">University Database</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex">
              <a href="#" className="hover:text-blue-300"><MessageCircle size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Lomo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;