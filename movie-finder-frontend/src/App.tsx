import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import AboutPage from './pages/AboutPage';
import { useKeepAlive } from './hooks/useKeepAlive';

function App() {
  useKeepAlive();

  useEffect(() => {
    console.log('🎥🎥🎥 App started', {
      environment: import.meta.env.MODE,
      apiUrl: import.meta.env.VITE_API_URL,
      isVercel: !!import.meta.env.VERCEL,
    });
  }, []);

  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        
       
        <div className="fixed inset-0 pointer-events-none opacity-5 flex items-center justify-center z-0">
          <img src="/movie-finder-logo.svg" className="w-96 h-96" alt="" />
        </div>
        
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
