'use client';

import { useState } from 'react';
import { useTheme } from '@/app/context/ThemeProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PortfolioLayout from '@/app/components/layout/PortfolioLayout';
import { Info } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  ReferenceLine
} from 'recharts';

// Mock performance data with benchmark comparison
const mockPerformanceData = {
  chartData: [
    { date: '2019-01', portfolio: 100, benchmark: 100 },
    { date: '2019-04', portfolio: 110, benchmark: 105 },
    { date: '2019-07', portfolio: 115, benchmark: 108 },
    { date: '2019-10', portfolio: 118, benchmark: 110 },
    { date: '2020-01', portfolio: 122, benchmark: 112 },
    { date: '2020-04', portfolio: 95, benchmark: 90 },
    { date: '2020-07', portfolio: 118, benchmark: 105 },
    { date: '2020-10', portfolio: 125, benchmark: 110 },
    { date: '2021-01', portfolio: 135, benchmark: 118 },
    { date: '2021-04', portfolio: 148, benchmark: 125 },
    { date: '2021-07', portfolio: 165, benchmark: 135 },
    { date: '2021-10', portfolio: 178, benchmark: 142 },
    { date: '2022-01', portfolio: 168, benchmark: 138 },
    { date: '2022-04', portfolio: 160, benchmark: 132 },
    { date: '2022-07', portfolio: 172, benchmark: 136 },
    { date: '2022-10', portfolio: 178, benchmark: 140 },
    { date: '2023-01', portfolio: 195, benchmark: 145 },
    { date: '2023-04', portfolio: 215, benchmark: 152 },
    { date: '2023-07', portfolio: 225, benchmark: 160 },
    { date: '2023-10', portfolio: 240, benchmark: 168 },
    { date: '2024-01', portfolio: 255, benchmark: 178 },
    { date: '2024-04', portfolio: 270, benchmark: 185 },
  ],
  monthlyReturns: [
    { month: 'Jan', portfolio: 3.2, benchmark: 2.1 },
    { month: 'Feb', portfolio: 1.8, benchmark: 1.5 },
    { month: 'Mar', portfolio: -0.5, benchmark: -0.2 },
    { month: 'Apr', portfolio: 2.7, benchmark: 2.1 },
    { month: 'May', portfolio: 1.2, benchmark: 0.8 },
    { month: 'Jun', portfolio: -1.1, benchmark: -0.5 },
    { month: 'Jul', portfolio: 4.5, benchmark: 3.2 },
    { month: 'Aug', portfolio: 0.9, benchmark: 0.3 },
    { month: 'Sep', portfolio: -0.7, benchmark: -1.2 },
    { month: 'Oct', portfolio: 2.1, benchmark: 1.5 },
    { month: 'Nov', portfolio: 3.8, benchmark: 2.7 },
    { month: 'Dec', portfolio: 1.5, benchmark: 1.2 },
  ],
  metrics: {
    alpha: 2.3,
    beta: 1.15,
    sharpe: 1.85,
    volatility: 15.2,
    maxDrawdown: -14.5,
    trackingError: 4.8,
    informationRatio: 1.2
  },
  returns: {
    '1M': { portfolio: 3.5, benchmark: 2.8, difference: 0.7 },
    '3M': { portfolio: 8.2, benchmark: 6.5, difference: 1.7 },
    '6M': { portfolio: 12.5, benchmark: 9.8, difference: 2.7 },
    'YTD': { portfolio: 15.4, benchmark: 12.1, difference: 3.3 },
    '1Y': { portfolio: 28.4, benchmark: 21.5, difference: 6.9 },
    '3Y': { portfolio: 21.5, benchmark: 15.8, difference: 5.7 },
    '5Y': { portfolio: 19.8, benchmark: 14.3, difference: 5.5 },
    'Since Inception': { portfolio: 16.2, benchmark: 12.5, difference: 3.7 },
  }
};

