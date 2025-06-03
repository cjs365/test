'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

// Mock data for charts
const mockChartOfWeekData = [
  { year: '2019', earnings: 5.2, treasury: 2.1 },
  { year: '2020', earnings: 4.8, treasury: 1.5 },
  { year: '2021', earnings: 5.5, treasury: 1.8 },
  { year: '2022', earnings: 6.2, treasury: 3.5 },
  { year: '2023', earnings: 5.8, treasury: 4.2 },
  { year: '2024', earnings: 5.5, treasury: 4.4 },
];

export default function HomePage() {
  const [marketRegion, setMarketRegion] = useState<'US' | 'CN'>('US');

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="navbar-brand">ClarVal</a>
              <div className="hidden md:flex space-x-4 ml-8">
                <a href="#" className="nav-link active">Markets</a>
                <a href="#" className="nav-link">Economics</a>
                <a href="#" className="nav-link">Industries</a>
                <a href="#" className="nav-link">Tech</a>
                <a href="#" className="nav-link">Politics</a>
                <a href="#" className="nav-link">Businessweek</a>
                <a href="#" className="nav-link">Opinion</a>
              </div>
            </div>
            <div className="flex items-center">
              <div className="search-container">
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full px-4 py-1 bg-gray-800 text-white rounded border border-gray-700" 
                    placeholder="Search..."
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              <div className="ml-4">
                <button className="text-white">
                  <i className="fas fa-user"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Market Indices Bar */}
      <div className="market-indices-bar">
        <div className="container mx-auto">
          <div className="indices-header">
            <button className="asset-class-btn">
              <span>Equity Indices</span>
              <i className="fas fa-chevron-down"></i>
            </button>
          </div>
          <div className="flex items-center space-x-4 overflow-x-auto">
            <div className="market-index-item">
              <span className="index-name">S&P 500</span>
              <span className="index-value">5,908.03</span>
              <span className="change-value negative">▼ 0.07%</span>
            </div>
            <div className="market-index-item">
              <span className="index-name">Nasdaq</span>
              <span className="index-value">19,117.24</span>
              <span className="change-value negative">▼ 0.31%</span>
            </div>
            <div className="market-index-item">
              <span className="index-name">FTSE 100</span>
              <span className="index-value">8,786.09</span>
              <span className="change-value positive">▲ 0.90%</span>
            </div>
            <div className="market-index-item">
              <span className="index-name">Dow Jones</span>
              <span className="index-value">42,221.99</span>
              <span className="change-value positive">▲ 0.01%</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (8 columns) */}
          <div className="lg:col-span-8">
            {/* Key Story Section */}
            <section className="section">
              <div className="section-header">
                <span>Key Story</span>
              </div>
              <div className="key-story">
                <div 
                  className="key-story-image" 
                  style={{ 
                    backgroundImage: "url('https://via.placeholder.com/400x300/e9ecef/495057?text=Trump+Tariffs')"
                  }}
                />
                <div className="key-story-content">
                  <h3 className="text-xl font-bold mb-2">
                    Trump Extends Deadline for 50% Tariffs on EU to July 9
                  </h3>
                  <p className="text-muted mb-2">
                    Stock futures rise as dollar dips on EU tariff delay announcement
                  </p>
                  <p className="text-gray-600 mb-4">
                    The decision comes amid ongoing negotiations between the United States and European Union over trade policies. Market analysts suggest this extension provides additional time for reaching a potential agreement.
                  </p>
                  <small className="text-gray-500">2 hours ago</small>
                </div>
              </div>
            </section>

            {/* Featured Analysis Section */}
            <section className="section">
              <div className="section-header">
                <span>Featured Analysis</span>
                <a href="#" className="view-all-btn">View All</a>
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
            <section className="section">
              <div className="section-header">
                <span>Hot Stocks</span>
                <a href="#" className="view-all-btn">View All</a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="py-2">Symbol</th>
                      <th>Company</th>
                      <th>Price</th>
                      <th>Change</th>
                      <th>% Change</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-3 font-semibold">AAPL</td>
                      <td>Apple Inc.</td>
                      <td>$178.14</td>
                      <td className="positive">+4.86</td>
                      <td className="positive">+2.81%</td>
                      <td>68.2M</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 font-semibold">MSFT</td>
                      <td>Microsoft Corp.</td>
                      <td>$412.65</td>
                      <td className="positive">+3.27</td>
                      <td className="positive">+0.80%</td>
                      <td>22.1M</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-3 font-semibold">TSLA</td>
                      <td>Tesla Inc.</td>
                      <td>$215.32</td>
                      <td className="negative">-7.18</td>
                      <td className="negative">-3.23%</td>
                      <td>125.7M</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Market Analysis Section */}
            <section className="section">
              <div className="section-header">
                <span>Market Analysis</span>
                <a href="#" className="view-all-btn">View All</a>
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
                            style={{ height: `${40 + i * 5}%` }}
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

            {/* Chart of the Week Section */}
            <section className="section">
              <div className="section-header">
                <span>Chart of the Week</span>
                <a href="#" className="view-all-btn">View Archive</a>
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
            <section className="section">
              <div className="section-header">
                <span>AI Explorer</span>
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
          </div>

          {/* Right Column (4 columns) */}
          <div className="lg:col-span-4">
            {/* Factor Performance Section */}
            <section className="section">
              <div className="section-header">
                <span>Factor Performance</span>
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
            <section className="section">
              <div className="section-header">
                <span>Macro Snapshot</span>
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-bold mb-4">ClarVal</h5>
              <p className="text-sm text-gray-300">
                Professional stock analysis and portfolio management tools for individual investors.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Products</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Stock Screener</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Portfolio Analysis</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Research Reports</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Market Data</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Resources</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Learning Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Market News</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Economic Calendar</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-bold mb-4">Company</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Terms & Privacy</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-8 border-gray-700" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              &copy; 2023 ClarVal Financial Analytics. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 