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
  Cell,
  AreaChart,
  Area
} from 'recharts';

type Props = {
  params: {
    industryId: string;
  };
};

type PerformanceDataPoint = {
  date: string;
  industry: number;
  sp500: number;
  sector: number;
};

type MonthlyReturnDataPoint = {
  month: string;
  return: number;
};

export default function IndustryPerformancePage({ params }: Props) {
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y'>('1Y');
  const industryId = params.industryId;

  // Mock data for industry performance vs S&P 500 and sector
  const mockPerformanceData: PerformanceDataPoint[] = [
    { date: '2019-01', industry: 100, sp500: 100, sector: 100 },
    { date: '2019-04', industry: 108, sp500: 105, sector: 106 },
    { date: '2019-07', industry: 112, sp500: 108, sector: 110 },
    { date: '2019-10', industry: 118, sp500: 112, sector: 115 },
    { date: '2020-01', industry: 125, sp500: 115, sector: 120 },
    { date: '2020-04', industry: 115, sp500: 95, sector: 105 },
    { date: '2020-07', industry: 130, sp500: 110, sector: 118 },
    { date: '2020-10', industry: 142, sp500: 118, sector: 128 },
    { date: '2021-01', industry: 155, sp500: 125, sector: 138 },
    { date: '2021-04', industry: 168, sp500: 132, sector: 145 },
    { date: '2021-07', industry: 175, sp500: 138, sector: 150 },
    { date: '2021-10', industry: 182, sp500: 142, sector: 155 },
    { date: '2022-01', industry: 175, sp500: 138, sector: 148 },
    { date: '2022-04', industry: 165, sp500: 128, sector: 140 },
    { date: '2022-07', industry: 172, sp500: 135, sector: 145 },
    { date: '2022-10', industry: 168, sp500: 132, sector: 142 },
    { date: '2023-01', industry: 178, sp500: 140, sector: 150 },
    { date: '2023-04', industry: 188, sp500: 148, sector: 158 },
    { date: '2023-07', industry: 198, sp500: 155, sector: 165 },
    { date: '2023-10', industry: 205, sp500: 160, sector: 172 },
    { date: '2024-01', industry: 215, sp500: 168, sector: 180 },
  ];

  // Mock data for monthly returns
  const mockMonthlyReturns: MonthlyReturnDataPoint[] = [
    { month: 'Jan', return: 3.2 },
    { month: 'Feb', return: 1.8 },
    { month: 'Mar', return: -0.7 },
    { month: 'Apr', return: 2.5 },
    { month: 'May', return: 1.4 },
    { month: 'Jun', return: 3.8 },
    { month: 'Jul', return: 2.1 },
    { month: 'Aug', return: -1.2 },
    { month: 'Sep', return: -2.3 },
    { month: 'Oct', return: 4.2 },
    { month: 'Nov', return: 5.1 },
    { month: 'Dec', return: 2.7 },
  ];

  // Filter data based on selected timeframe
  const getFilteredPerformanceData = () => {
    const now = new Date('2024-01-01');
    let monthsToGoBack = 0;
    
    switch (timeframe) {
      case '1M': monthsToGoBack = 1; break;
      case '3M': monthsToGoBack = 3; break;
      case '6M': monthsToGoBack = 6; break;
      case '1Y': monthsToGoBack = 12; break;
      case '3Y': monthsToGoBack = 36; break;
      case '5Y': monthsToGoBack = 60; break;
    }
    
    const cutoffDate = new Date(now);
    cutoffDate.setMonth(now.getMonth() - monthsToGoBack);
    const cutoffDateStr = cutoffDate.toISOString().substring(0, 7); // YYYY-MM format
    
    const filteredData = mockPerformanceData.filter(item => item.date >= cutoffDateStr);
    
    if (filteredData.length === 0) return mockPerformanceData.slice(-2);
    
    // Normalize to 100 at the start of the period
    const firstPoint = filteredData[0];
    return filteredData.map(point => ({
      date: point.date,
      industry: (point.industry / firstPoint.industry) * 100,
      sp500: (point.sp500 / firstPoint.sp500) * 100,
      sector: (point.sector / firstPoint.sector) * 100
    }));
  };

  const filteredPerformanceData = getFilteredPerformanceData();
  
  // Calculate total returns for the period
  const firstPoint = filteredPerformanceData[0];
  const lastPoint = filteredPerformanceData[filteredPerformanceData.length - 1];
  
  const industryReturn = ((lastPoint.industry / firstPoint.industry) - 1) * 100;
  const sp500Return = ((lastPoint.sp500 / firstPoint.sp500) - 1) * 100;
  const sectorReturn = ((lastPoint.sector / firstPoint.sector) - 1) * 100;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Performance Analysis</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '1M' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('1M')}
          >
            1M
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '3M' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('3M')}
          >
            3M
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '6M' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('6M')}
          >
            6M
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '1Y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('1Y')}
          >
            1Y
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '3Y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('3Y')}
          >
            3Y
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded ${timeframe === '5Y' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setTimeframe('5Y')}
          >
            5Y
          </button>
        </div>
      </div>

      {/* Performance vs Market Chart */}
      <div className="bg-white p-4 border rounded-md">
        <h2 className="text-sm font-semibold mb-4">Relative Performance (Indexed to 100)</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredPerformanceData} margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                formatter={(value: any) => [`${value.toFixed(1)}`, '']}
                labelStyle={{ fontSize: 12 }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="industry" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false} 
                name={`${industryId.charAt(0).toUpperCase() + industryId.slice(1)} Industry`}
              />
              <Line 
                type="monotone" 
                dataKey="sector" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false} 
                name="Sector"
              />
              <Line 
                type="monotone" 
                dataKey="sp500" 
                stroke="#9ca3af" 
                strokeWidth={2} 
                dot={false} 
                name="S&P 500"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500">Industry</div>
            <div className={`text-sm font-semibold ${industryReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {industryReturn >= 0 ? '+' : ''}{industryReturn.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Sector</div>
            <div className={`text-sm font-semibold ${sectorReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {sectorReturn >= 0 ? '+' : ''}{sectorReturn.toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">S&P 500</div>
            <div className={`text-sm font-semibold ${sp500Return >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {sp500Return >= 0 ? '+' : ''}{sp500Return.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Returns Chart */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">Monthly Returns (Last 12 Months)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyReturns} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis 
                  tick={{ fontSize: 11 }} 
                  domain={[-5, 10]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Return']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="return">
                  {mockMonthlyReturns.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.return >= 0 ? '#10b981' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Average Monthly Return: <span className="font-semibold">
              {(mockMonthlyReturns.reduce((sum, item) => sum + item.return, 0) / mockMonthlyReturns.length).toFixed(1)}%
            </span>
          </p>
        </div>

        {/* Performance Stats */}
        <div className="bg-white p-4 border rounded-md">
          <h2 className="text-sm font-semibold mb-4">Performance Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Annualized Return (5Y)</div>
              <div className="text-sm font-semibold">16.5%</div>
            </div>
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Annualized Volatility</div>
              <div className="text-sm font-semibold">22.8%</div>
            </div>
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Sharpe Ratio</div>
              <div className="text-sm font-semibold">0.72</div>
            </div>
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Beta (vs S&P 500)</div>
              <div className="text-sm font-semibold">1.24</div>
            </div>
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Alpha (vs S&P 500)</div>
              <div className="text-sm font-semibold">3.8%</div>
            </div>
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Max Drawdown (5Y)</div>
              <div className="text-sm font-semibold">-28.4%</div>
            </div>
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Positive Months</div>
              <div className="text-sm font-semibold">67%</div>
            </div>
            <div className="border-b pb-2">
              <div className="text-xs text-gray-500">Best Month</div>
              <div className="text-sm font-semibold">+12.8%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h2 className="text-sm font-bold mb-2">Performance Analysis</h2>
        <p className="text-sm text-gray-600 mb-4">
          {industryId === 'semiconductors' && (
            "The semiconductor industry has significantly outperformed the broader market over the past several years, driven by strong demand for chips across multiple end markets including computing, data centers, automotive, and consumer electronics. The industry has demonstrated cyclicality but with an overall strong upward trajectory. Recent performance has been particularly strong due to AI-related demand and supply constraints."
          )}
          {industryId !== 'semiconductors' && (
            `The ${industryId} industry has shown a ${industryReturn > sp500Return ? 'stronger' : 'weaker'} performance compared to the broader market over the selected timeframe. With a ${timeframe} return of ${industryReturn.toFixed(1)}% versus ${sp500Return.toFixed(1)}% for the S&P 500, the industry demonstrates ${industryReturn > sp500Return ? 'outperformance' : 'underperformance'} that reflects its specific market dynamics and growth characteristics.`
          )}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold mb-2">Performance Drivers</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Strong revenue growth across major players</li>
              <li>Margin expansion from operational efficiencies</li>
              <li>Increased market consolidation</li>
              <li>Product innovation and new market entry</li>
              <li>Favorable regulatory developments</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold mb-2">Risk Factors</h3>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Cyclical demand patterns</li>
              <li>Supply chain disruptions</li>
              <li>Increased competitive intensity</li>
              <li>Regulatory headwinds in key markets</li>
              <li>Macroeconomic sensitivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 