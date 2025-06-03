'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MainLayout from '@/app/components/layout/MainLayout';
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
  ResponsiveContainer
} from 'recharts';
import Link from 'next/link';
import Image from 'next/image';

// Mock data for charts
const mockChartOfWeekData = [
  { year: '2019', earnings: 5.2, treasury: 2.1 },
  { year: '2020', earnings: 4.8, treasury: 1.5 },
  { year: '2021', earnings: 5.5, treasury: 1.8 },
  { year: '2022', earnings: 6.2, treasury: 3.5 },
  { year: '2023', earnings: 5.8, treasury: 4.2 },
  { year: '2024', earnings: 5.5, treasury: 4.4 },
];

// StockTable component
const StockTable: React.FC = () => {
  const [numberFormat, setNumberFormat] = useState({
    decimals: 1, // Default to 1 decimal
    scale: 'M', // Default to millions
  });

  // Function to format numbers with commas and scale
  const formatNumber = (value: number, isPrice: boolean = false) => {
    let scaledValue = value;
    let suffix = '';

    if (!isPrice) {
      switch (numberFormat.scale) {
        case 'K':
          scaledValue = value / 1000;
          suffix = 'K';
          break;
        case 'M':
          scaledValue = value / 1000000;
          suffix = 'M';
          break;
        case 'B':
          scaledValue = value / 1000000000;
          suffix = 'B';
          break;
      }
    }

    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: numberFormat.decimals,
      maximumFractionDigits: numberFormat.decimals,
    }).format(scaledValue);

    return isPrice ? `$${formatted}` : `${formatted}${suffix}`;
  };

  return (
    <div>
      <div className="flex items-start gap-1 mb-4">
        {/* Decimal Places Toggle Group */}
        <div className="inline-flex border border-gray-200 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setNumberFormat(prev => ({ ...prev, decimals: 0 }))}
            className={`px-3 py-1 text-xs font-medium ${
              numberFormat.decimals === 0
                ? 'bg-white text-gray-900'
                : 'bg-gray-50 text-gray-500'
            } border-r border-gray-200 hover:bg-gray-100 focus:outline-none`}
          >
            .0
          </button>
          <button
            type="button"
            onClick={() => setNumberFormat(prev => ({ ...prev, decimals: 2 }))}
            className={`px-3 py-1 text-xs font-medium ${
              numberFormat.decimals === 2
                ? 'bg-white text-gray-900'
                : 'bg-gray-50 text-gray-500'
            } hover:bg-gray-100 focus:outline-none`}
          >
            .00
          </button>
        </div>

        {/* Scale Toggle Group */}
        <div className="inline-flex border border-gray-200 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setNumberFormat(prev => ({ ...prev, scale: 'K' }))}
            className={`px-3 py-1 text-xs font-medium ${
              numberFormat.scale === 'K'
                ? 'bg-white text-gray-900'
                : 'bg-gray-50 text-gray-500'
            } border-r border-gray-200 hover:bg-gray-100 focus:outline-none`}
          >
            K
          </button>
          <button
            type="button"
            onClick={() => setNumberFormat(prev => ({ ...prev, scale: 'M' }))}
            className={`px-3 py-1 text-xs font-medium ${
              numberFormat.scale === 'M'
                ? 'bg-white text-gray-900'
                : 'bg-gray-50 text-gray-500'
            } border-r border-gray-200 hover:bg-gray-100 focus:outline-none`}
          >
            M
          </button>
          <button
            type="button"
            onClick={() => setNumberFormat(prev => ({ ...prev, scale: 'B' }))}
            className={`px-3 py-1 text-xs font-medium ${
              numberFormat.scale === 'B'
                ? 'bg-white text-gray-900'
                : 'bg-gray-50 text-gray-500'
            } hover:bg-gray-100 focus:outline-none`}
          >
            B
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="py-3">Symbol</th>
              <th>Company</th>
              <th>Price</th>
              <th>Change</th>
              <th>% Change</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3"><span className="ticker-badge">AAPL</span></td>
              <td>Apple Inc.</td>
              <td>{formatNumber(178.14, true)}</td>
              <td className="positive">+{formatNumber(4.86)}</td>
              <td className="positive">+2.81%</td>
              <td className="text-gray-500">{formatNumber(68200000)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3"><span className="ticker-badge">MSFT</span></td>
              <td>Microsoft Corp.</td>
              <td>{formatNumber(412.65, true)}</td>
              <td className="positive">+{formatNumber(3.27)}</td>
              <td className="positive">+0.80%</td>
              <td className="text-gray-500">{formatNumber(22100000)}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3"><span className="ticker-badge">TSLA</span></td>
              <td>Tesla Inc.</td>
              <td>{formatNumber(215.32, true)}</td>
              <td className="negative">-{formatNumber(7.18)}</td>
              <td className="negative">-3.23%</td>
              <td className="text-gray-500">{formatNumber(125700000)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [marketRegion, setMarketRegion] = useState<'US' | 'CN'>('US');

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-gray-200">
        {/* Main Content (8 columns) */}
        <div className="lg:col-span-8 border-r border-gray-200">
          {/* Key Story Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Key Story</h2>
            </div>
            <div className="key-story">
              <Link href="/article/google-says-it-will-appeal-online-search-antitrust-decision" className="flex flex-col md:flex-row gap-6">
                <div className="key-story-image relative">
                  <Image 
                    src="https://www.reuters.com/resizer/hO3Fy0Qe5P_vYQz8oN5-4yqd_Yw=/960x0/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/T3JXJRAFCJLWBKQD5KQDT4G55M.jpg"
                    alt="Google antitrust decision"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="key-story-content">
                  <h3 className="text-xl font-bold mb-2 text-black">
                    Google Says It Will Appeal Online Search Antitrust Decision
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Stock futures rise as tech giant challenges federal court ruling
                  </p>
                  <p className="text-gray-600 mb-4">
                    The decision comes amid ongoing antitrust scrutiny of major tech companies. Google plans to appeal the federal judge's decision requiring restructuring of its online search business.
                  </p>
                  <small className="text-gray-500">2 hours ago</small>
                </div>
              </Link>
            </div>
          </section>

          {/* Featured Analysis Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Featured Analysis</h2>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="news-item">
                  <h5 className="font-semibold mb-1">Fed Signals Potential Rate Cut in September</h5>
                  <p className="text-gray-600 text-sm mb-1">
                    The Federal Reserve has indicated it may begin easing monetary policy...
                  </p>
                  <small className="text-gray-500">4 hours ago</small>
                </div>
                <div className="news-item">
                  <h5 className="font-semibold mb-1">Tech Stocks Rally on Strong Earnings</h5>
                  <p className="text-gray-600 text-sm mb-1">
                    Major technology companies reported better-than-expected quarterly results...
                  </p>
                  <small className="text-gray-500">6 hours ago</small>
                </div>
              </div>
              <div>
                <div className="news-item">
                  <h5 className="font-semibold mb-1">Oil Prices Stabilize After Recent Volatility</h5>
                  <p className="text-gray-600 text-sm mb-1">
                    Crude oil futures found support following weeks of fluctuation...
                  </p>
                  <small className="text-gray-500">8 hours ago</small>
                </div>
                <div className="news-item">
                  <h5 className="font-semibold mb-1">European Markets Close Higher on Economic Data</h5>
                  <p className="text-gray-600 text-sm mb-1">
                    European indices finished in positive territory after encouraging PMI figures...
                  </p>
                  <small className="text-gray-500">10 hours ago</small>
                </div>
              </div>
            </div>
          </section>

          {/* Hot Stocks Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Hot Stocks</h2>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">View All</a>
            </div>
            <StockTable />
          </section>

          {/* Market Analysis Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Market Analysis</h2>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['WMT', 'IGM', 'AAPL', 'MSFT'].map((symbol) => (
                <div key={symbol} className="company-report-card">
                  <div className="flex justify-between items-center mb-2">
                    <div className="ticker-badge">{symbol}</div>
                    <div className="company-name">
                      {symbol === 'WMT' && 'Walmart Inc'}
                      {symbol === 'IGM' && 'IGM Financial'}
                      {symbol === 'AAPL' && 'Apple Inc'}
                      {symbol === 'MSFT' && 'Microsoft Corp'}
                    </div>
                  </div>
                  <div className="aroic-chart mb-3">
                    <div className="chart-label small">AROIC Trend (10Y + 2Y Forecast)</div>
                    <div className="spikebar-container">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`spikebar ${i > 9 ? 'forecast' : ''}`}
                          style={{ 
                            height: `${40 + i * 5}%`,
                            backgroundColor: i > 9 ? 'rgb(147, 197, 253)' : 'var(--accent-color)',
                            opacity: i > 9 ? '0.8' : '1'
                          }}
                        />
                      ))}
                    </div>
                    <div className="year-labels">
                      <span>2014</span>
                      <span>2025</span>
                    </div>
                  </div>
                  <div className="metrics-grid">
                    <div className="metric-row">
                      <div className="metric-label">Overall Rank</div>
                      <div className="metric-value">#12</div>
                    </div>
                    <div className="metric-row">
                      <div className="metric-label">Current Share Price</div>
                      <div className="metric-value">$97.10</div>
                    </div>
                    <div className="metric-row">
                      <div className="metric-label">YTD Return</div>
                      <div className="metric-value positive">+8.5%</div>
                    </div>
                  </div>
                  <Button className="w-full mt-4">Open Analysis</Button>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Screens Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Featured Screens</h2>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">View All</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Growth Leaders Screen */}
              <Card className="bg-gray-50 border-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold">Growth Leaders</h3>
                    <span className="text-xs text-gray-500">32 matches</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Companies demonstrating exceptional revenue growth and profitability metrics. Focus on sustainable competitive advantages and market leadership.
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      Revenue Growth {'>'}25% YoY
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      Operating Margin {'>'}15%
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      ROIC {'>'}20%
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['NVDA', 'ADBE', 'MSFT', 'ASML', 'NOW'].map((symbol) => (
                      <a
                        key={symbol}
                        href={`/stock/${symbol.toLowerCase()}`}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-xs font-mono"
                      >
                        {symbol}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Dividend Aristocrats Screen */}
              <Card className="bg-gray-50 border-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold">Dividend Aristocrats</h3>
                    <span className="text-xs text-gray-500">25 matches</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Elite group of S&P 500 companies with 25+ years of consecutive dividend increases. Focus on stable business models and strong cash flows.
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      Dividend Growth ≥ 25 years
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      Yield {'>'} 2.5% • Payout {'<'} 75%
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      S&P Quality: BBB+ or higher
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['JNJ', 'PG', 'KO', 'MMM', 'ED'].map((symbol) => (
                      <a
                        key={symbol}
                        href={`/stock/${symbol.toLowerCase()}`}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-xs font-mono"
                      >
                        {symbol}
                      </a>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Value Opportunities Screen */}
              <Card className="bg-gray-50 border-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold">Value Opportunities</h3>
                    <span className="text-xs text-gray-500">15 matches</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Companies trading below intrinsic value with strong fundamentals. Identifies potential turnaround candidates and overlooked opportunities.
                  </p>
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      P/E {'<'} 15x • P/B {'<'} 2x
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      FCF Yield {'>'} 6%
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-mono mr-2">•</span>
                      Net Margin {'>'} 12%
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['INTC', 'CVX', 'C', 'IBM', 'VZ'].map((symbol) => (
                      <a
                        key={symbol}
                        href={`/stock/${symbol.toLowerCase()}`}
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-xs font-mono"
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
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Chart of the Week</h2>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">View Archive</a>
            </div>
            <div className="chart-container">
              <h5 className="text-lg font-semibold mb-2">
                10-Year Treasury Yield vs. Economic Earnings Yield
              </h5>
              <p className="text-gray-600 text-sm mb-4">
                Historical spread suggests potential market undervaluation
              </p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartOfWeekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      name="Economic Earnings Yield"
                      stroke="var(--accent-color)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="treasury"
                      name="10-Year Treasury Yield"
                      stroke="var(--secondary-color)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* AI Explorer Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">AI Explorer</h2>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <p className="text-gray-600 mb-4">
                Ask questions in natural language to find investment opportunities
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-lg"
                  placeholder="Example: Which undervalued AI stocks have rising earnings and high ROIC?"
                />
                <Button>
                  <i className="fas fa-search mr-2"></i>
                  Explore
                </Button>
              </div>
              <div>
                <span className="text-sm text-gray-500">Popular queries:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    Show me high-quality tech stocks under $50
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    Find dividend stocks with growing FCF
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Educational Hub Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">Educational Hub</h3>
              <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium uppercase tracking-wider">
                View All
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className="hover:text-blue-600">
                        How is AROIC calculated?
                      </a>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Understanding the key metric for measuring capital efficiency
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="font-mono">10 min</span>
                      <span className="mx-2">•</span>
                      <span>Intermediate</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className="hover:text-blue-600">
                        GAAP vs. Non-GAAP Earnings
                      </a>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Key differences and when to use each metric
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="font-mono">15 min</span>
                      <span className="mx-2">•</span>
                      <span>Beginner</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className="hover:text-blue-600">
                        Understanding Economic Earnings
                      </a>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      How we adjust GAAP earnings for better analysis
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="font-mono">12 min</span>
                      <span className="mx-2">•</span>
                      <span>Advanced</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold mb-1">
                      <a href="#" className="hover:text-blue-600">
                        Valuation Framework
                      </a>
                    </h4>
                    <p className="text-xs text-gray-600 mb-2">
                      Our approach to finding true intrinsic value
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
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
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Factor Performance</h2>
              <div className="flex gap-1">
                <Button
                  variant={marketRegion === 'US' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMarketRegion('US')}
                >
                  US
                </Button>
                <Button
                  variant={marketRegion === 'CN' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMarketRegion('CN')}
                >
                  CN
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm">
                    <th className="py-2">Factor</th>
                    <th>1M</th>
                    <th>3M</th>
                    <th>YTD</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-t">
                    <td className="py-2 font-semibold">Value</td>
                    <td className="negative">-2.1%</td>
                    <td className="positive">+4.3%</td>
                    <td className="positive">+8.7%</td>
                    <td><i className="fas fa-arrow-up text-green-600"></i></td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-semibold">Momentum</td>
                    <td className="positive">+3.8%</td>
                    <td className="positive">+7.2%</td>
                    <td className="positive">+15.4%</td>
                    <td><i className="fas fa-arrow-up text-green-600"></i></td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-2 font-semibold">Quality</td>
                    <td className="positive">+1.5%</td>
                    <td className="positive">+3.1%</td>
                    <td className="positive">+6.8%</td>
                    <td><i className="fas fa-equals text-gray-600"></i></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 p-4 mt-4 rounded-lg">
              <h6 className="font-semibold mb-2">Rotation Trend</h6>
              <p className="text-sm text-gray-600">
                {marketRegion === 'US'
                  ? "Growth and Momentum factors showing continued strength, while Value is recovering from short-term weakness. Risk-off sentiment persists."
                  : "Value and Quality factors lead the market, while Growth faces headwinds. Momentum showing signs of weakness amid market volatility."
                }
              </p>
            </div>
          </section>

          {/* Macro Snapshot */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600">Macro Snapshot</h2>
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
                <div key={item.label} className="macro-card">
                  <div className="macro-name">
                    <span>{item.label}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="macro-value">
                    <span className="macro-current">{item.current}</span>
                    <span className="macro-est">Est: {item.est}</span>
                    <span className="macro-prev">Prev: {item.prev}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Platform Features Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">Platform Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3">
                <div className="flex items-center mb-2">
                  <i className="fas fa-database text-gray-700 mr-2 text-sm"></i>
                  <h4 className="text-xs font-bold">Institutional Data</h4>
                </div>
                <p className="text-xs text-gray-600 leading-snug">Premium sources trusted by institutions</p>
              </div>
              <div className="bg-gray-50 p-3">
                <div className="flex items-center mb-2">
                  <i className="fas fa-brain text-gray-700 mr-2 text-sm"></i>
                  <h4 className="text-xs font-bold">AI Research</h4>
                </div>
                <p className="text-xs text-gray-600 leading-snug">ML-powered investment insights</p>
              </div>
              <div className="bg-gray-50 p-3">
                <div className="flex items-center mb-2">
                  <i className="fas fa-chart-line text-gray-700 mr-2 text-sm"></i>
                  <h4 className="text-xs font-bold">Financial Models</h4>
                </div>
                <p className="text-xs text-gray-600 leading-snug">Full statement forecasts</p>
              </div>
              <div className="bg-gray-50 p-3">
                <div className="flex items-center mb-2">
                  <i className="fas fa-briefcase text-gray-700 mr-2 text-sm"></i>
                  <h4 className="text-xs font-bold">Model Portfolios</h4>
                </div>
                <p className="text-xs text-gray-600 leading-snug">Backtested strategies</p>
              </div>
            </div>
          </section>

          {/* US Treasury Yield Curve Section */}
          <section className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600">US Treasury Yield Curve</h3>
              <span className="text-xs text-gray-500">Updated 5m ago</span>
            </div>
            <Card className="p-4 bg-gray-50 border-0">
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="term"
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: '#9ca3af' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={{ stroke: '#9ca3af' }}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Yield']}
                      labelStyle={{ fontSize: 11 }}
                      contentStyle={{ fontSize: 11 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="yield"
                      stroke="#2563eb"
                      dot={{ fill: '#2563eb', strokeWidth: 0 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
                <div>
                  <div className="text-gray-500">2Y Yield</div>
                  <div className="font-mono">4.48%</div>
                </div>
                <div>
                  <div className="text-gray-500">10Y Yield</div>
                  <div className="font-mono">4.21%</div>
                </div>
                <div>
                  <div className="text-gray-500">30Y Yield</div>
                  <div className="font-mono">4.35%</div>
                </div>
                <div>
                  <div className="text-gray-500">2-10 Spread</div>
                  <div className="font-mono text-red-600">-0.27%</div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </MainLayout>
  );
} 