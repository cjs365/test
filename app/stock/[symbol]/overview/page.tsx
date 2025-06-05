'use client';

import { useState } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import ScoreGauge from '@/app/components/charts/ScoreGauge';
import MetricCard from '@/app/components/charts/MetricCard';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

type Props = {
  params: {
    symbol: string;
  };
};

type FinancialDataPoint = {
  year: string;
  value: number | null;
  isEstimate?: boolean;
};

const mockAroicData: FinancialDataPoint[] = [
  { year: '2004', value: 18.2 },
  { year: '2005', value: 19.5 },
  { year: '2006', value: 21.3 },
  { year: '2007', value: 22.8 },
  { year: '2008', value: 20.1 },
  { year: '2009', value: 21.5 },
  { year: '2010', value: 24.3 },
  { year: '2011', value: 26.8 },
  { year: '2012', value: 28.5 },
  { year: '2013', value: 29.2 },
  { year: '2014', value: 30.5 },
  { year: '2015', value: 31.8 },
  { year: '2016', value: 32.4 },
  { year: '2017', value: 33.1 },
  { year: '2018', value: 34.5 },
  { year: '2019', value: 35.2 },
  { year: '2020', value: 32.1 },
  { year: '2021', value: 35.8 },
  { year: '2022', value: 36.2 },
  { year: '2023', value: 34.8 },
  // Forecasts
  { year: 'FY1', value: 36.5, isEstimate: true },
  { year: 'FY2', value: 37.2, isEstimate: true },
  { year: 'FY3', value: null, isEstimate: true },
  { year: 'FY4', value: null, isEstimate: true },
  { year: 'FY5', value: null, isEstimate: true },
];

const mockAssetGrowthData: FinancialDataPoint[] = [
  { year: '2004', value: 12.5 },
  { year: '2005', value: 15.2 },
  { year: '2006', value: 18.4 },
  { year: '2007', value: 22.1 },
  { year: '2008', value: 16.8 },
  { year: '2009', value: 14.5 },
  { year: '2010', value: 19.8 },
  { year: '2011', value: 23.4 },
  { year: '2012', value: 25.6 },
  { year: '2013', value: 24.2 },
  { year: '2014', value: 26.8 },
  { year: '2015', value: 28.4 },
  { year: '2016', value: 27.2 },
  { year: '2017', value: 29.5 },
  { year: '2018', value: 31.2 },
  { year: '2019', value: 32.8 },
  { year: '2020', value: 28.4 },
  { year: '2021', value: 33.6 },
  { year: '2022', value: 35.2 },
  { year: '2023', value: 34.1 },
  // Forecasts
  { year: 'FY1', value: 36.8, isEstimate: true },
  { year: 'FY2', value: 38.5, isEstimate: true },
  { year: 'FY3', value: null, isEstimate: true },
  { year: 'FY4', value: null, isEstimate: true },
  { year: 'FY5', value: null, isEstimate: true },
];

const mockPerformanceData = [
  { date: '2023-01', stock: 15.2, benchmark: 12.8 },
  { date: '2023-03', stock: 18.5, benchmark: 14.2 },
  { date: '2023-06', stock: 22.1, benchmark: 15.8 },
  { date: '2023-09', stock: 25.8, benchmark: 16.5 },
  { date: '2023-12', stock: 28.4, benchmark: 18.2 },
];

const mockPeerBenchmarks = {
  asml: {
    marketCap: "292.3B",
    priceToHigh: "54.3%",
    dividendYield: "0.8%",
    shareholderYield: "2.2%",
    priceReturn: "-22.7%",
    beta: "1.22"
  },
  peers: {
    marketCap: "10.407B",
    priceToHigh: "54.3%",
    dividendYield: "1.2%",
    shareholderYield: "2.2%",
    priceReturn: "-41.7%",
    beta: "1.39"
  },
  sector: {
    marketCap: "89.07M",
    priceToHigh: "66.7%",
    dividendYield: "0.0%",
    shareholderYield: "0.4%",
    priceReturn: "-2.7%",
    beta: "0.72"
  }
};

