import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import LogoEmoji from './LogoEmoji';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/search', label: 'Search' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-white dark:bg-dark-200 shadow-lg">
      <div className="container-custom">
        
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl"><LogoEmoji size='1em' /></span>
            <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
              MovieFinder
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary-100 dark:bg-primary-900/20 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ?(
    <div className="flex space-x-1">
      <LogoEmoji size="2em" />
      <LogoEmoji size="2em" />
      <LogoEmoji size="2em" />
    </div>
  ) : '☀️'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
