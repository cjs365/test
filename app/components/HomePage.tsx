'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/app/components/layout/MainLayout';
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
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/app/context/ThemeProvider';

// Mock data for charts
const mockChartOfWeekData = [
  { year: '2019', earnings: 5.2, treasury: 2.1 },
  { year: '2020', earnings: 4.8, treasury: 1.5 },
  { year: '2021', earnings: 5.5, treasury: 1.8 },
  { year: '2022', earnings: 6.2, treasury: 3.5 },
  { year: '2023', earnings: 5.8, treasury: 4.2 },
  { year: '2024', earnings: 5.5, treasury: 4.4 },
];

// Mock data for model portfolios
const mockModelPortfoliosData = [
  {
    id: 'tech-titans',
    name: 'Tech Titans',
    description: 'Algorithmically-selected portfolio of the 15 leading tech companies with strong competitive advantages.',
    returns: {
      total: '+2120.4%',
      ytd: '+28.4%',
      oneYear: '+32.7%',
      threeYear: '+21.5%',
      benchmarkOutperformance: '+1801.8%',
    },
    performance: [
      { year: 2013, value: 100 },
      { year: 2014, value: 130 },
      { year: 2015, value: 180 },
      { year: 2016, value: 220 },
      { year: 2017, value: 350 },
      { year: 2018, value: 420 },
      { year: 2019, value: 550 },
      { year: 2020, value: 780 },
      { year: 2021, value: 1200 },
      { year: 2022, value: 1450 },
      { year: 2023, value: 1850 },
      { year: 2024, value: 2220 },
    ],
    benchmarkPerformance: [
      { year: 2013, value: 100 },
      { year: 2014, value: 110 },
      { year: 2015, value: 120 },
      { year: 2016, value: 135 },
      { year: 2017, value: 160 },
      { year: 2018, value: 155 },
      { year: 2019, value: 190 },
      { year: 2020, value: 225 },
      { year: 2021, value: 290 },
      { year: 2022, value: 270 },
      { year: 2023, value: 310 },
      { year: 2024, value: 340 },
    ],
    holdings: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'META', 'AMZN', 'ASML', 'TSM', 'AVGO', 'AMD'],
  },
  {
    id: 'dividend-aristocrats',
    name: 'Dividend Champions',
    description: 'Curated selection of companies with 25+ years of dividend growth and strong financial health.',
    returns: {
      total: '+346.2%',
      ytd: '+8.6%',
      oneYear: '+12.5%',
      threeYear: '+9.8%',
      benchmarkOutperformance: '+102.4%',
    },
    performance: [
      { year: 2013, value: 100 },
      { year: 2014, value: 110 },
      { year: 2015, value: 125 },
      { year: 2016, value: 140 },
      { year: 2017, value: 165 },
      { year: 2018, value: 160 },
      { year: 2019, value: 185 },
      { year: 2020, value: 195 },
      { year: 2021, value: 240 },
      { year: 2022, value: 265 },
      { year: 2023, value: 310 },
      { year: 2024, value: 345 },
    ],
    benchmarkPerformance: [
      { year: 2013, value: 100 },
      { year: 2014, value: 110 },
      { year: 2015, value: 120 },
      { year: 2016, value: 135 },
      { year: 2017, value: 160 },
      { year: 2018, value: 155 },
      { year: 2019, value: 190 },
      { year: 2020, value: 200 },
      { year: 2021, value: 225 },
      { year: 2022, value: 210 },
      { year: 2023, value: 230 },
      { year: 2024, value: 245 },
    ],
    holdings: ['JNJ', 'PG', 'KO', 'PEP', 'MMM', 'XOM', 'CVX', 'ED', 'T', 'VZ'],
  },
  {
    id: 'growth-leaders',
    name: 'Growth Leaders',
    description: 'Focused portfolio of high-growth companies with sustainable competitive advantages.',
    returns: {
      total: '+1253.8%',
      ytd: '+18.7%',
      oneYear: '+26.9%',
      threeYear: '+16.4%',
      benchmarkOutperformance: '+735.2%',
    },
    performance: [
      { year: 2013, value: 100 },
      { year: 2014, value: 125 },
      { year: 2015, value: 160 },
      { year: 2016, value: 210 },
      { year: 2017, value: 295 },
      { year: 2018, value: 320 },
      { year: 2019, value: 420 },
      { year: 2020, value: 560 },
      { year: 2021, value: 780 },
      { year: 2022, value: 920 },
      { year: 2023, value: 1110 },
      { year: 2024, value: 1350 },
    ],
    benchmarkPerformance: [
      { year: 2013, value: 100 },
      { year: 2014, value: 110 },
      { year: 2015, value: 120 },
      { year: 2016, value: 135 },
      { year: 2017, value: 160 },
      { year: 2018, value: 155 },
      { year: 2019, value: 190 },
      { year: 2020, value: 225 },
      { year: 2021, value: 290 },
      { year: 2022, value: 270 },
      { year: 2023, value: 310 },
      { year: 2024, value: 340 },
    ],
    holdings: ['NVDA', 'ADBE', 'CRM', 'NOW', 'SNOW', 'DDOG', 'CRWD', 'NET', 'TTD', 'UBER'],
  }
];