export default function StockOverviewPage({ params }: Props) {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  
  const mockCompanyData = {
    name: 'Apple Inc',
    symbol: params.symbol,
    description: 'Apple designs a wide variety of consumer electronic devices, including smartphones (iPhone), tablets (iPad), PCs (Mac), smartwatches (Apple Watch), and TV boxes (Apple TV), among others. The iPhone makes up the majority of Apple\'s total revenue. In addition, Apple offers its customers a variety of services such as Apple Music, iCloud, Apple Care, Apple TV+, Apple Arcade, Apple Card, and Apple Pay, among others.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    country: 'United States',
  };

  return (
    <StockLayout 
      symbol={mockCompanyData.symbol} 
      companyName={mockCompanyData.name}
      sector={mockCompanyData.sector}
      country={mockCompanyData.country}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quality Section */}
          <section className="pb-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Quality Analysis</h2>
              <div className="text-xs text-gray-500">Updated: Mar 15, 2024</div>
            </div>
            
            <div className="space-y-6">
              {/* AROIC Chart */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-semibold">Adjusted Return on Invested Capital (AROIC)</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">20Y Average: 28.4%</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 bg-gray-300 rounded-sm"></span>
                      <span>Historical</span>
                      <span className="w-3 h-3 bg-blue-200 rounded-sm"></span>
                      <span>Estimate</span>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAroicData} margin={{ left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 11 }}
                        interval={2}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 11 }}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        formatter={(value: any) => value ? [`${value}%`, 'AROIC'] : ['No data', 'AROIC']}
                        labelStyle={{ fontSize: 12 }}
                      />
                      <Bar 
                        dataKey="value"
                        fill="#6b7280"
                      >
                        {mockAroicData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={entry.isEstimate ? '#bfdbfe' : '#6b7280'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  AROIC measures how efficiently a company generates profits from its invested capital, adjusted for accounting distortions.
                </p>
              </div>

              {/* Asset Growth Chart */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-semibold">Asset Growth</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">20Y Average: 25.8%</span>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 bg-gray-300 rounded-sm"></span>
                      <span>Historical</span>
                      <span className="w-3 h-3 bg-blue-200 rounded-sm"></span>
                      <span>Estimate</span>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAssetGrowthData} margin={{ left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 11 }}
                        interval={2}
                      />
                      <YAxis 
                        tickFormatter={(value) => `${value}%`}
                        tick={{ fontSize: 11 }}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        formatter={(value: any) => value ? [`${value}%`, 'Growth'] : ['No data', 'Growth']}
                        labelStyle={{ fontSize: 12 }}
                      />
                      <Bar 
                        dataKey="value"
                      >
                        {mockAssetGrowthData.map((entry) => (
                          <Cell 
                            key={`cell-${entry.year}`}
                            fill={entry.isEstimate ? '#bfdbfe' : '#6b7280'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Asset growth shows the year-over-year change in total assets, indicating the company's expansion rate and capital deployment.
                </p>
              </div>
            </div>
          </section>

          {/* Momentum Section */}
          <section className="pb-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Price Performance</h2>
              <div className="flex items-center gap-2">
                {(['1Y', '3Y', '5Y'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      timeframe === t 
                        ? 'bg-gray-200 text-gray-800' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '']}
                    labelStyle={{ fontSize: 12 }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="stock" 
                    name={mockCompanyData.symbol}
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benchmark" 
                    name="S&P 500"
                    stroke="#6b7280" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Trading Information */}
          <section className="pb-6 border-b">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Trading Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Previous Close Price</span>
                <span className="font-mono text-xs">$199.95</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Day Range</span>
                  <span className="font-mono text-xs">$196.78-201.96</span>
                </div>
                <div className="relative h-1.5 bg-gray-100 rounded-full">
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  <div className="absolute h-3 w-3 bg-blue-500 rounded-full top-1/2 -translate-y-1/2" style={{ left: '65%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">52-Week Range</span>
                  <span className="font-mono text-xs">$169.21-260.10</span>
                </div>
                <div className="relative h-1.5 bg-gray-100 rounded-full">
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  <div className="absolute h-3 w-3 bg-blue-500 rounded-full top-1/2 -translate-y-1/2" style={{ left: '35%' }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Bid/Ask</span>
                <span className="font-mono text-xs">$199.36 / $199.50</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Shares Outstanding</span>
                <span className="font-mono text-xs">14.94B</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Market Cap</span>
                <span className="font-mono text-xs">$3.00T</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Volume/Avg</span>
                <span className="font-mono text-xs">90,477 / 62M</span>
              </div>

              <div className="flex justify-end items-center pt-1">
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Terms
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Key Statistics */}
          <section className="pb-6 border-b">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Key Statistics</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Price/Earnings (Normalized)</span>
                <span className="font-mono text-xs">28.33</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Price/Sales</span>
                <span className="font-mono text-xs">7.63</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Dividend Yield (Trailing)</span>
                <span className="font-mono text-xs">0.50%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Dividend Yield (Forward)</span>
                <span className="font-mono text-xs">0.52%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Yield</span>
                <span className="font-mono text-xs">3.87%</span>
              </div>

              <div className="flex justify-end items-center pt-1">
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Terms
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Scorecard */}
          <section className="pb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4">Scorecard</h2>
            <div className="space-y-4">
              {[
                { metric: 'Quality', score: 85, prevScore: 78 },
                { metric: 'Momentum', score: 72, prevScore: 81 },
                { metric: 'Valuation', score: 65, prevScore: 70 },
                { metric: 'Growth', score: 78, prevScore: 75 },
                { metric: 'Risk', score: 82, prevScore: 80 }
              ].map(({ metric, score, prevScore }) => (
                <div key={metric} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3 text-xs text-gray-600">{metric}</div>
                  <div className="col-span-7">
                    <div className="relative">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      {/* Historical score indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-black"
                        style={{ 
                          left: `${prevScore}%`,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-mono text-xs">{score}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-3 text-xs font-medium text-gray-600">Overall</div>
                  <div className="col-span-7">
                    <div className="relative">
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: '76%' }}
                        />
                      </div>
                      {/* Historical score indicator */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-black"
                        style={{ 
                          left: '71%',
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-mono text-xs">76</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-4 text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-blue-500"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-black"></div>
                  <span>3M ago</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </StockLayout>
  );
} 