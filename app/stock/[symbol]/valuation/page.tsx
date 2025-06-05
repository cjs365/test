'use client';

import { useState } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type Props = {
  params: {
    symbol: string;
  };
};

// Mock data for the charts
const mockEvEeData = [
  { year: '2019', value: 15.2, average: 12.5 },
  { year: '2020', value: 18.5, average: 12.5 },
  { year: '2021', value: 22.3, average: 12.5 },
  { year: '2022', value: 16.8, average: 12.5 },
  { year: '2023', value: 14.2, average: 12.5 },
  { year: 'FY1', value: 13.5, average: 12.5, isEstimate: true },
  { year: 'FY2', value: 12.8, average: 12.5, isEstimate: true },
];

const mockEvIcData = [
  { year: '2019', value: 2.8, average: 2.2 },
  { year: '2020', value: 3.2, average: 2.2 },
  { year: '2021', value: 3.5, average: 2.2 },
  { year: '2022', value: 2.6, average: 2.2 },
  { year: '2023', value: 2.4, average: 2.2 },
  { year: 'FY1', value: 2.3, average: 2.2, isEstimate: true },
  { year: 'FY2', value: 2.1, average: 2.2, isEstimate: true },
];

export default function StockValuationPage({ params }: Props) {
  const mockCompanyData = {
    name: 'Apple Inc',
    symbol: params.symbol,
  };

  const renderValuationChart = (
    data: any[],
    title: string,
    description: string,
    valueLabel: string,
    averageLabel: string
  ) => (
    <div className="mb-8">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <HoverCard>
            <HoverCardTrigger>
              <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.06 2.75 2.75 0 013.89 0 .75.75 0 01-1.06 1.06 1.25 1.25 0 00-1.77 0zM7 10a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 017 10zm3 0a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 10z" clipRule="evenodd" />
                </svg>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm text-gray-600">{description}</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div className="h-[300px] bg-white">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name={valueLabel}
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="average"
              name={averageLabel}
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <StockLayout 
      symbol={mockCompanyData.symbol} 
      companyName={mockCompanyData.name}
      sector="Technology"
      country="United States"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-9 lg:border-r lg:pr-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Valuation Analysis</h2>
          </div>

          {renderValuationChart(
            mockEvEeData,
            'Enterprise Value / Economic Earnings',
            'Shows the relationship between the company\'s enterprise value and its economic earnings, indicating whether the stock might be overvalued or undervalued.',
            'EV/EE Ratio',
            '5Y Average'
          )}

          {renderValuationChart(
            mockEvIcData,
            'Enterprise Value / Invested Capital',
            'Measures how efficiently the market values the company\'s invested capital, providing insights into market expectations for future returns.',
            'EV/IC Ratio',
            '5Y Average'
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current EV/EE</span>
                <span className="font-mono text-sm">14.2x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">5Y Avg EV/EE</span>
                <span className="font-mono text-sm">12.5x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current EV/IC</span>
                <span className="font-mono text-sm">2.4x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">5Y Avg EV/IC</span>
                <span className="font-mono text-sm">2.2x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 