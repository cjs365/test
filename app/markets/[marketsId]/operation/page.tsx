'use client';

import { useState } from 'react';
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
    marketsId: string;
  };
};

// Mock data for the charts with historical and forecast data
const mockAroicData = [
  { year: '2014', value: 16.2 },
  { year: '2015', value: 17.5 },
  { year: '2016', value: 18.3 },
  { year: '2017', value: 19.8 },
  { year: '2018', value: 18.1 },
  { year: '2019', value: 18.5 },
  { year: '2020', value: 16.3 },
  { year: '2021', value: 19.8 },
  { year: '2022', value: 20.2 },
  { year: '2023', value: 19.8 },
  // Forecasts
  { year: 'FY1', value: 20.5, isEstimate: true },
  { year: 'FY2', value: 21.2, isEstimate: true },
];

const mockAssetGrowthData = [
  { year: '2019', value: 7.5 },
  { year: '2020', value: 6.2 },
  { year: '2021', value: 8.8 },
  { year: '2022', value: 9.5 },
  { year: '2023', value: 10.2 },
  // Forecasts
  { year: 'FY1', value: 11.1, isEstimate: true },
  { year: 'FY2', value: 11.8, isEstimate: true },
];

const mockRevenueGrowthData = [
  { year: '2019', value: 11.5 },
  { year: '2020', value: 10.8 },
  { year: '2021', value: 13.2 },
  { year: '2022', value: 14.5 },
  { year: '2023', value: 15.8 },
  // Forecasts
  { year: 'FY1', value: 16.5, isEstimate: true },
  { year: 'FY2', value: 17.2, isEstimate: true },
];

const mockEarningsMarginData = [
  { year: '2019', value: 20.5 },
  { year: '2020', value: 19.8 },
  { year: '2021', value: 21.4 },
  { year: '2022', value: 22.2 },
  { year: '2023', value: 23.1 },
  // Forecasts
  { year: 'FY1', value: 23.8, isEstimate: true },
  { year: 'FY2', value: 24.5, isEstimate: true },
];

const mockCapitalAllocationData = [
  { year: '2019', value: 33 },
  { year: '2020', value: 30 },
  { year: '2021', value: 36 },
  { year: '2022', value: 34 },
  { year: '2023', value: 32 },
  // Forecasts
  { year: 'FY1', value: 35, isEstimate: true },
  { year: 'FY2', value: 37, isEstimate: true },
];

export default function MarketsOperationPage({ params }: Props) {
  const marketsId = params.marketsId.charAt(0).toUpperCase() + params.marketsId.slice(1);

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
          <span className="text-xs text-gray-500">10Y Average: {average}</span>
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
              interval={1}
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
      case 'Industry Adjusted Return on Invested Capital (AROIC)':
        return 'Industry AROIC measures how efficiently companies in the industry use their capital to generate profits.';
      case 'Industry Asset Growth':
        return 'Industry asset growth shows the year-over-year change in total assets across companies in the industry.';
      case 'Industry Revenue Growth':
        return 'Industry revenue growth indicates the year-over-year increase in sales across companies in the industry.';
      case 'Industry Earnings Margin':
        return 'Industry earnings margin represents the average profitability as a percentage of revenue across companies in the industry.';
      case 'Industry Capital Allocation':
        return 'Industry capital allocation shows how companies in the industry distribute their financial resources on average.';
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Content - Split into two columns */}
      <div className="lg:col-span-9">
        <div className="pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">Quality Analysis</h2>
            <div className="text-xs text-gray-500">Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {renderBarChart(
                mockAroicData,
                'Industry Adjusted Return on Invested Capital (AROIC)',
                '18.4%',
                '#6B7280',  // Gray for historical
                '#93C5FD'   // Light blue for estimates
              )}

              {renderBarChart(
                mockAssetGrowthData,
                'Industry Asset Growth',
                '8.8%',
                '#4B5563',  // Darker gray for historical
                '#60A5FA'   // Blue for estimates
              )}
            </div>

            {/* Right Column */}
            <div>
              {renderBarChart(
                mockRevenueGrowthData,
                'Industry Revenue Growth',
                '13.3%',
                '#374151',  // Even darker gray for historical
                '#3B82F6'   // Darker blue for estimates
              )}

              {renderBarChart(
                mockEarningsMarginData,
                'Industry Earnings Margin',
                '21.7%',
                '#1F2937',  // Almost black for historical
                '#2563EB'   // Even darker blue for estimates
              )}

              {renderBarChart(
                mockCapitalAllocationData,
                'Industry Capital Allocation',
                '33.2%',
                '#111827',  // Nearly black for historical
                '#1D4ED8'   // Navy blue for estimates
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Industry Operations Metrics */}
      <div className="lg:col-span-3">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-bold mb-3">Key Operational Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">AROIC (LTM)</span>
              <span className="font-mono text-xs">19.8%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Profit Margin</span>
              <span className="font-mono text-xs">23.1%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Operating Margin</span>
              <span className="font-mono text-xs">28.4%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Asset Turnover</span>
              <span className="font-mono text-xs">0.84</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Cash Conversion</span>
              <span className="font-mono text-xs">92.3%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Debt/EBITDA</span>
              <span className="font-mono text-xs">1.65</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">R&D % Revenue</span>
              <span className="font-mono text-xs">8.7%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">CAPEX % Revenue</span>
              <span className="font-mono text-xs">6.2%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Working Capital Days</span>
              <span className="font-mono text-xs">42</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Days Sales Outstanding</span>
              <span className="font-mono text-xs">36</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 