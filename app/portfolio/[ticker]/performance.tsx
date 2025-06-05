'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/app/context/ThemeProvider';
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
import { Info } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

// Helper function to format date labels
const formatDate = (dateStr: string) => {
  const [year, month] = dateStr.split('-');
  return `${month === '01' ? year : ''}`;
};

// Helper function to format percentage values
const formatPercent = (value: number) => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Component for performance metrics
const PerformanceMetricsCard = ({ metrics, isDark }: { metrics: any, isDark: boolean }) => {
  return (
    <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
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
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Max Drawdown</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Maximum observed loss from a peak to a trough</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="text-lg font-semibold text-red-500">
            {metrics.maxDrawdown.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Tracking Error</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Divergence between portfolio and benchmark returns</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="text-lg font-semibold">
            {metrics.trackingError.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Info Ratio</span>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Excess return per unit of risk</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="text-lg font-semibold">
            {metrics.informationRatio.toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Component for returns table
const ReturnsComparisonCard = ({ returns, isDark }: { returns: any, isDark: boolean }) => {
  return (
    <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
      <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Performance vs. Benchmark
      </h3>
      <div className="overflow-x-auto">
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
              <td className={`px-4 py-3 text-right ${returns['1M'].portfolio > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['1M'].portfolio)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['YTD'].portfolio > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['YTD'].portfolio)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['1Y'].portfolio > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['1Y'].portfolio)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['3Y'].portfolio > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['3Y'].portfolio)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['5Y'].portfolio > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['5Y'].portfolio)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Benchmark</td>
              <td className={`px-4 py-3 text-right ${returns['1M'].benchmark > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['1M'].benchmark)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['YTD'].benchmark > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['YTD'].benchmark)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['1Y'].benchmark > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['1Y'].benchmark)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['3Y'].benchmark > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['3Y'].benchmark)}
              </td>
              <td className={`px-4 py-3 text-right ${returns['5Y'].benchmark > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(returns['5Y'].benchmark)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default function PerformanceTab() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [timeRange, setTimeRange] = useState('all');
  
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
    <div className="space-y-6">
      <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Cumulative Performance
          </h3>
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
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                domain={['dataMin - 5', 'dataMax + 5']}
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
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReturnsComparisonCard returns={mockPerformanceData.returns} isDark={isDark} />
        <PerformanceMetricsCard metrics={mockPerformanceData.metrics} isDark={isDark} />
      </div>
      
      <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
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
  );
} 