// Helper function to format percentage values
const formatPercent = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Component for performance metrics
const PerformanceMetricsCard = ({ metrics, isDark }: { metrics: any, isDark: boolean }) => {
  return (
    <Card className={`p-4 shadow-none border-0 ${isDark ? 'bg-gray-800' : ''}`}>
      <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Risk Metrics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Alpha</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Excess return over benchmark after adjusting for risk</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className={`text-lg font-semibold ${metrics.alpha > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatPercent(metrics.alpha)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Beta</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Measure of volatility compared to the market</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="text-lg font-semibold">
            {metrics.beta.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sharpe</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Risk-adjusted return measure</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="text-lg font-semibold">
            {metrics.sharpe.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Volatility</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Standard deviation of returns</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="text-lg font-semibold">
            {metrics.volatility.toFixed(1)}%
          </div>
        </div>
      </div>
    </Card>
  );
};

export default function PortfolioDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [timeRange, setTimeRange] = useState('all');
  
  // Mock chart data
  const chartData = [
    { year: 2019, portfolio: 100, benchmark: 100 },
    { year: 2020, portfolio: 142, benchmark: 116 },
    { year: 2021, portfolio: 198, benchmark: 150 },
    { year: 2022, portfolio: 176, benchmark: 135 },
    { year: 2023, portfolio: 245, benchmark: 165 },
    { year: 2024, portfolio: 324, benchmark: 195 },
  ];

  // Filter chart data based on selected time range
  const getFilteredChartData = () => {
    if (timeRange === 'all') {
      return mockPerformanceData.chartData;
    }
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case '3Y':
        cutoffDate.setFullYear(now.getFullYear() - 3);
        break;
      case '5Y':
        cutoffDate.setFullYear(now.getFullYear() - 5);
        break;
      case 'YTD':
        cutoffDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return mockPerformanceData.chartData;
    }
    
    const cutoffDateStr = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, '0')}`;
    return mockPerformanceData.chartData.filter(item => item.date >= cutoffDateStr);
  };
  
  const filteredChartData = getFilteredChartData();
  
  return (
    <PortfolioLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className={`p-4 shadow-none border-0 ${isDark ? 'bg-gray-800' : ''}`}>
          <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Portfolio Description
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            High-growth technology companies with strong competitive advantages and market-leading positions. This portfolio focuses on innovative companies driving technological transformation across various sectors, with a bias towards software, semiconductors, and internet services.
          </p>
          
          <h3 className={`text-base font-semibold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Investment Strategy
          </h3>
          <ul className={`list-disc pl-5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>Focus on technology companies with strong competitive advantages</li>
            <li>Emphasis on companies with sustainable growth trajectories</li>
            <li>Active management with quarterly rebalancing</li>
            <li>Rigorous fundamental analysis and valuation discipline</li>
            <li>Long-term investment horizon with low turnover</li>
          </ul>
        </Card>
        
        <Card className={`p-4 shadow-none border-0 ${isDark ? 'bg-gray-800' : ''}`}>
          <div className="flex justify-between items-center mb-3">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Performance
            </h2>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant={timeRange === 'YTD' ? 'default' : 'outline'}
                onClick={() => setTimeRange('YTD')}
              >
                YTD
              </Button>
              <Button 
                size="sm"
                variant={timeRange === '1Y' ? 'default' : 'outline'}
                onClick={() => setTimeRange('1Y')}
              >
                1Y
              </Button>
              <Button 
                size="sm"
                variant={timeRange === '3Y' ? 'default' : 'outline'}
                onClick={() => setTimeRange('3Y')}
              >
                3Y
              </Button>
              <Button 
                size="sm"
                variant={timeRange === '5Y' ? 'default' : 'outline'}
                onClick={() => setTimeRange('5Y')}
              >
                5Y
              </Button>
              <Button 
                size="sm"
                variant={timeRange === 'all' ? 'default' : 'outline'}
                onClick={() => setTimeRange('all')}
              >
                All
              </Button>
            </div>
          </div>
          
          <div className="h-[180px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredChartData}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => value.split('-')[0].substring(2)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  labelFormatter={(value) => `${new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`}
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
                <tr className={`${isDark ? 'border-gray-700' : 'border-gray-200'} border-b border-dashed`}>
                  <td className="px-4 py-3 font-medium">Portfolio</td>
                  <td className="px-4 py-3 text-right text-green-500">+2.3%</td>
                  <td className="px-4 py-3 text-right text-green-500">+28.4%</td>
                  <td className="px-4 py-3 text-right text-green-500">+32.7%</td>
                  <td className="px-4 py-3 text-right text-green-500">+21.5%</td>
                  <td className="px-4 py-3 text-right text-green-500">+19.8%</td>
                </tr>
                <tr className="border-0">
                  <td className="px-4 py-3 font-medium">Benchmark</td>
                  <td className="px-4 py-3 text-right text-green-500">+1.8%</td>
                  <td className="px-4 py-3 text-right text-green-500">+5.2%</td>
                  <td className="px-4 py-3 text-right text-green-500">+12.4%</td>
                  <td className="px-4 py-3 text-right text-green-500">+8.2%</td>
                  <td className="px-4 py-3 text-right text-green-500">+9.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-6">
          <PerformanceMetricsCard metrics={mockPerformanceData.metrics} isDark={isDark} />
          
          <Card className={`p-4 shadow-none border-0 ${isDark ? 'bg-gray-800' : ''}`}>
            <h2 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Top Holdings
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {['NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AAPL'].map((symbol) => (
                <div key={symbol} className="text-center">
                  <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-black text-white rounded">
                    {symbol}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <Card className={`p-4 shadow-none border-0 ${isDark ? 'bg-gray-800' : ''}`}>
          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Monthly Returns (Current Year)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPerformanceData.monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <ReferenceLine y={0} stroke="#888" />
                <Bar dataKey="portfolio" name="Portfolio" fill="#10b981" />
                <Bar dataKey="benchmark" name="S&P 500" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </PortfolioLayout>
  );
} 