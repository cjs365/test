'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/app/components/ui/theme-toggle';
import { useTheme } from '@/app/context/ThemeProvider';
import { useState, useEffect, useRef } from 'react';

type SearchResult = {
  title: string;
  description: string;
};

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle clicks outside of the search results to close the dropdown
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/search?keyword=${encodeURIComponent(searchQuery)}&limit=10`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setSearchResults(data.results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length > 1) {
      handleSearch();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (ticker: string) => {
    // Extract the ticker symbol from the title (e.g., "AAPL.US" -> "aapl.us")
    const formattedTicker = ticker.toLowerCase();
    router.push(`/stock/${formattedTicker}/overview`);
    setShowResults(false);
    setSearchQuery('');
  };

  const navItems = [
    { name: 'Equities', path: '/stock' },
    { name: 'Screener', path: '/screener' },
    { name: 'Markets', path: '/markets' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Macro', path: '/macro' },
    { name: 'Charting', path: '/charting' },
    { name: 'Analysis', path: '/analysis' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Navigation Bar */}
      <nav className={`navbar ${theme === 'dark' ? 'bg-gray-900 border-b border-gray-800' : 'bg-black'}`}>
        <div className="container mx-auto px-2">
          {/* Top Bar with Logo and Search */}
          <div className="flex items-center h-10">
            <Link href="/" className="navbar-brand shrink-0 text-sm">XXXXX</Link>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2/3">
                              <div className="relative" ref={searchRef}>
                  <input 
                    type="text" 
                    className={`w-full px-2 py-0.5 rounded border text-sm ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                        : 'bg-white text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                    placeholder="Search stocks, ETFs, or news..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  />
                  <button 
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                    onClick={handleSearch}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                  
                  {/* Search Results Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div 
                      className="fixed left-0 right-0 top-0 bottom-0 bg-transparent pointer-events-none z-[9999]"
                    >
                      <div 
                        className="pointer-events-auto absolute left-1/2 transform -translate-x-1/2"
                        style={{ 
                          width: '66.66%', 
                          top: '32px',
                        }}
                      >
                        <div className={`w-full rounded-md shadow-xl ${
                          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                        }`}>
                          {searchResults.map((result, index) => (
                            <div 
                              key={index}
                              className={`px-3 py-2 cursor-pointer ${
                                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                              }`}
                              onClick={() => handleResultClick(result.title)}
                            >
                              <div className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                {result.title}
                              </div>
                              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {result.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            </div>
            <div className="ml-auto flex items-center">
              <ThemeToggle />
              <button className="text-white text-sm ml-2">
                <i className="fas fa-user"></i>
              </button>
            </div>
          </div>

          {/* Navigation Links Below Search */}
          <div className="hidden md:flex space-x-3 py-0">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link text-sm ${pathname && pathname.startsWith(item.path) ? 'active' : ''} ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Market Indices Bar - Only shown on home page */}
      {isHomePage && (
        <div className={`py-3 border-b ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="container mx-auto">
            <div className={`flex gap-8 ${theme === 'dark' ? 'border-x border-gray-700' : 'border-x border-gray-200'}`}>
              {/* Equity Indices Section */}
              <div className="w-[500px] px-8">
                <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium mb-2 ml-1`}>Equity Indices</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">S&P 500</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>5,908.03</div>
                    <div className="text-red-500 text-xs leading-tight">▼ 0.07%</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">Nasdaq</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>19,117.24</div>
                    <div className="text-red-500 text-xs leading-tight">▼ 0.31%</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">FTSE 100</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>8,786.09</div>
                    <div className="text-green-500 text-xs leading-tight">▲ 0.90%</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">Dow Jones</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>42,221.99</div>
                    <div className="text-green-500 text-xs leading-tight">▲ 0.01%</div>
                  </div>
                </div>
              </div>

              {/* Commodities Section */}
              <div className="w-[240px] px-8">
                <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium mb-2 ml-1`}>Commodities</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">Gold</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>2,175.89</div>
                    <div className="text-green-500 text-xs leading-tight">▲ 0.45%</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">Crude Oil</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>82.79</div>
                    <div className="text-red-500 text-xs leading-tight">▼ 0.82%</div>
                  </div>
                </div>
              </div>

              {/* Forex Section */}
              <div className="w-[240px] px-8">
                <h3 className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium mb-2 ml-1`}>Forex</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">EUR/USD</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>1.0876</div>
                    <div className="text-green-500 text-xs leading-tight">▲ 0.12%</div>
                  </div>
                  <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-black'} rounded-sm px-3 py-2 text-center`}>
                    <div className="text-gray-400 text-xs">GBP/USD</div>
                    <div className={`${theme === 'dark' ? 'text-gray-100' : 'text-white'} font-medium text-sm leading-tight`}>1.2714</div>
                    <div className="text-red-500 text-xs leading-tight">▼ 0.15%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {children}
      </div>

      {/* Footer */}
      <footer className={`footer mt-16 ${
        theme === 'dark' ? 'bg-gray-900 text-gray-300 border-t border-gray-800' : 'bg-gray-100 text-gray-800 border-t border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>ClarVal</h5>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Professional stock analysis and portfolio management tools for individual investors.
              </p>
            </div>
            <div>
              <h5 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Products</h5>
              <ul className="space-y-2">
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Stock Screener</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Portfolio Analysis</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Research Reports</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Market Data</a></li>
              </ul>
            </div>
            <div>
              <h5 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Resources</h5>
              <ul className="space-y-2">
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Learning Center</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Market News</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Economic Calendar</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h5 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>About Us</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Careers</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Contact</a></li>
                <li><a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          <hr className={`my-8 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`} />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
              &copy; 2023 ClarVal Financial Analytics. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className={`${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className={`${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}>
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 