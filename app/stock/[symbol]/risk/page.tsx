'use client';

import { useState } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';

type Props = {
  params: {
    symbol: string;
  };
};

// Mock data for the Probability of Default (PoD) chart
const mockPoDData = [
  { year: '2014', value: 0.8 },
  { year: '2015', value: 0.7 },
  { year: '2016', value: 0.9 },
  { year: '2017', value: 1.2 },
  { year: '2018', value: 1.0 },
  { year: '2019', value: 0.9 },
  { year: '2020', value: 2.5 },
  { year: '2021', value: 1.8 },
  { year: '2022', value: 1.5 },
  { year: '2023', value: 1.3 },
  // Forecasts
  { year: 'FY1', value: 1.2, isEstimate: true },
  { year: 'FY2', value: 1.1, isEstimate: true },
];

// Mock data for the Debt-to-EBITDA ratio
const mockDebtToEbitdaData = [
  { year: '2014', value: 1.2 },
  { year: '2015', value: 1.3 },
  { year: '2016', value: 1.5 },
  { year: '2017', value: 1.8 },
  { year: '2018', value: 2.0 },
  { year: '2019', value: 2.1 },
  { year: '2020', value: 2.4 },
  { year: '2021', value: 2.2 },
  { year: '2022', value: 2.1 },
  { year: '2023', value: 2.0 },
  // Forecasts
  { year: 'FY1', value: 1.9, isEstimate: true },
  { year: 'FY2', value: 1.8, isEstimate: true },
];

// Mock data for the Interest Coverage Ratio
const mockInterestCoverageData = [
  { year: '2014', value: 15.2 },
  { year: '2015', value: 14.8 },
  { year: '2016', value: 13.5 },
  { year: '2017', value: 12.8 },
  { year: '2018', value: 11.5 },
  { year: '2019', value: 12.2 },
  { year: '2020', value: 10.5 },
  { year: '2021', value: 11.8 },
  { year: '2022', value: 12.5 },
  { year: '2023', value: 13.2 },
  // Forecasts
  { year: 'FY1', value: 13.8, isEstimate: true },
  { year: 'FY2', value: 14.2, isEstimate: true },
];

// Mock data for the Debt-to-Equity ratio
const mockDebtToEquityData = [
  { year: '2014', value: 0.35 },
  { year: '2015', value: 0.42 },
  { year: '2016', value: 0.48 },
  { year: '2017', value: 0.55 },
  { year: '2018', value: 0.62 },
  { year: '2019', value: 0.68 },
  { year: '2020', value: 0.75 },
  { year: '2021', value: 0.72 },
  { year: '2022', value: 0.68 },
  { year: '2023', value: 0.65 },
  // Forecasts
  { year: 'FY1', value: 0.62, isEstimate: true },
  { year: 'FY2', value: 0.60, isEstimate: true },
];

// Mock data for the Current Ratio
const mockCurrentRatioData = [
  { year: '2014', value: 1.85 },
  { year: '2015', value: 1.78 },
  { year: '2016', value: 1.72 },
  { year: '2017', value: 1.68 },
  { year: '2018', value: 1.65 },
  { year: '2019', value: 1.62 },
  { year: '2020', value: 1.58 },
  { year: '2021', value: 1.62 },
  { year: '2022', value: 1.65 },
  { year: '2023', value: 1.68 },
  // Forecasts
  { year: 'FY1', value: 1.70, isEstimate: true },
  { year: 'FY2', value: 1.72, isEstimate: true },
];

