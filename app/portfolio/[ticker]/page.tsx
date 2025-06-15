'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/app/context/ThemeProvider';
import PerformanceTab from './performance';
import HoldingsTab from './holdings';
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

// Mock data for model portfolios - same as in the main portfolio page
const mockModelPortfolios = [
  {
    id: 'tech-growth',
    name: 'Tech Growth Leaders',
    ticker: 'TGRT',
    market: 'US',
    description: 'High-growth technology companies with strong competitive advantages and market-leading positions. This portfolio focuses on innovative companies driving technological transformation across various sectors, with a bias towards software, semiconductors, and internet services.',
    category: 'Technology',
    riskLevel: 'High',
    performance: {
      oneMonth: '+2.3%',
      ytd: '+28.4%',
      oneYear: '+32.7%',
      threeYear: '+21.5%',
      fiveYear: '+19.8%',
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 142 },
      { year: 2021, value: 198 },
      { year: 2022, value: 176 },
      { year: 2023, value: 245 },
      { year: 2024, value: 324 },
    ],
    benchmarkData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 116 },
      { year: 2021, value: 150 },
      { year: 2022, value: 135 },
      { year: 2023, value: 165 },
      { year: 2024, value: 195 },
    ],
    manager: 'Sarah Johnson',
    inception: 'January 15, 2019',
    aum: '$1.85 billion',
    holdings: ['NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AAPL', 'ADBE', 'CRM', 'TSM', 'AVGO']
  },
  {
    id: 'dividend-income',
    name: 'Dividend Income',
    ticker: 'DINC',
    market: 'US',
    description: 'Stable companies with consistent dividend growth history and strong balance sheets. This portfolio targets income-generating equities with sustainable payout ratios and a history of increasing dividends, focusing on established companies in defensive sectors.',
    category: 'Income',
    riskLevel: 'Low',
    performance: {
      oneMonth: '+2.3%',
      ytd: '+8.6%',
      oneYear: '+12.5%',
      threeYear: '+9.8%',
      fiveYear: '+10.5%',
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 95 },
      { year: 2021, value: 112 },
      { year: 2022, value: 124 },
      { year: 2023, value: 142 },
      { year: 2024, value: 154 },
    ],
    benchmarkData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 97 },
      { year: 2021, value: 108 },
      { year: 2022, value: 115 },
      { year: 2023, value: 126 },
      { year: 2024, value: 135 },
    ],
    manager: 'Robert Chen',
    inception: 'March 1, 2019',
    aum: '$2.4 billion',
    holdings: ['JNJ', 'PG', 'KO', 'PEP', 'VZ', 'XOM', 'CVX', 'MMM', 'MCD', 'T']
  },
  {
    id: 'balanced-growth',
    name: 'Balanced Growth',
    ticker: 'BLGR',
    market: 'US',
    description: 'Diversified portfolio with moderate growth and income components, designed for long-term capital appreciation with reduced volatility. This portfolio balances growth-oriented stocks with stable dividend payers across multiple sectors for a smoother return profile.',
    category: 'Balanced',
    riskLevel: 'Medium',
    performance: {
      oneMonth: '+2.3%',
      ytd: '+14.2%',
      oneYear: '+18.9%',
      threeYear: '+15.2%',
      fiveYear: '+13.4%',
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 112 },
      { year: 2021, value: 134 },
      { year: 2022, value: 142 },
      { year: 2023, value: 168 },
      { year: 2024, value: 192 },
    ],
    benchmarkData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 105 },
      { year: 2021, value: 122 },
      { year: 2022, value: 128 },
      { year: 2023, value: 145 },
      { year: 2024, value: 162 },
    ],
    manager: 'David Williams',
    inception: 'June 12, 2019',
    aum: '$3.2 billion',
    holdings: ['AAPL', 'BRK.B', 'HD', 'UNH', 'V', 'MSFT', 'JPM', 'JNJ', 'PG', 'MA']
  },
  {
    id: 'healthcare-innovation',
    name: 'Healthcare Innovation',
    ticker: 'HCIN',
    market: 'US',
    description: 'Companies at the forefront of healthcare technology and services, with a focus on innovative treatments, medical devices, and healthcare delivery systems. This portfolio targets transformative healthcare companies with strong growth prospects and competitive advantages.',
    category: 'Healthcare',
    riskLevel: 'Medium-High',
    performance: {
      oneMonth: '+2.3%',
      ytd: '+18.7%',
      oneYear: '+22.5%',
      threeYear: '+17.8%',
      fiveYear: '+16.3%',
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 128 },
      { year: 2021, value: 145 },
      { year: 2022, value: 132 },
      { year: 2023, value: 156 },
      { year: 2024, value: 185 },
    ],
    benchmarkData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 118 },
      { year: 2021, value: 132 },
      { year: 2022, value: 122 },
      { year: 2023, value: 138 },
      { year: 2024, value: 155 },
    ],
    manager: 'Emily Rodriguez',
    inception: 'September 8, 2019',
    aum: '$1.35 billion',
    holdings: ['UNH', 'LLY', 'ISRG', 'ABBV', 'TMO', 'JNJ', 'AMGN', 'ABT', 'DHR', 'GILD']
  },
  {
    id: 'esg-leaders',
    name: 'ESG Leaders',
    ticker: 'ESGL',
    market: 'US',
    description: 'Companies with strong environmental, social, and governance practices that demonstrate leadership in sustainability and responsible business practices. This portfolio focuses on forward-thinking companies that balance financial returns with positive impacts on society and the environment.',
    category: 'ESG',
    riskLevel: 'Medium',
    performance: {
      oneMonth: '+2.3%',
      ytd: '+12.8%',
      oneYear: '+16.5%',
      threeYear: '+13.2%',
      fiveYear: '+12.1%',
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 115 },
      { year: 2021, value: 132 },
      { year: 2022, value: 128 },
      { year: 2023, value: 145 },
      { year: 2024, value: 164 },
    ],
    benchmarkData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 105 },
      { year: 2021, value: 122 },
      { year: 2022, value: 118 },
      { year: 2023, value: 132 },
      { year: 2024, value: 145 },
    ],
    manager: 'Michael Thompson',
    inception: 'November 21, 2019',
    aum: '$950 million',
    holdings: ['MSFT', 'CSCO', 'ADBE', 'CRM', 'NFLX', 'GOOGL', 'INTC', 'NVDA', 'PYPL', 'ADP']
  }
];

