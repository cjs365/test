'use client';

import { useState } from 'react';
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
    industryId: string;
  };
};

type FinancialDataPoint = {
  year: string;
  value: number;
  isEstimate?: boolean;
};

type FinancialMetric = {
  title: string;
  data: FinancialDataPoint[];
  format: string;
  description: string;
};

export default function IndustryFinancialsPage({ params }: Props) {
  const [view, setView] = useState<'aggregate' | 'growth'>('aggregate');
  const industryId = params.industryId;

  // Mock financial data
  const financialMetrics: Record<string, FinancialMetric> = {
    revenue: {
      title: 'Revenue',
      data: [
        { year: '2018', value: 482.5 },
        { year: '2019', value: 528.7 },
        { year: '2020', value: 552.1 },
        { year: '2021', value: 639.4 },
        { year: '2022', value: 718.2 },
        { year: '2023', value: 781.5 },
        { year: '2024', value: 851.8, isEstimate: true },
        { year: '2025', value: 935.4, isEstimate: true },
        { year: '2026', value: 1028.9, isEstimate: true },
      ],
      format: 'currency',
      description: 'Total industry revenue in billions USD.'
    },
    grossMargin: {
      title: 'Gross Margin',
      data: [
        { year: '2018', value: 48.2 },
        { year: '2019', value: 49.5 },
        { year: '2020', value: 47.8 },
        { year: '2021', value: 51.2 },
        { year: '2022', value: 52.5 },
        { year: '2023', value: 53.8 },
        { year: '2024', value: 54.2, isEstimate: true },
        { year: '2025', value: 54.5, isEstimate: true },
        { year: '2026', value: 54.8, isEstimate: true },
      ],
      format: 'percentage',
      description: 'Average gross margin across the industry.'
    },
    operatingMargin: {
      title: 'Operating Margin',
      data: [
        { year: '2018', value: 18.5 },
        { year: '2019', value: 19.2 },
        { year: '2020', value: 16.8 },
        { year: '2021', value: 21.5 },
        { year: '2022', value: 22.8 },
        { year: '2023', value: 23.4 },
        { year: '2024', value: 24.1, isEstimate: true },
        { year: '2025', value: 24.5, isEstimate: true },
        { year: '2026', value: 24.8, isEstimate: true },
      ],
      format: 'percentage',
      description: 'Average operating margin across the industry.'
    },
    netMargin: {
      title: 'Net Profit Margin',
      data: [
        { year: '2018', value: 12.4 },
        { year: '2019', value: 13.1 },
        { year: '2020', value: 10.8 },
        { year: '2021', value: 15.2 },
        { year: '2022', value: 16.4 },
        { year: '2023', value: 17.2 },
        { year: '2024', value: 17.8, isEstimate: true },
        { year: '2025', value: 18.2, isEstimate: true },
        { year: '2026', value: 18.5, isEstimate: true },
      ],
      format: 'percentage',
      description: 'Average net profit margin across the industry.'
    },
    capex: {
      title: 'Capital Expenditure',
      data: [
        { year: '2018', value: 58.4 },
        { year: '2019', value: 62.8 },
        { year: '2020', value: 55.2 },
        { year: '2021', value: 72.5 },
        { year: '2022', value: 89.8 },
        { year: '2023', value: 102.4 },
        { year: '2024', value: 115.8, isEstimate: true },
        { year: '2025', value: 128.5, isEstimate: true },
        { year: '2026', value: 142.2, isEstimate: true },
      ],
      format: 'currency',
      description: 'Total industry capital expenditure in billions USD.'
    },
    rAndD: {
      title: 'R&D Expense',
      data: [
        { year: '2018', value: 42.8 },
        { year: '2019', value: 48.2 },
        { year: '2020', value: 52.5 },
        { year: '2021', value: 62.4 },
        { year: '2022', value: 72.8 },
        { year: '2023', value: 82.5 },
        { year: '2024', value: 92.4, isEstimate: true },
        { year: '2025', value: 102.8, isEstimate: true },
        { year: '2026', value: 114.5, isEstimate: true },
      ],
      format: 'currency',
      description: 'Total industry research and development expense in billions USD.'
    }
  };

  // Calculate growth rates for each metric
  const calculateGrowthData = (data: FinancialDataPoint[]): FinancialDataPoint[] => {
    const growthData: FinancialDataPoint[] = [];
    
    for (let i = 1; i < data.length; i++) {
      const currentYear = data[i];
      const previousYear = data[i - 1];
      const growthRate = ((currentYear.value / previousYear.value) - 1) * 100;
      
      growthData.push({
        year: currentYear.year,
        value: parseFloat(growthRate.toFixed(1)),
        isEstimate: currentYear.isEstimate
      });
    }
    
    return growthData;
  };

  // Prepare data based on selected view
  const getChartData = (metricKey: string) => {
    const metric = financialMetrics[metricKey];
    
    if (view === 'growth') {
      return calculateGrowthData(metric.data);
    }
    
    return metric.data;
  };

  // Format values for display
  const formatValue = (value: number, format: string) => {
    if (format === 'currency') {
      return `$${value}B`;
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Financial Analysis</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-1 text-sm rounded ${view === 'aggregate' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('aggregate')}
          >
            Absolute Values
          </button>
          <button 
            className={`px-4 py-1 text-sm rounded ${view === 'growth' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('growth')}
          >
            Growth Rates
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">{view === 'growth' ? 'Revenue Growth' : 'Revenue'}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData('revenue')} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  domain={view === 'growth' ? [0, 'auto'] : [0, 'auto']}
                  tickFormatter={(value) => view === 'growth' ? `${value}%` : `$${value}B`}
                />
                <Tooltip 
                  formatter={(value: any) => [
                    view === 'growth' ? `${value}%` : `$${value}B`, 
                    view === 'growth' ? 'Growth' : 'Revenue'
                  ]}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value">
                  {getChartData('revenue').map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.isEstimate ? '#bfdbfe' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {financialMetrics.revenue.description}
          </p>
        </div>

        {/* Gross Margin Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">{view === 'growth' ? 'Gross Margin Change' : 'Gross Margin'}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData('grossMargin')} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  domain={view === 'growth' ? ['auto', 'auto'] : [0, 60]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, view === 'growth' ? 'Change' : 'Margin']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value">
                  {getChartData('grossMargin').map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.isEstimate ? '#bfdbfe' : (view === 'growth' && entry.value < 0) ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {financialMetrics.grossMargin.description}
          </p>
        </div>

        {/* Operating Margin Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">{view === 'growth' ? 'Operating Margin Change' : 'Operating Margin'}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData('operatingMargin')} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  domain={view === 'growth' ? ['auto', 'auto'] : [0, 30]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, view === 'growth' ? 'Change' : 'Margin']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value">
                  {getChartData('operatingMargin').map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.isEstimate ? '#bfdbfe' : (view === 'growth' && entry.value < 0) ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {financialMetrics.operatingMargin.description}
          </p>
        </div>

        {/* Net Margin Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">{view === 'growth' ? 'Net Margin Change' : 'Net Profit Margin'}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData('netMargin')} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  domain={view === 'growth' ? ['auto', 'auto'] : [0, 25]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, view === 'growth' ? 'Change' : 'Margin']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value">
                  {getChartData('netMargin').map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.isEstimate ? '#bfdbfe' : (view === 'growth' && entry.value < 0) ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {financialMetrics.netMargin.description}
          </p>
        </div>

        {/* CapEx Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">{view === 'growth' ? 'CapEx Growth' : 'Capital Expenditure'}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData('capex')} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  domain={view === 'growth' ? [0, 'auto'] : [0, 'auto']}
                  tickFormatter={(value) => view === 'growth' ? `${value}%` : `$${value}B`}
                />
                <Tooltip 
                  formatter={(value: any) => [
                    view === 'growth' ? `${value}%` : `$${value}B`, 
                    view === 'growth' ? 'Growth' : 'CapEx'
                  ]}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value">
                  {getChartData('capex').map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.isEstimate ? '#bfdbfe' : (view === 'growth' && entry.value < 0) ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {financialMetrics.capex.description}
          </p>
        </div>

        {/* R&D Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">{view === 'growth' ? 'R&D Growth' : 'R&D Expense'}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData('rAndD')} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  domain={view === 'growth' ? [0, 'auto'] : [0, 'auto']}
                  tickFormatter={(value) => view === 'growth' ? `${value}%` : `$${value}B`}
                />
                <Tooltip 
                  formatter={(value: any) => [
                    view === 'growth' ? `${value}%` : `$${value}B`, 
                    view === 'growth' ? 'Growth' : 'R&D'
                  ]}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="value">
                  {getChartData('rAndD').map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.isEstimate ? '#bfdbfe' : (view === 'growth' && entry.value < 0) ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {financialMetrics.rAndD.description}
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h2 className="text-sm font-bold mb-2">Financial Summary</h2>
        <p className="text-sm text-gray-600 mb-4">
          {industryId === 'semiconductors' && (
            "The semiconductor industry has shown strong financial performance with consistent revenue growth and improving margins over the past several years. Capital expenditure has increased significantly as companies invest in new manufacturing capacity to meet growing demand. R&D spending continues to rise as companies compete to develop more advanced chip technologies, particularly for AI, data centers, and advanced computing applications."
          )}
          {industryId !== 'semiconductors' && (
            `The ${industryId} industry has demonstrated solid financial performance with revenue growing at a compound annual growth rate (CAGR) of approximately 10% over the past five years. Profitability metrics show steady improvement with net margins expanding from ${financialMetrics.netMargin.data[0].value}% in ${financialMetrics.netMargin.data[0].year} to ${financialMetrics.netMargin.data[financialMetrics.netMargin.data.length - 4].value}% in ${financialMetrics.netMargin.data[financialMetrics.netMargin.data.length - 4].year}, reflecting operational efficiencies and economies of scale.`
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold mb-2">Financial Strengths</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Strong revenue growth trajectory</li>
              <li>Improving profit margins</li>
              <li>Significant R&D investment</li>
              <li>Strategic capital allocation</li>
              <li>Healthy cash flow generation</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold mb-2">Financial Challenges</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Increasing capital intensity</li>
              <li>Rising R&D costs</li>
              <li>Cyclical demand patterns</li>
              <li>Competitive pricing pressure</li>
              <li>Supply chain cost fluctuations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 