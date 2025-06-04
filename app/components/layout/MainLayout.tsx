'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/app/components/ui/theme-toggle';
import { useTheme } from '@/app/context/ThemeProvider';

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { theme } = useTheme();

  const navItems = [
    { name: 'Equities', path: '/stock' },
    { name: 'Screener', path: '/screener' },
    { name: 'Charting', path: '/charting' },
    { name: 'Tech', path: '/tech' },
    { name: 'Politics', path: '/politics' },
    { name: 'Businessweek', path: '/businessweek' },
    { name: 'Opinion', path: '/opinion' }
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
              <div className="relative">
                <input 
                  type="text" 
                  className={`w-full px-2 py-0.5 rounded border text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                      : 'bg-white text-gray-900 border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                  }`}
                  placeholder="Search stocks, ETFs, or news..."
                />
                <button className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <i className="fas fa-search"></i>
                </button>
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
                className={`nav-link text-sm ${pathname === item.path ? 'active' : ''} ${
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