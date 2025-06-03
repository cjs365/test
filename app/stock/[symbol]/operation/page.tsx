'use client';

import { useState } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

type Props = {
  params: {
    symbol: string;
  };
};

// Mock data for the charts with historical and forecast data
const mockAroicData = [
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
];

const mockAssetGrowthData = [
  { year: '2019', value: 8.5 },
  { year: '2020', value: 7.2 },
  { year: '2021', value: 9.8 },
  { year: '2022', value: 10.5 },
  { year: '2023', value: 11.2 },
  // Forecasts
  { year: 'FY1', value: 12.1, isEstimate: true },
  { year: 'FY2', value: 12.8, isEstimate: true },
];

const mockRevenueGrowthData = [
  { year: '2019', value: 12.5 },
  { year: '2020', value: 11.8 },
  { year: '2021', value: 14.2 },
  { year: '2022', value: 15.5 },
  { year: '2023', value: 16.8 },
  // Forecasts
  { year: 'FY1', value: 17.5, isEstimate: true },
  { year: 'FY2', value: 18.2, isEstimate: true },
];

const mockEarningsMarginData = [
  { year: '2019', value: 22.5 },
  { year: '2020', value: 21.8 },
  { year: '2021', value: 23.4 },
  { year: '2022', value: 24.2 },
  { year: '2023', value: 25.1 },
  // Forecasts
  { year: 'FY1', value: 25.8, isEstimate: true },
  { year: 'FY2', value: 26.5, isEstimate: true },
];

const mockCapitalAllocationData = [
  { year: '2019', value: 35 },
  { year: '2020', value: 32 },
  { year: '2021', value: 38 },
  { year: '2022', value: 36 },
  { year: '2023', value: 34 },
  // Forecasts
  { year: 'FY1', value: 37, isEstimate: true },
  { year: 'FY2', value: 39, isEstimate: true },
];

export default function StockOperationPage({ params }: Props) {
  const mockCompanyData = {
    name: 'Apple Inc',
    symbol: params.symbol,
  };

  const renderBarChart = (
    data: any[],
    title: string,
    average: string,
    color: string,
    estimateColor: string
  ) => (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold">{title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">20Y Average: {average}</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }}></span>
            <span>Historical</span>
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: estimateColor }}></span>
            <span>Estimate</span>
          </div>
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10 }}
              interval={2}
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 10 }}
              domain={[0, 'auto']}
            />
            <Tooltip 
              formatter={(value: any) => [`${value}%`, title]}
              labelStyle={{ fontSize: 11 }}
            />
            <Bar dataKey="value">
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.isEstimate ? estimateColor : color}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {getChartDescription(title)}
      </p>
    </section>
  );

  const getChartDescription = (title: string) => {
    switch (title) {
      case 'Adjusted Return on Invested Capital (AROIC)':
        return 'AROIC measures how efficiently a company uses its capital to generate profits.';
      case 'Asset Growth':
        return 'Asset growth shows the year-over-year change in total assets.';
      case 'Revenue Growth':
        return 'Revenue growth indicates the year-over-year increase in company sales.';
      case 'Earnings Margin':
        return 'Earnings margin represents the company\'s profitability as a percentage of revenue.';
      case 'Capital Allocation':
        return 'Capital allocation shows how the company distributes its financial resources.';
      default:
        return '';
    }
  };

  return (
    <StockLayout 
      symbol={mockCompanyData.symbol} 
      companyName={mockCompanyData.name}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - Split into two columns */}
        <div className="lg:col-span-9">
          <div className="pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Quality Analysis</h2>
              <div className="text-xs text-gray-500">Updated: Mar 15, 2024</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {renderBarChart(
                  mockAroicData,
                  'Adjusted Return on Invested Capital (AROIC)',
                  '28.4%',
                  '#6B7280',  // Gray for historical
                  '#93C5FD'   // Light blue for estimates
                )}

                {renderBarChart(
                  mockAssetGrowthData,
                  'Asset Growth',
                  '25.8%',
                  '#4B5563',  // Darker gray for historical
                  '#60A5FA'   // Blue for estimates
                )}
              </div>

              {/* Right Column */}
              <div>
                {renderBarChart(
                  mockRevenueGrowthData,
                  'Revenue Growth',
                  '15.3%',
                  '#374151',  // Even darker gray for historical
                  '#3B82F6'   // Darker blue for estimates
                )}

                {renderBarChart(
                  mockEarningsMarginData,
                  'Earnings Margin',
                  '23.7%',
                  '#1F2937',  // Almost black for historical
                  '#2563EB'   // Even darker blue for estimates
                )}

                {renderBarChart(
                  mockCapitalAllocationData,
                  'Capital Allocation',
                  '35.2%',
                  '#111827',  // Nearly black for historical
                  '#1D4ED8'   // Navy blue for estimates
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Empty */}
        <div className="lg:col-span-3">
          {/* Intentionally left empty to match financials page layout */}
        </div>
      </div>
    </StockLayout>
  );
} 