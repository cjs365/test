'use client';

import { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import Link from 'next/link';

type markets = {
  id: string;
  name: string;
  sectorName: string;
  country: string;
  companies: number;
  marketCap: string;
};

export default function MarketsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const sectors = [
    'All Sectors',
    'Technology',
    'Healthcare',
    'Consumer Cyclical',
    'Financial Services',
    'Industrials',
    'Energy',
    'Basic Materials',
    'Consumer Defensive',
    'Utilities',
    'Real Estate',
    'Communication Services'
  ];

  const countries = [
    'All Countries',
    'United States',
    'China',
    'Japan',
    'Germany',
    'United Kingdom',
    'India',
    'France',
    'Canada',
    'South Korea',
    'Australia'
  ];

  const mockIndustries: markets[] = [
    { id: 'software', name: 'Software', sectorName: 'Technology', country: 'United States', companies: 328, marketCap: '$12.4T' },
    { id: 'semiconductors', name: 'Semiconductors', sectorName: 'Technology', country: 'United States', companies: 104, marketCap: '$4.8T' },
    { id: 'hardware', name: 'Computer Hardware', sectorName: 'Technology', country: 'China', companies: 76, marketCap: '$3.2T' },
    { id: 'biotech', name: 'Biotechnology', sectorName: 'Healthcare', country: 'United States', companies: 412, marketCap: '$2.1T' },
    { id: 'pharma', name: 'Pharmaceuticals', sectorName: 'Healthcare', country: 'Germany', companies: 187, marketCap: '$4.5T' },
    { id: 'banks', name: 'Banks', sectorName: 'Financial Services', country: 'United Kingdom', companies: 245, marketCap: '$5.7T' },
    { id: 'insurance', name: 'Insurance', sectorName: 'Financial Services', country: 'Japan', companies: 156, marketCap: '$2.3T' },
    { id: 'retail', name: 'Retail', sectorName: 'Consumer Cyclical', country: 'United States', companies: 298, marketCap: '$3.1T' },
    { id: 'auto', name: 'Automotive', sectorName: 'Consumer Cyclical', country: 'Germany', companies: 87, marketCap: '$1.9T' },
    { id: 'oil-gas', name: 'Oil & Gas', sectorName: 'Energy', country: 'United States', companies: 134, marketCap: '$2.8T' },
    { id: 'utilities', name: 'Utilities', sectorName: 'Utilities', country: 'France', companies: 112, marketCap: '$1.6T' },
    { id: 'telecom', name: 'Telecommunications', sectorName: 'Communication Services', country: 'China', companies: 98, marketCap: '$2.2T' }
  ];

  const filteredIndustries = mockIndustries.filter(markets => {
    const matchesSearch = markets.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === null || selectedSector === 'All Sectors' || markets.sectorName === selectedSector;
    const matchesCountry = selectedCountry === null || selectedCountry === 'All Countries' || markets.country === selectedCountry;
    return matchesSearch && matchesSector && matchesCountry;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">markets Analysis</h1>
          <div className="text-sm text-gray-500">
            Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600">
            Analyze aggregated metrics across industries and countries. Select an markets to view detailed performance metrics, valuation trends, and comparative analysis.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search industries..."
              className="w-full px-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border rounded-md"
              value={selectedSector || 'All Sectors'}
              onChange={(e) => setSelectedSector(e.target.value === 'All Sectors' ? null : e.target.value)}
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <select
              className="w-full px-4 py-2 border rounded-md"
              value={selectedCountry || 'All Countries'}
              onChange={(e) => setSelectedCountry(e.target.value === 'All Countries' ? null : e.target.value)}
            >
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">markets</th>
                <th className="py-3 px-6 text-left">Sector</th>
                <th className="py-3 px-6 text-left">Country</th>
                <th className="py-3 px-6 text-center">Companies</th>
                <th className="py-3 px-6 text-right">Market Cap</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredIndustries.map((markets) => (
                <tr key={markets.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="font-medium">{markets.name}</div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {markets.sectorName}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {markets.country}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {markets.companies}
                  </td>
                  <td className="py-3 px-6 text-right">
                    {markets.marketCap}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link 
                      href={`/markets/${markets.country === 'United States' ? 'us' : 'all'}_${markets.id === 'all' ? 'all' : markets.id}`} 
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Featured Industries</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-md bg-white">
              <h3 className="font-medium">Semiconductors</h3>
              <p className="text-sm text-gray-600 mt-1">Strong growth potential with AI chip demand</p>
              <Link 
                href="/markets/us_semiconductors" 
                className="text-blue-500 text-sm mt-2 inline-block"
              >
                View Analysis →
              </Link>
            </div>
            <div className="border p-4 rounded-md bg-white">
              <h3 className="font-medium">Biotechnology</h3>
              <p className="text-sm text-gray-600 mt-1">Innovation driving healthcare transformation</p>
              <Link 
                href="/markets/us_biotech" 
                className="text-blue-500 text-sm mt-2 inline-block"
              >
                View Analysis →
              </Link>
            </div>
            <div className="border p-4 rounded-md bg-white">
              <h3 className="font-medium">Renewable Energy</h3>
              <p className="text-sm text-gray-600 mt-1">Sustainable investments with policy tailwinds</p>
              <Link 
                href="/markets/all_renewable-energy" 
                className="text-blue-500 text-sm mt-2 inline-block"
              >
                View Analysis →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 