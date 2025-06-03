'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/app/components/layout/MainLayout';

type StockLayoutProps = {
  children: React.ReactNode;
  symbol: string;
  companyName: string;
};

export default function StockLayout({ children, symbol, companyName }: StockLayoutProps) {
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
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center -mb-px gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      py-3 border-b-2 text-sm font-medium transition-colors
                      ${isActive 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                    `}
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