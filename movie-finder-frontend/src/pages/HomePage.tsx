import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoEmoji from '../components/LogoEmoji';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-700 to-teal-600 bg-clip-text text-transparent">
          Movie Finder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Search for any movie and get detailed information including ratings, plot, cast, and more!
        </p>
        <Link
          to="/search"
          className="inline-block px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          Start Searching
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white dark:bg-dark-200 p-6 rounded-lg shadow-lg text-center"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const features = [
  {
    icon: '🎥🎥🎥',
    title: 'Search Movies',
    description: 'Find any movie by title with our powerful search'
  },
  {
    icon: (<div className="inline-flex justify-center w-full -space-x-5">
      <LogoEmoji size="2em" />
      <LogoEmoji size="2em" />
      <LogoEmoji size="2em" />
    </div>
  ),
    title: 'Detailed Info',
    description: 'Get ratings, plot, cast, and technical details'
  },
  {
    icon: '🎥🎥🎥',
    title: 'Real-time Data',
    description: 'Up-to-date information from OMDb API'
  }
];

export default HomePage;