// ModelPortfolios component
const ModelPortfolios: React.FC = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(mockModelPortfoliosData[0]);
  const [showAllHoldings, setShowAllHoldings] = useState(false);
  const { theme } = useTheme();

  // Function to format performance data for chart
  const formatPerformanceData = () => {
    return selectedPortfolio.performance.map((item, index) => ({
      year: item.year,
      portfolio: item.value,
      benchmark: selectedPortfolio.benchmarkPerformance[index].value
    }));
  };

  // Get visible holdings based on showAllHoldings state
  const visibleHoldings = showAllHoldings 
    ? selectedPortfolio.holdings 
    : selectedPortfolio.holdings.slice(0, 6); // Show first 6 holdings (2 rows of 3)

  return (
    <div className={theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}>
      {/* Portfolio Selection Buttons - Row above chart */}
      <div className="mb-4 flex flex-wrap gap-2">
        {mockModelPortfoliosData.map((portfolio) => (
          <Button
            key={portfolio.id}
            variant={selectedPortfolio.id === portfolio.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPortfolio(portfolio)}
            className="justify-start text-left h-auto py-2 px-3"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">{portfolio.name}</span>
              <span className={`text-xs ${portfolio.returns.oneYear.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {portfolio.returns.oneYear}
              </span>
            </div>
          </Button>
        ))}
      </div>

      <div className="mb-3">
        <h4 className="font-bold text-lg">{selectedPortfolio.name}</h4>
        <p className="text-gray-600 text-sm">{selectedPortfolio.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column - Chart Only */}
        <div className="lg:col-span-7 lg:border-r border-gray-200 pr-4">
          {/* Chart */}
          <div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatPerformanceData()}>
                  <XAxis 
                    dataKey="year"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => value.toString().substr(2)}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    labelFormatter={(value) => `Year: ${value}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="portfolio"
                    name={selectedPortfolio.name}
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
          </div>
        </div>

        {/* Right Column - Performance Table and Holdings */}
        <div className="lg:col-span-5 lg:pl-4">
          <div className="h-full flex flex-col">
            {/* Performance Table */}
            <div className="mb-4">
              <table className="w-full text-sm">
                <colgroup>
                  <col style={{ width: '40%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 px-2 text-left font-medium"></th>
                    <th className="py-2 px-2 text-right font-medium">YTD</th>
                    <th className="py-2 px-2 text-right font-medium">1 Year</th>
                    <th className="py-2 px-2 text-right font-medium">3 Year (Ann.)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 px-2 font-medium">{selectedPortfolio.name}</td>
                    <td className="py-2 px-2 text-right text-green-600">{selectedPortfolio.returns.ytd}</td>
                    <td className="py-2 px-2 text-right text-green-600">{selectedPortfolio.returns.oneYear}</td>
                    <td className="py-2 px-2 text-right text-green-600">{selectedPortfolio.returns.threeYear}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 font-medium">S&P 500</td>
                    <td className="py-2 px-2 text-right">+5.2%</td>
                    <td className="py-2 px-2 text-right">+12.4%</td>
                    <td className="py-2 px-2 text-right">+8.2%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="font-bold text-md mb-2">Current Holdings</h4>
            
            <div className="grid grid-cols-3 gap-x-2 gap-y-1 mb-2">
              {visibleHoldings.map((symbol) => (
                <a
                  key={symbol}
                  href={`/stock/${symbol.toLowerCase()}`}
                  className="py-1 text-sm font-mono hover:text-blue-600 transition-colors"
                >
                  {symbol}
                </a>
              ))}
            </div>

            {selectedPortfolio.holdings.length > 6 && (
              <button 
                onClick={() => setShowAllHoldings(!showAllHoldings)} 
                className="text-xs text-blue-600 hover:text-blue-800 mb-auto"
              >
                {showAllHoldings ? 'Hide' : `Show all (${selectedPortfolio.holdings.length})`}
              </button>
            )}

            <Button className="w-full mt-4">View Full Strategy</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [marketRegion, setMarketRegion] = useState<'US' | 'CN'>('US');
  const { theme } = useTheme();

  return (
    <MainLayout>
      <div className={`grid grid-cols-1 lg:grid-cols-12 ${
        theme === 'dark' ? 'border-x border-gray-800' : 'border-x border-gray-200'
      }`}>
        {/* Main Content (8 columns) */}
        <div className={`lg:col-span-8 ${
          theme === 'dark' ? 'border-r border-gray-800' : 'border-r border-gray-200'
        }`}>
          {/* Key Story Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Key Story</h2>
            </div>
            <div className="key-story">
              <Link href="/article/google-says-it-will-appeal-online-search-antitrust-decision" className="flex flex-col md:flex-row gap-6">
                <div className="key-story-image relative">
                  <Image 
                    src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop"
                    alt="Google antitrust decision"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="key-story-content">
                  <h3 className={`text-xl font-bold mb-2 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-black'
                  }`}>
                    Google Says It Will Appeal Online Search Antitrust Decision
                  </h3>
                  <p className={`mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Stock futures rise as tech giant challenges federal court ruling
                  </p>
                  <p className={`mb-4 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    The decision comes amid ongoing antitrust scrutiny of major tech companies. Google plans to appeal the federal judge's decision requiring restructuring of its online search business.
                  </p>
                  <small className={`${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>2 hours ago</small>
                </div>
              </Link>
            </div>
          </section>

          {/* Featured Analysis Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Featured Analysis</h2>
              <a href="#" className={`text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="news-item">
                  <h5 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-100' : ''
                  }`}>Fed Signals Potential Rate Cut in September</h5>
                  <p className={`text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    The Federal Reserve has indicated it may begin easing monetary policy...
                  </p>
                  <small className={`${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>4 hours ago</small>
                </div>
                <div className="news-item">
                  <h5 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-100' : ''
                  }`}>Tech Stocks Rally on Strong Earnings</h5>
                  <p className={`text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Major technology companies reported better-than-expected quarterly results...
                  </p>
                  <small className={`${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>6 hours ago</small>
                </div>
              </div>
              <div>
                <div className="news-item">
                  <h5 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-100' : ''
                  }`}>Oil Prices Stabilize After Recent Volatility</h5>
                  <p className={`text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Crude oil futures found support following weeks of fluctuation...
                  </p>
                  <small className={`${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>8 hours ago</small>
                </div>
                <div className="news-item">
                  <h5 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-100' : ''
                  }`}>European Markets Close Higher on Economic Data</h5>
                  <p className={`text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    European indices finished in positive territory after encouraging PMI figures...
                  </p>
                  <small className={`${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>10 hours ago</small>
                </div>
              </div>
            </div>
          </section>

          {/* Market Analysis Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Trending Stock</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['WMT', 'IGM', 'AAPL', 'MSFT'].map((symbol) => (
                <Link 
                  key={symbol} 
                  href={`/stock/${symbol.toLowerCase()}`} 
                  className={`company-report-card ${
                    theme === 'dark' ? 'bg-gray-800 border border-gray-700' : ''
                  } p-4 rounded-lg block hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className={`ticker-badge px-2 py-1 ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
                    } rounded text-xs font-mono`}>{symbol}</div>
                    <div className={`company-name text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {symbol === 'WMT' && 'Walmart Inc'}
                      {symbol === 'IGM' && 'IGM Financial'}
                      {symbol === 'AAPL' && 'Apple Inc'}
                      {symbol === 'MSFT' && 'Microsoft Corp'}
                    </div>
                  </div>
                  <div className="aroic-chart mb-3">
                    <div className={`chart-label small text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>AROIC</div>
                    <div className="spikebar-container flex items-end h-16 space-x-1">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`spikebar ${i > 9 ? 'forecast' : ''}`}
                          style={{ 
                            height: `${40 + i * 5}%`,
                            backgroundColor: i > 9 
                              ? theme === 'dark' ? 'rgb(96, 165, 250)' : 'rgb(147, 197, 253)'
                              : theme === 'dark' ? '#3b82f6' : 'var(--accent-color)',
                            opacity: i > 9 ? '0.8' : '1',
                            width: '6px'
                          }}
                        />
                      ))}
                    </div>
                    <div className={`year-labels flex justify-between text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <span>2014</span>
                      <span>2025</span>
                    </div>
                  </div>
                  <div className="metrics-grid space-y-1">
                    <div className="metric-row flex justify-between">
                      <div className={`metric-label text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Overall Rank</div>
                      <div className={`metric-value text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : ''
                      }`}>86</div>
                    </div>
                    <div className="metric-row flex justify-between">
                      <div className={`metric-label text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Current Price</div>
                      <div className={`metric-value text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-200' : ''
                      }`}>$97.10</div>
                    </div>
                    <div className="metric-row flex justify-between">
                      <div className={`metric-label text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>YTD Return</div>
                      <div className={`metric-value text-sm font-medium ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      } positive`}>+8.5%</div>
                    </div>
                    <div className="metric-row flex justify-between">
                      <div className={`metric-label text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>Upside</div>
                      <div className={`metric-value text-sm font-medium ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      } positive`}>+28.5%</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Screens Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Featured Screens</h2>
              <a href="#" className={`text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Growth Leaders Screen */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800 border-0' : 'bg-gray-50 border-0'
              }`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-gray-200' : ''
                    }`}>Growth Leaders</h3>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>32 matches</span>
                  </div>
                  <p className={`text-xs mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Companies demonstrating exceptional revenue growth and profitability metrics. Focus on sustainable competitive advantages and market leadership.
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      Revenue Growth &gt;25% YoY
                    </div>
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      Operating Margin &gt;15%
                    </div>
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      ROIC &gt;20%
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['NVDA', 'ADBE', 'MSFT', 'ASML', 'NOW'].map((symbol) => (
                      <a
                        key={symbol}
                        href={`/stock/${symbol.toLowerCase()}`}
                        className={`px-2 py-1 text-xs font-mono ${
                          theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {symbol}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Dividend Aristocrats Screen */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800 border-0' : 'bg-gray-50 border-0'
              }`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-gray-200' : ''
                    }`}>Dividend Aristocrats</h3>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>25 matches</span>
                  </div>
                  <p className={`text-xs mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Elite group of S&P 500 companies with 25+ years of consecutive dividend increases. Focus on stable business models and strong cash flows.
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      Dividend Growth ≥ 25 years
                    </div>
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      Yield &gt; 2.5% • Payout &lt; 75%
                    </div>
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      S&P Quality: BBB+ or higher
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['JNJ', 'PG', 'KO', 'MMM', 'ED'].map((symbol) => (
                      <a
                        key={symbol}
                        href={`/stock/${symbol.toLowerCase()}`}
                        className={`px-2 py-1 text-xs font-mono ${
                          theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {symbol}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Value Opportunities Screen */}
              <Card className={`${
                theme === 'dark' ? 'bg-gray-800 border-0' : 'bg-gray-50 border-0'
              }`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-bold ${
                      theme === 'dark' ? 'text-gray-200' : ''
                    }`}>Value Opportunities</h3>
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>15 matches</span>
                  </div>
                  <p className={`text-xs mb-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Companies trading below intrinsic value with strong fundamentals. Identifies potential turnaround candidates and overlooked opportunities.
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      P/E &lt; 15x • P/B &lt; 2x
                    </div>
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      FCF Yield &gt; 6%
                    </div>
                    <div className={`flex items-center ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <span className="font-mono mr-2">•</span>
                      Net Margin &gt; 12%
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['INTC', 'CVX', 'C', 'IBM', 'VZ'].map((symbol) => (
                      <a
                        key={symbol}
                        href={`/stock/${symbol.toLowerCase()}`}
                        className={`px-2 py-1 text-xs font-mono ${
                          theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {symbol}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Chart of the Week Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Chart of the Week</h2>
            </div>
            <div className={`chart-container ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <h5 className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-100' : ''
              }`}>
                10-Year Treasury Yield vs. Economic Earnings Yield
              </h5>
              <p className={`text-sm mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Historical spread suggests potential market undervaluation
              </p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : 'var(--border-color)'} />
                    <XAxis dataKey="year" stroke={theme === 'dark' ? '#94a3b8' : undefined} />
                    <YAxis stroke={theme === 'dark' ? '#94a3b8' : undefined} />
                    <Tooltip contentStyle={theme === 'dark' ? { backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' } : undefined} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      name="Economic Earnings Yield"
                      stroke={theme === 'dark' ? '#60a5fa' : 'var(--accent-color)'}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="treasury"
                      name="10-Year Treasury Yield"
                      stroke={theme === 'dark' ? '#a78bfa' : 'var(--secondary-color)'}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Top Performing Model Portfolios */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Top Performing Model Portfolios</h2>
              <a href="#" className={`text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>View All</a>
            </div>
            <ModelPortfolios />
          </section>

          {/* AI Explorer Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>AI Explorer</h2>
            </div>
            <div className={`p-6 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}>
              <p className={`mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Ask questions in natural language to find investment opportunities
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className={`flex-1 px-4 py-2 border rounded-lg ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                      : 'bg-white border-gray-300'
                  }`}
                  placeholder="Example: Which undervalued AI stocks have rising earnings and high ROIC?"
                />
                <Button>
                  <i className="fas fa-search mr-2"></i>
                  Explore
                </Button>
              </div>
              <div>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Popular queries:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Show me high-quality tech stocks under $50
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    Find dividend stocks with growing FCF
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Educational Hub Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Educational Hub</h3>
              <a href="#" className={`text-xs font-medium uppercase tracking-wider ${
                theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
              }`}>
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className={`${
                        theme === 'dark' ? 'text-gray-100 hover:text-blue-400' : 'hover:text-blue-600'
                      }`}>
                        How is AROIC calculated?
                      </a>
                    </h4>
                    <p className={`text-xs mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Understanding the key metric for measuring capital efficiency
                    </p>
                    <div className={`flex items-center text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <span className="font-mono">10 min</span>
                      <span className="mx-2">•</span>
                      <span>Intermediate</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className={`${
                        theme === 'dark' ? 'text-gray-100 hover:text-blue-400' : 'hover:text-blue-600'
                      }`}>
                        GAAP vs. Non-GAAP Earnings
                      </a>
                    </h4>
                    <p className={`text-xs mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Key differences and when to use each metric
                    </p>
                    <div className={`flex items-center text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <span className="font-mono">15 min</span>
                      <span className="mx-2">•</span>
                      <span>Beginner</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className={`${
                        theme === 'dark' ? 'text-gray-100 hover:text-blue-400' : 'hover:text-blue-600'
                      }`}>
                        Understanding Economic Earnings
                      </a>
                    </h4>
                    <p className={`text-xs mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      How we adjust GAAP earnings for better analysis
                    </p>
                    <div className={`flex items-center text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <span className="font-mono">12 min</span>
                      <span className="mx-2">•</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className={`${
                        theme === 'dark' ? 'text-gray-100 hover:text-blue-400' : 'hover:text-blue-600'
                      }`}>
                        Valuation Framework
                      </a>
                    </h4>
                    <p className={`text-xs mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Our approach to finding true intrinsic value
                    </p>
                    <div className={`flex items-center text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      <span className="font-mono">20 min</span>
                      <span className="mx-2">•</span>
                      <span>Intermediate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 columns) */}
        <div className="lg:col-span-4">
          {/* Factor Performance Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Factor Performance</h2>
              <div className="flex gap-1">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setMarketRegion('US')}
                >
                  US
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMarketRegion('CN')}
                >
                  CN
                </Button>
              </div>
            </div>
            {/* Display content based on marketRegion */}
            <div className="text-xs mb-2">
              Selected Region: {marketRegion}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left text-sm ${
                    theme === 'dark' ? 'text-gray-400' : ''
                  }`}>
                    <th className="py-2">Factor</th>
                    <th>1M</th>
                    <th>3M</th>
                    <th>YTD</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : ''
                }`}>
                  <tr className={`border-t ${
                    theme === 'dark' ? 'border-gray-700' : ''
                  }`}>
                    <td className="py-2 font-semibold">Value</td>
                    <td className={`${
                      theme === 'dark' ? 'text-red-400' : 'negative'
                    }`}>-2.1%</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+4.3%</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+8.7%</td>
                    <td><i className="fas fa-arrow-up text-green-600"></i></td>
                  </tr>
                  <tr className={`border-t ${
                    theme === 'dark' ? 'border-gray-700' : ''
                  }`}>
                    <td className="py-2 font-semibold">Momentum</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+3.8%</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+7.2%</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+15.4%</td>
                    <td><i className="fas fa-arrow-up text-green-600"></i></td>
                  </tr>
                  <tr className={`border-t ${
                    theme === 'dark' ? 'border-gray-700' : ''
                  }`}>
                    <td className="py-2 font-semibold">Quality</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+1.5%</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+3.1%</td>
                    <td className={`${
                      theme === 'dark' ? 'text-green-400' : 'positive'
                    }`}>+6.8%</td>
                    <td><i className="fas fa-equals text-gray-600"></i></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={`p-4 mt-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'
            }`}>
              <h6 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-200' : ''
              }`}>Rotation Trend</h6>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Growth and Momentum factors showing continued strength, while Value is recovering from short-term weakness. Risk-off sentiment persists.
              </p>
            </div>
          </section>

          {/* Macro Snapshot */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>Macro Snapshot</h2>
            </div>
            <div className="space-y-2">
              {[
                {
                  label: 'GDP Growth (YoY)',
                  date: '28-May',
                  current: '2.4%',
                  est: '2.2%',
                  prev: '2.1%',
                },
                {
                  label: 'Inflation Rate',
                  date: '15-May',
                  current: '3.1%',
                  est: '3.2%',
                  prev: '3.3%',
                },
                {
                  label: 'Unemployment',
                  date: '03-Jun',
                  current: '3.7%',
                  est: '3.8%',
                  prev: '3.8%',
                },
              ].map((item) => (
                <div key={item.label} className={`macro-card ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : ''
                } p-4 rounded-lg`}>
                  <div className={`macro-name flex justify-between text-sm mb-1 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span>{item.label}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="macro-value flex justify-between items-center">
                    <span className={`macro-current font-semibold ${
                      theme === 'dark' ? 'text-gray-200' : ''
                    }`}>{item.current}</span>
                    <span className={`macro-est text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Est: {item.est}</span>
                    <span className={`macro-prev text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>{item.prev}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform Features Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } mb-3`}>Platform Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`bg-gray-50 p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : ''
              }`}>
                <div className="flex items-center mb-2">
                  <i className={`fas fa-database mr-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                  }`}></i>
                  <h4 className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-gray-300' : ''
                  }`}>Institutional Data</h4>
                </div>
                <p className={`text-xs text-gray-600 leading-snug ${
                  theme === 'dark' ? 'text-gray-300' : ''
                }`}>Premium sources trusted by institutions</p>
              </div>
              <div className={`bg-gray-50 p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : ''
              }`}>
                <div className="flex items-center mb-2">
                  <i className={`fas fa-brain mr-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                  }`}></i>
                  <h4 className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-gray-300' : ''
                  }`}>AI Research</h4>
                </div>
                <p className={`text-xs text-gray-600 leading-snug ${
                  theme === 'dark' ? 'text-gray-300' : ''
                }`}>ML-powered investment insights</p>
              </div>
              <div className={`bg-gray-50 p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : ''
              }`}>
                <div className="flex items-center mb-2">
                  <i className={`fas fa-chart-line mr-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                  }`}></i>
                  <h4 className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-gray-300' : ''
                  }`}>Financial Models</h4>
                </div>
                <p className={`text-xs text-gray-600 leading-snug ${
                  theme === 'dark' ? 'text-gray-300' : ''
                }`}>Full statement forecasts</p>
              </div>
              <div className={`bg-gray-50 p-3 ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : ''
              }`}>
                <div className="flex items-center mb-2">
                  <i className={`fas fa-briefcase mr-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
                  }`}></i>
                  <h4 className={`text-xs font-bold ${
                    theme === 'dark' ? 'text-gray-300' : ''
                  }`}>Model Portfolios</h4>
                </div>
                <p className={`text-xs text-gray-600 leading-snug ${
                  theme === 'dark' ? 'text-gray-300' : ''
                }`}>Backtested strategies</p>
              </div>
            </div>
          </section>

          {/* US Treasury Yield Curve Section */}
          <section className={`${
            theme === 'dark' ? 'border-b border-gray-800' : 'border-b border-gray-200'
          } px-8 py-6`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>US Treasury Yield Curve</h3>
              <span className={`text-xs text-gray-500 ${
                theme === 'dark' ? 'text-gray-500' : ''
              }`}>Updated 5m ago</span>
            </div>
            <Card className={`p-4 bg-gray-50 ${
              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : ''
            } border-0`}>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { term: '1M', yield: 5.31 },
                      { term: '3M', yield: 5.28 },
                      { term: '6M', yield: 5.25 },
                      { term: '1Y', yield: 4.95 },
                      { term: '2Y', yield: 4.48 },
                      { term: '5Y', yield: 4.15 },
                      { term: '10Y', yield: 4.21 },
                      { term: '30Y', yield: 4.35 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                    <XAxis
                      dataKey="term"
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: theme === 'dark' ? '#475569' : '#9ca3af' }}
                      stroke={theme === 'dark' ? '#94a3b8' : undefined}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: theme === 'dark' ? '#475569' : '#9ca3af' }}
                      stroke={theme === 'dark' ? '#94a3b8' : undefined}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Yield']}
                      labelStyle={{ fontSize: 11 }}
                      contentStyle={theme === 'dark' ? { 
                        fontSize: 11, 
                        backgroundColor: '#1e293b', 
                        borderColor: '#475569', 
                        color: '#f1f5f9' 
                      } : { fontSize: 11 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="yield"
                      stroke={theme === 'dark' ? '#60a5fa' : '#2563eb'}
                      dot={{ fill: theme === 'dark' ? '#60a5fa' : '#2563eb', strokeWidth: 0 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
                <div>
                  <div className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>2Y Yield</div>
                  <div className={`font-mono ${
                    theme === 'dark' ? 'text-gray-200' : ''
                  }`}>4.48%</div>
                </div>
                <div>
                  <div className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>10Y Yield</div>
                  <div className={`font-mono ${
                    theme === 'dark' ? 'text-gray-200' : ''
                  }`}>4.21%</div>
                </div>
                <div>
                  <div className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>30Y Yield</div>
                  <div className={`font-mono ${
                    theme === 'dark' ? 'text-gray-200' : ''
                  }`}>4.35%</div>
                </div>
                <div>
                  <div className={`${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>2-10 Spread</div>
                  <div className={`font-mono ${
                    theme === 'dark' ? 'text-red-400' : 'text-red-600'
                  }`}>-0.27%</div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
} 