// Mock holdings data
const mockHoldingsData = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Information Technology', weight: 8.5 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Information Technology', weight: 7.8 },
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Information Technology', weight: 6.9 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', weight: 5.7 },
  { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', sector: 'Communication Services', weight: 5.2 },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', weight: 4.8 },
];

export default function PortfolioDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const params = useParams() || {};
  const ticker = typeof params.ticker === 'string' ? params.ticker : '';
  
  // Find the portfolio by ticker
  const portfolio = mockModelPortfolios.find(p => p.ticker.toLowerCase() === ticker.toLowerCase()) || mockModelPortfolios[0];
  
  const combinedChartData = portfolio.chartData.map((item, index) => ({
    year: item.year,
    portfolio: item.value,
    benchmark: portfolio.benchmarkData[index].value
  }));
  
  return (
    <MainLayout>
      <div className="py-6">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {portfolio.name}
                </h1>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  {portfolio.ticker} · {portfolio.market} · {portfolio.holdings.length} positions
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={isDark ? "outline" : "secondary"} className="text-xs">
                  {portfolio.category}
                </Badge>
                <Badge variant={
                  portfolio.riskLevel === 'Low' ? 'success' :
                  portfolio.riskLevel === 'Medium' ? 'warning' :
                  'destructive'
                } className="text-xs">
                  {portfolio.riskLevel} Risk
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="portfolio-nav border-b mb-6">
            <button className="portfolio-nav-item active">
              Overview
            </button>
            <button className="portfolio-nav-item">
              Performance
            </button>
            <button className="portfolio-nav-item">
              Holdings
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Portfolio Description
              </h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                {portfolio.description}
              </p>
              
              <h3 className={`text-base font-semibold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Investment Strategy
              </h3>
              <ul className={`list-disc pl-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Focus on {portfolio.category.toLowerCase()} companies with strong competitive advantages</li>
                <li>Emphasis on companies with sustainable growth trajectories</li>
                <li>Active management with quarterly rebalancing</li>
                <li>Rigorous fundamental analysis and valuation discipline</li>
                <li>Long-term investment horizon with low turnover</li>
              </ul>
            </Card>
            
            <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Performance
              </h2>
              
              <div className="h-[180px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedChartData}>
                    <XAxis 
                      dataKey="year" 
                      tickFormatter={(value) => String(value).substring(2)}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, '']}
                      labelFormatter={(value) => `Year: ${value}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      name="Portfolio"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="S&P 500"
                      stroke="#6b7280"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto mt-2">
                <table className={`w-full text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <thead>
                    <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <th className="px-4 py-3 text-left">Period</th>
                      <th className="px-4 py-3 text-right">1M</th>
                      <th className="px-4 py-3 text-right">YTD</th>
                      <th className="px-4 py-3 text-right">1Y</th>
                      <th className="px-4 py-3 text-right">3Y</th>
                      <th className="px-4 py-3 text-right">5Y</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <td className="px-4 py-3 font-medium">Portfolio</td>
                      <td className={`px-4 py-3 text-right ${portfolio.performance.oneMonth?.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolio.performance.oneMonth || '+2.3%'}
                      </td>
                      <td className={`px-4 py-3 text-right ${portfolio.performance.ytd.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolio.performance.ytd}
                      </td>
                      <td className={`px-4 py-3 text-right ${portfolio.performance.oneYear.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolio.performance.oneYear}
                      </td>
                      <td className={`px-4 py-3 text-right ${portfolio.performance.threeYear.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolio.performance.threeYear}
                      </td>
                      <td className={`px-4 py-3 text-right ${portfolio.performance.fiveYear.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {portfolio.performance.fiveYear}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Benchmark</td>
                      <td className="px-4 py-3 text-right text-green-500">
                        +1.8%
                      </td>
                      <td className="px-4 py-3 text-right text-green-500">
                        +5.2%
                      </td>
                      <td className="px-4 py-3 text-right text-green-500">
                        +12.4%
                      </td>
                      <td className="px-4 py-3 text-right text-green-500">
                        +8.2%
                      </td>
                      <td className="px-4 py-3 text-right text-green-500">
                        +9.5%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className={`text-lg font-semibold mb-3 mt-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Top Holdings
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {portfolio.holdings.slice(0, 6).map((symbol) => (
                  <div key={symbol} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-black text-white rounded">
                      {symbol}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Remove conditional rendering of tabs */}
        </div>
      </div>
    </MainLayout>
  );
} 