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
  PieChart,
  Pie
} from 'recharts';
import ScoreGauge from '@/app/components/charts/ScoreGauge';
import MetricCard from '@/app/components/charts/MetricCard';

type Props = {
  params: {
    industryId: string;
  };
};

type FinancialDataPoint = {
  year: string;
  value: number | null;
  isEstimate?: boolean;
};

export default function IndustryOverviewPage({ params }: Props) {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  const industryId = params.industryId;

  // Mock data for industry metrics
  const mockIndustryData = {
    name: industryId.charAt(0).toUpperCase() + industryId.slice(1),
    metrics: {
      peRatio: 24.8,
      priceToSales: 3.2,
      priceToBook: 4.1,
      evToEbitda: 15.7,
      dividendYield: 1.8,
      debtToEquity: 0.68,
      profitMargin: 12.4,
      operatingMargin: 18.7,
      returnOnEquity: 19.2,
      returnOnAssets: 8.7
    }
  };

  // Mock data for industry revenue growth
  const mockRevenueGrowthData: FinancialDataPoint[] = [
    { year: '2014', value: 8.2 },
    { year: '2015', value: 9.5 },
    { year: '2016', value: 7.3 },
    { year: '2017', value: 10.8 },
    { year: '2018', value: 12.1 },
    { year: '2019', value: 9.5 },
    { year: '2020', value: 4.3 },
    { year: '2021', value: 15.8 },
    { year: '2022', value: 12.2 },
    { year: '2023', value: 8.8 },
    // Forecasts
    { year: 'FY1', value: 9.5, isEstimate: true },
    { year: 'FY2', value: 10.2, isEstimate: true },
    { year: 'FY3', value: 11.5, isEstimate: true },
  ];

  // Mock data for industry profit margin
  const mockProfitMarginData: FinancialDataPoint[] = [
    { year: '2014', value: 10.5 },
    { year: '2015', value: 11.2 },
    { year: '2016', value: 10.8 },
    { year: '2017', value: 12.1 },
    { year: '2018', value: 13.4 },
    { year: '2019', value: 12.8 },
    { year: '2020', value: 9.5 },
    { year: '2021', value: 13.6 },
    { year: '2022', value: 14.2 },
    { year: '2023', value: 12.4 },
    // Forecasts
    { year: 'FY1', value: 13.5, isEstimate: true },
    { year: 'FY2', value: 14.2, isEstimate: true },
    { year: 'FY3', value: 14.8, isEstimate: true },
  ];

  // Mock data for industry performance vs market
  const mockPerformanceData = [
    { date: '2023-01', industry: 5.2, market: 4.8 },
    { date: '2023-02', industry: 3.5, market: 2.2 },
    { date: '2023-03', industry: -1.1, market: -0.8 },
    { date: '2023-04', industry: 2.8, market: 1.5 },
    { date: '2023-05', industry: 4.4, market: 3.2 },
    { date: '2023-06', industry: -0.7, market: -1.2 },
    { date: '2023-07', industry: 6.8, market: 4.5 },
    { date: '2023-08', industry: 2.4, market: 1.2 },
    { date: '2023-09', industry: -2.1, market: -1.5 },
    { date: '2023-10', industry: 5.8, market: 3.2 },
    { date: '2023-11', industry: 7.4, market: 4.2 },
    { date: '2023-12', industry: 3.4, market: 2.2 },
  ];

  // Mock data for market cap distribution
  const mockMarketCapDistribution = [
    { name: 'Large Cap', value: 68 },
    { name: 'Mid Cap', value: 24 },
    { name: 'Small Cap', value: 8 },
  ];

  // Mock data for geographic distribution
  const mockGeographicDistribution = [
    { name: 'North America', value: 62 },
    { name: 'Europe', value: 18 },
    { name: 'Asia', value: 15 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Industry Overview Section */}
        <section className="pb-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">Industry Overview</h2>
            <div className="text-xs text-gray-500">Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          
          <div className="space-y-6">
            {/* Revenue Growth Chart */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold">Industry Revenue Growth</h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">10Y Average: 9.7%</span>
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
                  <BarChart data={mockRevenueGrowthData} margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 11 }}
                      interval={1}
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
                      fill="#6b7280"
                    >
                      {mockRevenueGrowthData.map((entry, index) => (
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
                Industry revenue growth shows the year-over-year percentage change in total revenue across all companies in the industry.
              </p>
            </div>

            {/* Profit Margin Chart */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold">Industry Profit Margin</h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">10Y Average: 12.1%</span>
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
                  <BarChart data={mockProfitMarginData} margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fontSize: 11 }}
                      interval={1}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 11 }}
                      domain={[0, 'auto']}
                    />
                    <Tooltip 
                      formatter={(value: any) => value ? [`${value}%`, 'Margin'] : ['No data', 'Margin']}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Bar 
                      dataKey="value"
                    >
                      {mockProfitMarginData.map((entry) => (
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
                Industry profit margin represents the average net profit margin across all companies in the industry.
              </p>
            </div>

            {/* Performance vs Market */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold">Performance vs Market (2023)</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                  <span>Industry</span>
                  <span className="w-3 h-3 bg-gray-400 rounded-sm"></span>
                  <span>Market</span>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPerformanceData} margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11 }}
                      interval={1}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, value === mockPerformanceData[0].industry ? 'Industry' : 'Market']}
                      labelStyle={{ fontSize: 12 }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="industry" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      name="Industry"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="market" 
                      stroke="#9ca3af" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      name="Market"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Monthly performance comparison between the industry and the broader market index.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Right Column - Sidebar */}
      <div className="space-y-6">
        {/* Industry Metrics */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-bold mb-3">Key Industry Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <MetricCard 
              label="P/E Ratio" 
              value={mockIndustryData.metrics.peRatio.toFixed(1)} 
              change={2.3} 
              isPositiveGood={false}
            />
            <MetricCard 
              label="Price/Sales" 
              value={mockIndustryData.metrics.priceToSales.toFixed(1)} 
              change={-0.4} 
              isPositiveGood={false}
            />
            <MetricCard 
              label="Price/Book" 
              value={mockIndustryData.metrics.priceToBook.toFixed(1)} 
              change={0.2} 
              isPositiveGood={false}
            />
            <MetricCard 
              label="EV/EBITDA" 
              value={mockIndustryData.metrics.evToEbitda.toFixed(1)} 
              change={-1.2} 
              isPositiveGood={false}
            />
            <MetricCard 
              label="Dividend Yield" 
              value={`${mockIndustryData.metrics.dividendYield.toFixed(1)}%`} 
              change={0.3} 
              isPositiveGood={true}
            />
            <MetricCard 
              label="Debt/Equity" 
              value={mockIndustryData.metrics.debtToEquity.toFixed(2)} 
              change={-0.05} 
              isPositiveGood={false}
            />
            <MetricCard 
              label="Profit Margin" 
              value={`${mockIndustryData.metrics.profitMargin.toFixed(1)}%`} 
              change={-0.8} 
              isPositiveGood={true}
            />
            <MetricCard 
              label="Operating Margin" 
              value={`${mockIndustryData.metrics.operatingMargin.toFixed(1)}%`} 
              change={0.5} 
              isPositiveGood={true}
            />
            <MetricCard 
              label="ROE" 
              value={`${mockIndustryData.metrics.returnOnEquity.toFixed(1)}%`} 
              change={1.2} 
              isPositiveGood={true}
            />
            <MetricCard 
              label="ROA" 
              value={`${mockIndustryData.metrics.returnOnAssets.toFixed(1)}%`} 
              change={0.4} 
              isPositiveGood={true}
            />
          </div>
        </div>

        {/* Industry Composition */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-bold mb-3">Industry Composition</h3>
          
          {/* Market Cap Distribution */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold mb-2">Market Cap Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockMarketCapDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockMarketCapDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div>
            <h4 className="text-xs font-semibold mb-2">Geographic Distribution</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockGeographicDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockGeographicDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Industry Health Score */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-bold mb-3">Industry Health Score</h3>
          <div className="flex justify-center">
            <ScoreGauge score={76} maxScore={100} label="Overall Health" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="text-center">
              <ScoreGauge score={82} maxScore={100} size="small" label="Growth" />
            </div>
            <div className="text-center">
              <ScoreGauge score={68} maxScore={100} size="small" label="Stability" />
            </div>
            <div className="text-center">
              <ScoreGauge score={74} maxScore={100} size="small" label="Profitability" />
            </div>
            <div className="text-center">
              <ScoreGauge score={79} maxScore={100} size="small" label="Valuation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 