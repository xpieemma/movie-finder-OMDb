import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">About Movie Finder</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Your go-to source for movie information
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-200 rounded-lg shadow-lg p-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Movie Finder uses the OMDb API to provide you with comprehensive information about movies. 
          Simply search for a movie title and get instant access to ratings, plot summaries, cast information, and more.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          The application is built with modern web technologies including React, TypeScript, 
          Tailwind CSS, and Framer Motion for smooth animations.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-dark-200 rounded-lg shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {techStack.map(tech => (
            <div key={tech.name} className="text-center p-4 bg-gray-50 dark:bg-dark-300 rounded-lg">
              <div className="text-2xl mb-2">{tech.icon}</div>
              <div className="font-medium">{tech.name}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const techStack = [
  { name: 'React', icon: '⚛️' },
  { name: 'TypeScript', icon: '🎥🎥🎥' },
  { name: 'Tailwind CSS', icon: '🎥🎥🎥' },
  { name: 'Framer Motion', icon: '🎥🎥🎥' },
  { name: 'Vite', icon: '⚡' },
  { name: 'OMDb API', icon: '🎥🎥🎥' },
];

export default AboutPage;
