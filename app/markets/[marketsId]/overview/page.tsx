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
    marketsId: string;
  };
};

type FinancialDataPoint = {
  year: string;
  value: number | null;
  isEstimate?: boolean;
};

type TopStock = {
  ticker: string;
  name: string;
  marketCap: number; // in billions
  aroicLFY: number; // Last Fiscal Year
  aroicNTM: number; // Next Twelve Months
  pe: number;
  pb: number;
  return1M: number;
  return12M: number;
};

export default function IndustryOverviewPage({ params }: Props) {
  const [timeframe, setTimeframe] = useState<'1Y' | '3Y' | '5Y'>('1Y');
  const marketsId = params.marketsId;

  // Mock data for industry metrics
  const mockIndustryData = {
    name: marketsId.charAt(0).toUpperCase() + marketsId.slice(1),
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

  // Mock data for top 10 stocks by market cap
  const mockTopStocks: TopStock[] = [
    { ticker: "AAPL", name: "Apple Inc.", marketCap: 2850.5, aroicLFY: 32.4, aroicNTM: 33.8, pe: 28.5, pb: 15.8, return1M: 3.2, return12M: 21.5 },
    { ticker: "MSFT", name: "Microsoft Corp.", marketCap: 2750.2, aroicLFY: 29.8, aroicNTM: 31.2, pe: 32.1, pb: 12.3, return1M: 2.8, return12M: 24.7 },
    { ticker: "NVDA", name: "NVIDIA Corp.", marketCap: 2200.8, aroicLFY: 35.6, aroicNTM: 38.2, pe: 45.3, pb: 22.5, return1M: 5.6, return12M: 120.3 },
    { ticker: "GOOGL", name: "Alphabet Inc.", marketCap: 1950.3, aroicLFY: 25.3, aroicNTM: 26.7, pe: 24.8, pb: 6.2, return1M: 1.5, return12M: 18.2 },
    { ticker: "AMZN", name: "Amazon.com Inc.", marketCap: 1850.7, aroicLFY: 18.2, aroicNTM: 21.5, pe: 36.7, pb: 8.9, return1M: 2.3, return12M: 15.8 },
    { ticker: "META", name: "Meta Platforms Inc.", marketCap: 1250.4, aroicLFY: 22.8, aroicNTM: 24.3, pe: 26.1, pb: 7.4, return1M: 4.2, return12M: 35.6 },
    { ticker: "TSLA", name: "Tesla Inc.", marketCap: 850.6, aroicLFY: 19.5, aroicNTM: 21.8, pe: 62.3, pb: 10.5, return1M: -2.8, return12M: -15.3 },
    { ticker: "TSM", name: "Taiwan Semiconductor", marketCap: 780.3, aroicLFY: 26.7, aroicNTM: 28.2, pe: 22.5, pb: 5.8, return1M: 3.5, return12M: 42.7 },
    { ticker: "AVGO", name: "Broadcom Inc.", marketCap: 620.5, aroicLFY: 24.3, aroicNTM: 25.8, pe: 28.7, pb: 9.2, return1M: 1.8, return12M: 32.5 },
    { ticker: "ASML", name: "ASML Holding N.V.", marketCap: 580.2, aroicLFY: 28.5, aroicNTM: 29.7, pe: 32.4, pb: 14.3, return1M: 2.5, return12M: 28.7 }
  ];

  // Mock data for industry AROIC
  const mockAroicData: FinancialDataPoint[] = [
    { year: '2014', value: 15.2 },
    { year: '2015', value: 16.5 },
    { year: '2016', value: 15.3 },
    { year: '2017', value: 16.8 },
    { year: '2018', value: 17.1 },
    { year: '2019', value: 16.5 },
    { year: '2020', value: 14.3 },
    { year: '2021', value: 18.8 },
    { year: '2022', value: 19.2 },
    { year: '2023', value: 18.8 },
    // Forecasts
    { year: 'FY1', value: 19.5, isEstimate: true },
    { year: 'FY2', value: 20.2, isEstimate: true },
    { year: 'FY3', value: 21.5, isEstimate: true },
  ];

  // Mock data for industry asset growth
  const mockAssetGrowthData: FinancialDataPoint[] = [
    { year: '2014', value: 10.5 },
    { year: '2015', value: 11.2 },
    { year: '2016', value: 9.8 },
    { year: '2017', value: 12.1 },
    { year: '2018', value: 13.4 },
    { year: '2019', value: 11.8 },
    { year: '2020', value: 8.5 },
    { year: '2021', value: 14.6 },
    { year: '2022', value: 13.2 },
    { year: '2023', value: 11.4 },
    // Forecasts
    { year: 'FY1', value: 12.5, isEstimate: true },
    { year: 'FY2', value: 13.2, isEstimate: true },
    { year: 'FY3', value: 13.8, isEstimate: true },
  ];

  // Mock data for industry performance vs benchmark
  const mockPerformanceData = [
    { date: '2023-01', industry: 5.2, benchmark: 4.8 },
    { date: '2023-02', industry: 3.5, benchmark: 2.2 },
    { date: '2023-03', industry: -1.1, benchmark: -0.8 },
    { date: '2023-04', industry: 2.8, benchmark: 1.5 },
    { date: '2023-05', industry: 4.4, benchmark: 3.2 },
    { date: '2023-06', industry: -0.7, benchmark: -1.2 },
    { date: '2023-07', industry: 6.8, benchmark: 4.5 },
    { date: '2023-08', industry: 2.4, benchmark: 1.2 },
    { date: '2023-09', industry: -2.1, benchmark: -1.5 },
    { date: '2023-10', industry: 5.8, benchmark: 3.2 },
    { date: '2023-11', industry: 7.4, benchmark: 4.2 },
    { date: '2023-12', industry: 3.4, benchmark: 2.2 },
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
            {/* AROIC Chart */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold">Industry Adjusted Return on Invested Capital (AROIC)</h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">10Y Average: 16.7%</span>
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
                      interval={1}
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
                Industry AROIC measures how efficiently companies in the industry generate profits from invested capital, adjusted for accounting distortions.
              </p>
            </div>

            {/* Asset Growth Chart */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold">Industry Asset Growth</h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">10Y Average: 11.5%</span>
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
                Industry asset growth shows the year-over-year change in total assets across companies in the industry, indicating expansion rates and capital deployment.
              </p>
            </div>

            {/* Performance vs Benchmark */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold">Performance vs Benchmark (2023)</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                  <span>Industry</span>
                  <span className="w-3 h-3 bg-gray-400 rounded-sm"></span>
                  <span>Benchmark</span>
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
                      formatter={(value: any) => [`${value}%`, value === mockPerformanceData[0].industry ? 'Industry' : 'Benchmark']}
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
                      dataKey="benchmark" 
                      stroke="#9ca3af" 
                      strokeWidth={2} 
                      dot={{ r: 3 }} 
                      name="Benchmark"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Monthly performance comparison between the industry and its relevant market benchmark.
              </p>
            </div>
          </div>
        </section>

        {/* Top Stocks Section */}
        <section className="pb-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">Top 10 Stocks by Market Cap</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap (USD bn)</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">AROIC LFY</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">AROIC NTM</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/E</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P/B</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">1M Return</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">12M Return</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockTopStocks.map((stock) => (
                  <tr key={stock.ticker} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-blue-600">{stock.ticker}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{stock.name}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right">{stock.marketCap.toFixed(1)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right">{stock.aroicLFY.toFixed(1)}%</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right">{stock.aroicNTM.toFixed(1)}%</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right">{stock.pe.toFixed(1)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 text-right">{stock.pb.toFixed(1)}</td>
                    <td className={`px-3 py-2 whitespace-nowrap text-xs text-right ${stock.return1M >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.return1M >= 0 ? '+' : ''}{stock.return1M.toFixed(1)}%
                    </td>
                    <td className={`px-3 py-2 whitespace-nowrap text-xs text-right ${stock.return12M >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.return12M >= 0 ? '+' : ''}{stock.return12M.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            LFY = Last Fiscal Year, NTM = Next Twelve Months (estimated)
          </p>
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
      </div>
    </div>
  );
} 