export default function StockRiskPage({ params }: Props) {
  const mockCompanyData = {
    name: 'Oracle Corporation',
    symbol: params.symbol,
  };

  const renderBarChart = (
    data: any[],
    title: string,
    average: string,
    color: string,
    estimateColor: string,
    yAxisFormatter: (value: number) => string = (value) => `${value}%`
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
              tickFormatter={yAxisFormatter}
              tick={{ fontSize: 10 }}
              domain={[0, 'auto']}
            />
            <Tooltip 
              formatter={(value: any) => [yAxisFormatter(value), title]}
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
      case 'Probability of Default (PoD)':
        return 'PoD is an estimate of the likelihood that a company will default on its debt obligations.';
      case 'Debt-to-EBITDA Ratio':
        return 'Debt-to-EBITDA measures a company\'s ability to pay off its debt using its operating income.';
      case 'Interest Coverage Ratio':
        return 'Interest Coverage Ratio shows how easily a company can pay interest on its outstanding debt.';
      case 'Debt-to-Equity Ratio':
        return 'Debt-to-Equity Ratio indicates the relative proportion of shareholder equity and debt used to finance assets.';
      case 'Current Ratio':
        return 'Current Ratio measures a company\'s ability to pay short-term obligations within one year.';
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
              <h2 className="text-sm font-bold uppercase tracking-wider">Risk Analysis</h2>
              <div className="text-xs text-gray-500">Updated: Mar 15, 2024</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                {renderBarChart(
                  mockPoDData,
                  'Probability of Default (PoD)',
                  '1.26%',
                  '#DC2626',  // Red for historical
                  '#FCA5A5'   // Light red for estimates
                )}

                {renderBarChart(
                  mockDebtToEbitdaData,
                  'Debt-to-EBITDA Ratio',
                  '1.85x',
                  '#9D174D',  // Dark pink for historical
                  '#F472B6',   // Light pink for estimates
                  (value) => `${value}x`
                )}

                {renderBarChart(
                  mockInterestCoverageData,
                  'Interest Coverage Ratio',
                  '12.8x',
                  '#1D4ED8',  // Blue for historical
                  '#93C5FD',  // Light blue for estimates
                  (value) => `${value}x`
                )}
              </div>

              {/* Right Column */}
              <div>
                {renderBarChart(
                  mockDebtToEquityData,
                  'Debt-to-Equity Ratio',
                  '0.59x',
                  '#4B5563',  // Gray for historical
                  '#9CA3AF',  // Light gray for estimates
                  (value) => `${value}x`
                )}

                {renderBarChart(
                  mockCurrentRatioData,
                  'Current Ratio',
                  '1.68x',
                  '#065F46',  // Green for historical
                  '#6EE7B7',  // Light green for estimates
                  (value) => `${value}x`
                )}
              </div>
            </div>

            {/* Risk Assessment Summary */}
            <div className="mt-8 bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold mb-2">Risk Assessment Summary</h3>
              <p className="text-xs text-gray-700 mb-2">
                {params.symbol} shows a moderate risk profile with a probability of default of 1.3% in 2023, which is below the industry average of 2.1%. 
                The company's leverage metrics have remained relatively stable over the past few years, with a slight improvement in the debt-to-EBITDA ratio.
              </p>
              <p className="text-xs text-gray-700">
                The interest coverage ratio of 13.2x indicates strong ability to service debt obligations. 
                Forecasts suggest a continued improvement in risk metrics over the next two fiscal years, with the PoD expected to decrease to 1.1% by FY2.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Risk Metrics */}
        <div className="lg:col-span-3">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-xs font-semibold mb-3">Key Risk Metrics</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Credit Rating</span>
                  <span className="text-xs font-medium">BBB+</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Default Risk</span>
                  <span className="text-xs font-medium">Low</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Leverage Risk</span>
                  <span className="text-xs font-medium">Moderate</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Liquidity Risk</span>
                  <span className="text-xs font-medium">Low</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Industry Risk Ranking</span>
                  <span className="text-xs font-medium">12 of 45</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '27%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-xs font-medium mb-2">Risk Factors</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• High competition in cloud services</li>
                <li>• Technology obsolescence risk</li>
                <li>• Regulatory compliance challenges</li>
                <li>• Cybersecurity threats</li>
                <li>• Foreign exchange exposure</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 