'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import StockLayout from '@/app/components/layout/StockLayout';
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
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';

// Mock data for charts
const mockMonthlyData = [
  { date: '2021-04', price: 134.72, benchmark: 4181.17, relative: 0.95 },
  { date: '2021-05', price: 140.18, benchmark: 4204.11, relative: 0.98 },
  // ... more monthly data points
  { date: '2024-03', price: 178.14, benchmark: 5254.35, relative: 1.12 },
];

const mockYearlyData = [
  { year: '2014', return: 42.8, benchmarkReturn: 13.7 },
  { year: '2015', return: -3.2, benchmarkReturn: 1.4 },
  { year: '2016', return: 12.5, benchmarkReturn: 11.9 },
  { year: '2017', return: 48.2, benchmarkReturn: 21.8 },
  { year: '2018', return: -5.4, benchmarkReturn: -4.4 },
  { year: '2019', return: 88.9, benchmarkReturn: 31.5 },
  { year: '2020', return: 82.3, benchmarkReturn: 18.4 },
  { year: '2021', return: 34.6, benchmarkReturn: 28.7 },
  { year: '2022', return: -26.8, benchmarkReturn: -18.1 },
  { year: '2023', return: 48.2, benchmarkReturn: 24.2 },
  { year: '2024 YTD', return: 8.4, benchmarkReturn: 10.2 },
];

const keyStats = [
  { label: '1M Return', value: '+4.2%' },
  { label: '3M Return', value: '+12.8%' },
  { label: '6M Return', value: '+15.4%' },
  { label: 'YTD Return', value: '+8.4%' },
  { label: '1Y Return', value: '+42.1%' },
  { label: '3Y Return', value: '+128.7%' },
  { label: 'Beta (3Y)', value: '1.15' },
  { label: 'Correlation (3Y)', value: '0.82' },
  { label: 'Volatility (3Y)', value: '28.4%' },
  { label: 'Sharpe Ratio (3Y)', value: '1.84' },
];

const mockCompanyData = {
  name: 'Apple Inc',
};

export default function MomentumPage({ params }: { params: { symbol: string } }) {
  const [showRelative, setShowRelative] = useState(false);

  return (
    <StockLayout 
      symbol={params.symbol}
      companyName={mockCompanyData.name}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (8 columns) */}
        <div className="lg:col-span-8 lg:border-r lg:pr-8">
          {/* Monthly Performance Chart */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {showRelative ? 'Relative Performance' : 'Price Performance vs Benchmark'}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant={!showRelative ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowRelative(false)}
                >
                  Absolute
                </Button>
                <Button
                  variant={showRelative ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowRelative(true)}
                >
                  Relative
                </Button>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                    }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {!showRelative ? (
                    <>
                      <Line
                        type="monotone"
                        dataKey="price"
                        name={params.symbol.toUpperCase()}
                        stroke="#2563eb"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark"
                        name="S&P 500"
                        stroke="#64748b"
                        strokeWidth={2}
                      />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="relative"
                      name="Relative Performance"
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Performance Chart */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Annual Performance vs Benchmark</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockYearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar
                    dataKey="return"
                    name={params.symbol.toUpperCase()}
                    fill="#2563eb"
                  />
                  <Bar
                    dataKey="benchmarkReturn"
                    name="S&P 500"
                    fill="#64748b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (4 columns) */}
        <div className="lg:col-span-4">
          <div>
            <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
            <div className="space-y-4">
              {keyStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 