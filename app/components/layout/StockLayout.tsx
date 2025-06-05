'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/app/components/layout/MainLayout';

type StockLayoutProps = {
  children: React.ReactNode;
  symbol: string;
  companyName: string;
  sector?: string;
  country?: string;
};

export default function StockLayout({ children, symbol, companyName, sector, country }: StockLayoutProps) {
  const pathname = usePathname();
  const stockSymbol = symbol.toUpperCase();

  const navItems = [
    { name: 'Overview', path: `/stock/${symbol}/overview` },
    { name: 'Operation', path: `/stock/${symbol}/operation` },
    { name: 'Valuation', path: `/stock/${symbol}/valuation` },
    { name: 'Momentum', path: `/stock/${symbol}/momentum` },
    { name: 'Peers', path: `/stock/${symbol}/peers` },
    { name: 'Financials', path: `/stock/${symbol}/financials` },
    { name: 'Modelling', path: `/stock/${symbol}/modelling` },
  ];

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="border-b">
          {/* Company Header */}
          <div className="container mx-auto px-4">
            <div className="py-6">
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl font-bold">{companyName}</h1>
                <span className="text-lg text-gray-600 font-mono">{stockSymbol}</span>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-lg font-semibold">$178.72</span>
                  <span className="text-sm text-red-500">▼ 0.31 (0.17%)</span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <div className="text-xs text-gray-500">
                    Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    <svg 
                      className="w-4 h-4 mr-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                      />
                    </svg>
                    Add to Watchlist
                  </Button>
                </div>
              </div>
              {(country || sector) && (
                <div className="mt-1 text-sm text-gray-600">
                  {country && <span>{country}</span>}
                  {sector && country && <span className="mx-2">•</span>}
                  {sector && <span>{sector}</span>}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="portfolio-nav">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`portfolio-nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </MainLayout>
  );
} 