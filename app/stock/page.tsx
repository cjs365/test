'use client';

import { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

// Mock data for trending stocks
const trendingStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: -0.31, changePercent: -0.17 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 425.22, change: 2.45, changePercent: 0.58 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 881.86, change: -5.23, changePercent: -0.59 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 147.60, change: 0.78, changePercent: 0.53 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 509.58, change: 3.21, changePercent: 0.63 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 172.82, change: -1.45, changePercent: -0.83 },
];

// Mock data for stock news
const stockNews = [
  {
    id: 1,
    title: "NVIDIA Surges on AI Chip Demand",
    description: "NVIDIA shares reach new heights as artificial intelligence chip demand continues to soar",
    image: "https://images.unsplash.com/photo-1642444666759-30a7fad1d161",
    timestamp: "2 hours ago",
    symbol: "NVDA",
  },
  {
    id: 2,
    title: "Apple's Vision Pro Sales Beat Expectations",
    description: "Apple's mixed reality headset sees strong initial demand despite high price point",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
    timestamp: "4 hours ago",
    symbol: "AAPL",
  },
  {
    id: 3,
    title: "Microsoft Expands Cloud Partnership",
    description: "Tech giant announces major expansion of cloud services with new global partners",
    image: "https://images.unsplash.com/photo-1642059870522-bb7a747cb4b6",
    timestamp: "6 hours ago",
    symbol: "MSFT",
  },
];

// Mock data for hot stocks
const hotStocks = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 881.86,
    change: 45.23,
    changePercent: 5.41,
    volume: '89.2M',
    marketCap: '2.18T',
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    price: 178.62,
    change: 8.45,
    changePercent: 4.96,
    volume: '95.8M',
    marketCap: '288.5B',
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    price: 24.98,
    change: 0.86,
    changePercent: 3.56,
    volume: '125.4M',
    marketCap: '54.8B',
  },
];

// Mock data for market analysis
const marketAnalysis = [
  {
    symbol: 'WMT',
    name: 'Walmart Inc',
    rating: 'Buy',
    targetPrice: 68.50,
    currentPrice: 62.35,
    upside: 9.86,
    analyst: 'Sarah Chen',
    date: '2024-03-15',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    rating: 'Hold',
    targetPrice: 185.00,
    currentPrice: 178.72,
    upside: 3.51,
    analyst: 'Michael Roberts',
    date: '2024-03-15',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    rating: 'Buy',
    targetPrice: 445.00,
    currentPrice: 425.22,
    upside: 4.65,
    analyst: 'David Kim',
    date: '2024-03-15',
  },
];

// Mock data for featured screens
const featuredScreens = [
  {
    id: 1,
    name: 'High Growth Tech Stocks',
    description: 'Technology companies with strong revenue growth and expanding margins',
    metrics: ['Revenue Growth > 30%', 'Gross Margin > 60%', 'Market Cap > $10B'],
    matchCount: 15,
  },
  {
    id: 2,
    name: 'Dividend Champions',
    description: 'Companies with consistent dividend growth and strong financials',
    metrics: ['Dividend Growth > 10 years', 'Payout Ratio < 75%', 'Debt/Equity < 1.5'],
    matchCount: 28,
  },
  {
    id: 3,
    name: 'Value Opportunities',
    description: 'Undervalued stocks with strong fundamentals and potential catalysts',
    metrics: ['P/E < Industry Average', 'ROE > 15%', 'Current Ratio > 1.5'],
    matchCount: 42,
  },
];

export default function EquitiesPage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'technology' | 'healthcare' | 'finance'>('trending');

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
        {/* Main Content (8 columns) */}
        <div className="lg:col-span-8">
          {/* Hot Stocks Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Hot Stocks</h2>
              <Link href="/screener/momentum" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b">
                    <th className="text-left py-2">Symbol</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Change</th>
                    <th className="text-right py-2">Volume</th>
                    <th className="text-right py-2">Market Cap</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {hotStocks.map((stock) => (
                    <tr key={stock.symbol} className="text-sm hover:bg-gray-50">
                      <td className="py-3">
                        <Link href={`/stock/${stock.symbol}/overview`}>
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-gray-500 text-xs">{stock.name}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="text-right py-3 font-medium">
                        ${stock.price.toFixed(2)}
                      </td>
                      <td className="text-right py-3">
                        <span className={`${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="text-right py-3 text-gray-600">
                        {stock.volume}
                      </td>
                      <td className="text-right py-3 text-gray-600">
                        {stock.marketCap}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Market Analysis Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Market Analysis</h2>
              <Link href="/analysis" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {marketAnalysis.map((stock) => (
                <Link href={`/stock/${stock.symbol}/overview`} key={stock.symbol}>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{stock.symbol}</h3>
                        <p className="text-sm text-gray-600">{stock.name}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        stock.rating === 'Buy' ? 'bg-green-100 text-green-800' : 
                        stock.rating === 'Hold' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {stock.rating}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Target Price</span>
                        <span className="font-medium">${stock.targetPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current Price</span>
                        <span className="font-medium">${stock.currentPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Upside</span>
                        <span className={`font-medium ${stock.upside >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.upside >= 0 ? '+' : ''}{stock.upside.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                      {stock.analyst} • {stock.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Screens Section */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Featured Screens</h2>
              <Link href="/screener" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredScreens.map((screen) => (
                <Link href={`/screener/${screen.id}`} key={screen.id}>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow h-full">
                    <h3 className="font-bold mb-2">{screen.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{screen.description}</p>
                    <div className="space-y-2">
                      {screen.metrics.map((metric, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                          {metric}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <span className="text-xs text-gray-500">Matching Companies</span>
                      <span className="text-sm font-medium">{screen.matchCount}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar (4 columns) */}
        <div className="lg:col-span-4">
          {/* Trending Stocks Section */}
          <section className="mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Trending Stocks</h2>
            <div className="space-y-4">
              {trendingStocks.map((stock) => (
                <Link href={`/stock/${stock.symbol}/overview`} key={stock.symbol}>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="font-bold">{stock.symbol}</h3>
                      <p className="text-sm text-gray-600">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${stock.price.toFixed(2)}</p>
                      <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.changePercent).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
} 