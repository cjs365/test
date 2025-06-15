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

// Mock data for the charts with historical and forecast data - Annual
const mockAroicDataAnnual = [
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

// Mock data for TTM view (quarterly data points)
const mockAroicDataTTM = [
  { year: 'Q1 2022', value: 35.8 },
  { year: 'Q2 2022', value: 36.1 },
  { year: 'Q3 2022', value: 36.5 },
  { year: 'Q4 2022', value: 36.2 },
  { year: 'Q1 2023', value: 35.9 },
  { year: 'Q2 2023', value: 35.2 },
  { year: 'Q3 2023', value: 34.9 },
  { year: 'Q4 2023', value: 34.8 },
  // Forecasts
  { year: 'Q1 2024', value: 35.2, isEstimate: true },
  { year: 'Q2 2024', value: 35.8, isEstimate: true },
  { year: 'Q3 2024', value: 36.3, isEstimate: true },
  { year: 'Q4 2024', value: 36.5, isEstimate: true },
];

// Annual data
const mockAssetGrowthDataAnnual = [
  { year: '2019', value: 8.5 },
  { year: '2020', value: 7.2 },
  { year: '2021', value: 9.8 },
  { year: '2022', value: 10.5 },
  { year: '2023', value: 11.2 },
  // Forecasts
  { year: 'FY1', value: 12.1, isEstimate: true },
  { year: 'FY2', value: 12.8, isEstimate: true },
];

// TTM data
const mockAssetGrowthDataTTM = [
  { year: 'Q1 2022', value: 10.1 },
  { year: 'Q2 2022', value: 10.3 },
  { year: 'Q3 2022', value: 10.4 },
  { year: 'Q4 2022', value: 10.5 },
  { year: 'Q1 2023', value: 10.7 },
  { year: 'Q2 2023', value: 10.9 },
  { year: 'Q3 2023', value: 11.0 },
  { year: 'Q4 2023', value: 11.2 },
  // Forecasts
  { year: 'Q1 2024', value: 11.5, isEstimate: true },
  { year: 'Q2 2024', value: 11.8, isEstimate: true },
  { year: 'Q3 2024', value: 12.0, isEstimate: true },
  { year: 'Q4 2024', value: 12.1, isEstimate: true },
];

// Annual data
const mockRevenueGrowthDataAnnual = [
  { year: '2019', value: 12.5 },
  { year: '2020', value: 11.8 },
  { year: '2021', value: 14.2 },
  { year: '2022', value: 15.5 },
  { year: '2023', value: 16.8 },
  // Forecasts
  { year: 'FY1', value: 17.5, isEstimate: true },
  { year: 'FY2', value: 18.2, isEstimate: true },
];

// TTM data
const mockRevenueGrowthDataTTM = [
  { year: 'Q1 2022', value: 15.0 },
  { year: 'Q2 2022', value: 15.2 },
  { year: 'Q3 2022', value: 15.4 },
  { year: 'Q4 2022', value: 15.5 },
  { year: 'Q1 2023', value: 15.9 },
  { year: 'Q2 2023', value: 16.3 },
  { year: 'Q3 2023', value: 16.6 },
  { year: 'Q4 2023', value: 16.8 },
  // Forecasts
  { year: 'Q1 2024', value: 17.0, isEstimate: true },
  { year: 'Q2 2024', value: 17.2, isEstimate: true },
  { year: 'Q3 2024', value: 17.4, isEstimate: true },
  { year: 'Q4 2024', value: 17.5, isEstimate: true },
];

// Annual data
const mockEarningsMarginDataAnnual = [
  { year: '2019', value: 22.5 },
  { year: '2020', value: 21.8 },
  { year: '2021', value: 23.4 },
  { year: '2022', value: 24.2 },
  { year: '2023', value: 25.1 },
  // Forecasts
  { year: 'FY1', value: 25.8, isEstimate: true },
  { year: 'FY2', value: 26.5, isEstimate: true },
];

// TTM data
const mockEarningsMarginDataTTM = [
  { year: 'Q1 2022', value: 23.8 },
  { year: 'Q2 2022', value: 24.0 },
  { year: 'Q3 2022', value: 24.1 },
  { year: 'Q4 2022', value: 24.2 },
  { year: 'Q1 2023', value: 24.5 },
  { year: 'Q2 2023', value: 24.8 },
  { year: 'Q3 2023', value: 25.0 },
  { year: 'Q4 2023', value: 25.1 },
  // Forecasts
  { year: 'Q1 2024', value: 25.3, isEstimate: true },
  { year: 'Q2 2024', value: 25.5, isEstimate: true },
  { year: 'Q3 2024', value: 25.7, isEstimate: true },
  { year: 'Q4 2024', value: 25.8, isEstimate: true },
];

// Annual data
const mockCapitalAllocationDataAnnual = [
  { year: '2019', value: 35 },
  { year: '2020', value: 32 },
  { year: '2021', value: 38 },
  { year: '2022', value: 36 },
  { year: '2023', value: 34 },
  // Forecasts
  { year: 'FY1', value: 37, isEstimate: true },
  { year: 'FY2', value: 39, isEstimate: true },
];

// TTM data
const mockCapitalAllocationDataTTM = [
  { year: 'Q1 2022', value: 37 },
  { year: 'Q2 2022', value: 36 },
  { year: 'Q3 2022', value: 36 },
  { year: 'Q4 2022', value: 36 },
  { year: 'Q1 2023', value: 35 },
  { year: 'Q2 2023', value: 35 },
  { year: 'Q3 2023', value: 34 },
  { year: 'Q4 2023', value: 34 },
  // Forecasts
  { year: 'Q1 2024', value: 35, isEstimate: true },
  { year: 'Q2 2024', value: 36, isEstimate: true },
  { year: 'Q3 2024', value: 36, isEstimate: true },
  { year: 'Q4 2024', value: 37, isEstimate: true },
];

export default function StockOperationPage({ params }: Props) {
  const [viewMode, setViewMode] = useState<'annual' | 'ttm'>('annual');
  
  const mockCompanyData = {
    name: 'Apple Inc',
    symbol: params.symbol,
  };

  // Get the appropriate data based on the view mode
  const getDataForViewMode = (annualData: any[], ttmData: any[]) => {
    return viewMode === 'annual' ? annualData : ttmData;
  };

  const renderBarChart = (
    annualData: any[],
    ttmData: any[],
    title: string,
    average: string,
    color: string,
    estimateColor: string
  ) => (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold">{title}</h3>
                  <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{viewMode === 'annual' ? '20Y Average: ' : 'TTM Average: '}{average}</span>
          {viewMode === 'annual' ? (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }}></span>
              <span>Historical</span>
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: estimateColor }}></span>
              <span>Estimate</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }}></span>
              <span>TTM Data</span>
            </div>
          )}
        </div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getDataForViewMode(annualData, ttmData)} margin={{ left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10 }}
              interval={viewMode === 'annual' ? 2 : 1}
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
              {getDataForViewMode(annualData, ttmData).map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={viewMode === 'ttm' ? color : (entry.isEstimate ? estimateColor : color)}
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
      sector="Technology"
      country="United States"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content - Split into two columns */}
        <div className="lg:col-span-9">
          <div className="pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider">Quality Analysis</h2>
              <div className="flex items-center gap-4">
                {/* Toggle switch for Annual/TTM view */}
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('annual')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      viewMode === 'annual'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Annual
                  </button>
                  <button
                    onClick={() => setViewMode('ttm')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      viewMode === 'ttm'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    TTM
                  </button>
                </div>
                <div className="text-xs text-gray-500">Updated: Mar 15, 2024</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {renderBarChart(
                  mockAroicDataAnnual,
                  mockAroicDataTTM,
                  'Adjusted Return on Invested Capital (AROIC)',
                  viewMode === 'annual' ? '28.4%' : '35.6%',
                  '#6B7280',  // Gray for historical
                  '#93C5FD'   // Light blue for estimates
                )}

                {renderBarChart(
                  mockAssetGrowthDataAnnual,
                  mockAssetGrowthDataTTM,
                  'Asset Growth',
                  viewMode === 'annual' ? '25.8%' : '10.8%',
                  '#4B5563',  // Darker gray for historical
                  '#60A5FA'   // Blue for estimates
                )}
              </div>

              {/* Right Column */}
              <div>
                {renderBarChart(
                  mockRevenueGrowthDataAnnual,
                  mockRevenueGrowthDataTTM,
                  'Revenue Growth',
                  viewMode === 'annual' ? '15.3%' : '15.8%',
                  '#374151',  // Even darker gray for historical
                  '#3B82F6'   // Darker blue for estimates
                )}

                {renderBarChart(
                  mockEarningsMarginDataAnnual,
                  mockEarningsMarginDataTTM,
                  'Earnings Margin',
                  viewMode === 'annual' ? '23.7%' : '24.4%',
                  '#1F2937',  // Almost black for historical
                  '#2563EB'   // Even darker blue for estimates
                )}

                {renderBarChart(
                  mockCapitalAllocationDataAnnual,
                  mockCapitalAllocationDataTTM,
                  'Capital Allocation',
                  viewMode === 'annual' ? '35.2%' : '35.5%',
                  '#111827',  // Nearly black for historical
                  '#1D4ED8'   // Navy blue for estimates
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Key Operation Metrics */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-xs font-semibold mb-3">Key Operation Metrics</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">AROIC (TTM)</span>
                  <span className="text-xs font-medium">34.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Revenue Growth (YoY)</span>
                  <span className="text-xs font-medium">16.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Earnings Margin</span>
                  <span className="text-xs font-medium">25.1%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Asset Turnover</span>
                  <span className="text-xs font-medium">0.78x</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Industry Rank</span>
                  <span className="text-xs font-medium">3 of 45</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-xs font-medium mb-2">Operational Strengths</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Strong brand recognition</li>
                <li>• Efficient supply chain management</li>
                <li>• High customer retention rate</li>
                <li>• Product innovation leadership</li>
                <li>• Vertical integration advantages</li>
              </ul>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-xs font-medium mb-2">Quality Score</h4>
              <div className="flex items-center">
                <div className="text-lg font-bold">92</div>
                <div className="text-xs text-gray-500 ml-2">/ 100</div>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                    Excellent
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 