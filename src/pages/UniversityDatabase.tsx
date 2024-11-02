import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, MapPin, Award, DollarSign, GraduationCap, Percent } from 'lucide-react';
import { mockUniversities } from '../data/mockUniversities';

interface Location {
  city: string;
  state: string;
  country: string;
}

interface University {
  id: number;
  name: string;
  logo: string;
  description: string;
  sat_average: string;
  acceptance_rate: string;
  popular_majors: string[];
  tuition: string;
  us_news_rank: string;
  location: Location;
  web_pages?: string[]; // Make web_pages optional
}

const UniversityDatabase: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const universitiesPerPage = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setUniversities(mockUniversities);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.location.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = filteredUniversities.slice(indexOfFirstUniversity, indexOfLastUniversity);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">University Database</h1>
      <div className="mb-8 flex max-w-2xl mx-auto">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search universities..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 pl-10 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <Search className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 transition duration-300">
          <Filter />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentUniversities.map(uni => (
          <UniversityCard key={uni.id} university={uni} onClick={() => setSelectedUniversity(uni)} />
        ))}
      </div>
      <Pagination
        universitiesPerPage={universitiesPerPage}
        totalUniversities={filteredUniversities.length}
        paginate={paginate}
        currentPage={currentPage}
      />
      {selectedUniversity && (
        <UniversityModal university={selectedUniversity} onClose={() => setSelectedUniversity(null)} />
      )}
      <div className="text-center mt-8 text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-2">
        <span>Powered by</span>
        <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/U.S._News_%26_World_Report_logo.svg/2560px-U.S._News_%26_World_Report_logo.svg.png"
        alt="US News logo"
        className="h-6"
      />
</div>

    </div>
  );
};

const UniversityCard: React.FC<{ university: University; onClick: () => void }> = ({ university, onClick }) => (
  <div 
    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    onClick={onClick}
  >
    <div className="flex justify-center mb-4">
      <img 
        src={university.logo} 
        alt={`${university.name} logo`}
        className="h-24 w-auto object-contain"
      />
    </div>
    <h3 className="text-xl font-semibold text-center mb-3 dark:text-white">{university.name}</h3>
    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
      <div className="flex items-center">
        <MapPin size={16} className="mr-2" />
        <span>{`${university.location.city}, ${university.location.state}`}</span>
      </div>
      <div className="flex items-center">
        <Award size={16} className="mr-2" />
        <span>{university.us_news_rank} National Rank</span>
      </div>
      <div className="flex items-center">
        <Percent size={16} className="mr-2" />
        <span>{university.acceptance_rate} acceptance rate</span>
      </div>
    </div>
  </div>
);

const UniversityModal: React.FC<{ university: University; onClose: () => void }> = ({ university, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <img src={university.logo} alt={`${university.name} logo`} className="h-16 w-auto mr-4" />
          <h2 className="text-2xl font-bold dark:text-white">{university.name}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Overview</h3>
            <p className="text-gray-600 dark:text-gray-300">{university.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Location</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {`${university.location.city}, ${university.location.state}, ${university.location.country}`}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Popular Majors</h3>
            <div className="flex flex-wrap gap-2">
              {university.popular_majors.map((major, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {major}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <StatsCard
              icon={<GraduationCap size={20} />}
              label="SAT Range"
              value={university.sat_average}
            />
            <StatsCard
              icon={<Percent size={20} />}
              label="Acceptance Rate"
              value={university.acceptance_rate}
            />
            <StatsCard
              icon={<DollarSign size={20} />}
              label="Annual Tuition"
              value={university.tuition}
            />
            <StatsCard
              icon={<Award size={20} />}
              label="National Rank"
              value={university.us_news_rank}
            />
          </div>
        </div>
      </div>

      {university.web_pages && university.web_pages.length > 0 && (
        <div className="mt-6">
          <a
            href={university.web_pages[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Visit Website
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </div>
  </div>
);

const StatsCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
    {icon}
    <div className="ml-4">
      <h4 className="text-sm font-medium dark:text-white">{label}</h4>
      <p className="text-lg font-semibold dark:text-gray-300">{value}</p>
    </div>
  </div>
);

const Pagination: React.FC<{ universitiesPerPage: number; totalUniversities: number; paginate: (pageNumber: number) => void; currentPage: number }> = ({
  universitiesPerPage,
  totalUniversities,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalUniversities / universitiesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-6">
      <ul className="flex space-x-1">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                number === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              } hover:bg-blue-500 hover:text-white`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default UniversityDatabase;
