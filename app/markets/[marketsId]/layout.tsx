'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/app/components/layout/MainLayout';

type marketsData = {
  id: string;
  name: string;
  sectorName: string;
  companies: number;
  marketCap: string;
};

const mockmarketsData: Record<string, marketsData> = {
  'software': { id: 'software', name: 'Software', sectorName: 'Technology', companies: 328, marketCap: '$12.4T' },
  'semiconductors': { id: 'semiconductors', name: 'Semiconductors', sectorName: 'Technology', companies: 104, marketCap: '$4.8T' },
  'hardware': { id: 'hardware', name: 'Computer Hardware', sectorName: 'Technology', companies: 76, marketCap: '$3.2T' },
  'biotech': { id: 'biotech', name: 'Biotechnology', sectorName: 'Healthcare', companies: 412, marketCap: '$2.1T' },
  'pharma': { id: 'pharma', name: 'Pharmaceuticals', sectorName: 'Healthcare', companies: 187, marketCap: '$4.5T' },
  'banks': { id: 'banks', name: 'Banks', sectorName: 'Financial Services', companies: 245, marketCap: '$5.7T' },
};

export default function MarketsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { marketsId: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const fullMarketsId = params.marketsId.toLowerCase();
  
  // Split the marketsId into country and actual market id
  const [countryCode, ...marketIdParts] = fullMarketsId.split('_');
  const marketId = marketIdParts.join('_'); // Rejoin in case market id itself contains underscores
  
  // Map country code to full name
  const countryName = countryCode === 'us' ? 'United States' : 'Global';
  
  const marketsData = mockmarketsData[marketId] || {
    id: marketId,
    name: marketId.charAt(0).toUpperCase() + marketId.slice(1).replace(/-/g, ' '),
    sectorName: 'Unknown',
    companies: 0,
    marketCap: 'N/A'
  };

  const navItems = [
    { name: 'Overview', path: `/markets/${fullMarketsId}/overview` },
    { name: 'Momentum', path: `/markets/${fullMarketsId}/momentum` },
    { name: 'Valuation', path: `/markets/${fullMarketsId}/valuation` },
    { name: 'Operation', path: `/markets/${fullMarketsId}/operation` },
    { name: 'Peers', path: `/markets/${fullMarketsId}/peers` },
  ];

  useEffect(() => {
    // Redirect to overview if on the base markets path
    if (pathname === `/markets/${fullMarketsId}`) {
      router.replace(`/markets/${fullMarketsId}/overview`, { scroll: false });
    }
  }, [pathname, router, fullMarketsId]);

  return (
    <MainLayout>
      <div className="min-h-screen">
        <div className="border-b">
          {/* markets Header */}
          <div className="container mx-auto px-4">
            <div className="py-6">
              <div className="flex items-baseline gap-3">
                <h1 className="text-2xl font-bold">{marketsData.name} Markets</h1>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{countryName}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{marketsData.companies} Companies</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Market Cap: {marketsData.marketCap}</span>
                </div>
                <div className="ml-auto flex flex-col items-end">
                  <div className="text-xs text-gray-500">
                    Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <select 
                      className="text-sm border rounded px-2 py-1"
                      defaultValue={countryCode === 'us' ? 'us' : 'global'}
                    >
                      <option value="global">Global</option>
                      <option value="us">United States</option>
                      <option value="europe">Europe</option>
                      <option value="asia">Asia</option>
                    </select>
                    <button className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <span>Sector: {marketsData.sectorName}</span>
              </div>
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