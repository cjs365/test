'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
  params: {
    industryId: string;
  };
};

type Company = {
  symbol: string;
  name: string;
  marketCap: string;
  price: number;
  priceChange: number;
  peRatio: number;
  revenue: string;
  employees: string;
  country: string;
};

export default function IndustryCompaniesPage({ params }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const industryId = params.industryId;
  
  // Mock data for companies in the industry
  const mockCompanies: Company[] = [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      marketCap: '$2.8T', 
      price: 178.72, 
      priceChange: -0.17, 
      peRatio: 29.5, 
      revenue: '$383.3B',
      employees: '164,000',
      country: 'United States'
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corporation', 
      marketCap: '$2.7T', 
      price: 412.65, 
      priceChange: 1.24, 
      peRatio: 34.8, 
      revenue: '$211.9B',
      employees: '221,000',
      country: 'United States'
    },
    { 
      symbol: 'NVDA', 
      name: 'NVIDIA Corporation', 
      marketCap: '$2.2T', 
      price: 925.37, 
      priceChange: 2.85, 
      peRatio: 68.2, 
      revenue: '$60.9B',
      employees: '26,196',
      country: 'United States'
    },
    { 
      symbol: 'ASML', 
      name: 'ASML Holding N.V.', 
      marketCap: '$292.3B', 
      price: 741.52, 
      priceChange: -1.05, 
      peRatio: 42.1, 
      revenue: '$27.2B',
      employees: '39,400',
      country: 'Netherlands'
    },
    { 
      symbol: 'TSM', 
      name: 'Taiwan Semiconductor Manufacturing', 
      marketCap: '$698.5B', 
      price: 145.82, 
      priceChange: 0.64, 
      peRatio: 24.7, 
      revenue: '$69.3B',
      employees: '73,000',
      country: 'Taiwan'
    },
    { 
      symbol: 'INTC', 
      name: 'Intel Corporation', 
      marketCap: '$142.8B', 
      price: 33.24, 
      priceChange: -2.15, 
      peRatio: 85.2, 
      revenue: '$54.2B',
      employees: '124,800',
      country: 'United States'
    },
    { 
      symbol: 'AMD', 
      name: 'Advanced Micro Devices, Inc.', 
      marketCap: '$244.5B', 
      price: 152.37, 
      priceChange: 1.82, 
      peRatio: 218.9, 
      revenue: '$22.8B',
      employees: '25,000',
      country: 'United States'
    },
    { 
      symbol: 'MU', 
      name: 'Micron Technology, Inc.', 
      marketCap: '$118.2B', 
      price: 107.45, 
      priceChange: 3.24, 
      peRatio: 0, 
      revenue: '$15.5B',
      employees: '48,000',
      country: 'United States'
    },
    { 
      symbol: 'AVGO', 
      name: 'Broadcom Inc.', 
      marketCap: '$598.3B', 
      price: 1289.45, 
      priceChange: 0.78, 
      peRatio: 45.3, 
      revenue: '$33.2B',
      employees: '20,000',
      country: 'United States'
    },
    { 
      symbol: 'QCOM', 
      name: 'QUALCOMM Incorporated', 
      marketCap: '$191.8B', 
      price: 171.65, 
      priceChange: -0.42, 
      peRatio: 21.8, 
      revenue: '$35.8B',
      employees: '51,000',
      country: 'United States'
    },
  ];

  // Get unique countries for filter
  const countries = Array.from(new Set(mockCompanies.map(company => company.country)));
  
  // Filter companies based on search and country
  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      company.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === null || company.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });
  
  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Company];
    let bValue: any = b[sortBy as keyof Company];
    
    // Handle string values with special formats
    if (typeof aValue === 'string' && aValue.startsWith('$')) {
      // Convert strings like '$2.8T' to numbers for sorting
      aValue = parseFloat(aValue.substring(1).replace('T', '000').replace('B', '').replace('M', '0.001'));
      bValue = parseFloat(bValue.substring(1).replace('T', '000').replace('B', '').replace('M', '0.001'));
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-2">Companies in {industryId.charAt(0).toUpperCase() + industryId.slice(1)} Industry</h1>
        <p className="text-gray-600">
          Showing {sortedCompanies.length} companies in the {industryId} industry. Click on a company to view detailed analysis.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/2">
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={selectedCountry || ''}
            onChange={(e) => setSelectedCountry(e.target.value === '' ? null : e.target.value)}
          >
            <option value="">All Countries</option>
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
            <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
              <th 
                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('symbol')}
              >
                Symbol
                {sortBy === 'symbol' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('name')}
              >
                Company
                {sortBy === 'name' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="py-3 px-6 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('marketCap')}
              >
                Market Cap
                {sortBy === 'marketCap' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="py-3 px-6 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('price')}
              >
                Price
                {sortBy === 'price' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="py-3 px-6 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('priceChange')}
              >
                Change %
                {sortBy === 'priceChange' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="py-3 px-6 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('peRatio')}
              >
                P/E
                {sortBy === 'peRatio' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="py-3 px-6 text-right cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('revenue')}
              >
                Revenue
                {sortBy === 'revenue' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="py-3 px-6 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('country')}
              >
                Country
                {sortBy === 'country' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {sortedCompanies.map((company) => (
              <tr key={company.symbol} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                  <Link href={`/stock/${company.symbol.toLowerCase()}`} className="text-blue-600 hover:underline">
                    {company.symbol}
                  </Link>
                </td>
                <td className="py-3 px-6 text-left">
                  {company.name}
                </td>
                <td className="py-3 px-6 text-right font-mono">
                  {company.marketCap}
                </td>
                <td className="py-3 px-6 text-right font-mono">
                  ${company.price.toFixed(2)}
                </td>
                <td className={`py-3 px-6 text-right font-mono ${company.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {company.priceChange >= 0 ? '+' : ''}{company.priceChange.toFixed(2)}%
                </td>
                <td className="py-3 px-6 text-right font-mono">
                  {company.peRatio === 0 ? 'N/A' : company.peRatio.toFixed(1)}
                </td>
                <td className="py-3 px-6 text-right font-mono">
                  {company.revenue}
                </td>
                <td className="py-3 px-6 text-left">
                  {company.country}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h2 className="text-sm font-bold mb-2">About This Industry</h2>
        <p className="text-sm text-gray-600">
          {industryId === 'semiconductors' && (
            "The semiconductor industry designs and manufactures integrated circuits, microprocessors, memory chips, and other electronic components. Companies in this industry supply critical components for computing devices, communications equipment, consumer electronics, automotive systems, and industrial applications."
          )}
          {industryId !== 'semiconductors' && (
            `The ${industryId} industry consists of companies involved in the development, manufacturing, and distribution of ${industryId}-related products and services. This sector plays a critical role in the global economy and continues to evolve with technological advancements and changing market demands.`
          )}
        </p>
      </div>
    </div>
  );
} 