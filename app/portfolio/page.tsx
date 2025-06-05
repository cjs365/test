'use client';

import { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/app/context/ThemeProvider';
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
import { Check, Filter, Search, Info } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';

// Mock data for model portfolios
const mockModelPortfolios = [
  {
    id: 'tech-growth',
    name: 'Tech Growth Leaders',
    ticker: 'TGRT',
    market: 'US',
    description: 'High-growth technology companies with strong competitive advantages',
    category: 'Technology',
    riskLevel: 'High',
    performance: {
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
    holdings: ['NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AAPL', 'ADBE', 'CRM', 'TSM', 'AVGO']
  },
  {
    id: 'dividend-income',
    name: 'Dividend Income',
    ticker: 'DINC',
    market: 'US',
    description: 'Stable companies with consistent dividend growth history',
    category: 'Income',
    riskLevel: 'Low',
    performance: {
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
    holdings: ['JNJ', 'PG', 'KO', 'PEP', 'VZ', 'XOM', 'CVX', 'MMM', 'MCD', 'T']
  },
  {
    id: 'balanced-growth',
    name: 'Balanced Growth',
    ticker: 'BLGR',
    market: 'US',
    description: 'Diversified portfolio with moderate growth and income components',
    category: 'Balanced',
    riskLevel: 'Medium',
    performance: {
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
    holdings: ['AAPL', 'BRK.B', 'HD', 'UNH', 'V', 'MSFT', 'JPM', 'JNJ', 'PG', 'MA']
  },
  {
    id: 'healthcare-innovation',
    name: 'Healthcare Innovation',
    ticker: 'HCIN',
    market: 'US',
    description: 'Companies at the forefront of healthcare technology and services',
    category: 'Healthcare',
    riskLevel: 'Medium-High',
    performance: {
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
    holdings: ['UNH', 'LLY', 'ISRG', 'ABBV', 'TMO', 'JNJ', 'AMGN', 'ABT', 'DHR', 'GILD']
  },
  {
    id: 'esg-leaders',
    name: 'ESG Leaders',
    ticker: 'ESGL',
    market: 'US',
    description: 'Companies with strong environmental, social, and governance practices',
    category: 'ESG',
    riskLevel: 'Medium',
    performance: {
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
    holdings: ['MSFT', 'CSCO', 'ADBE', 'CRM', 'NFLX', 'GOOGL', 'INTC', 'NVDA', 'PYPL', 'ADP']
  }
];

// Categories for filtering
const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Income', label: 'Income' },
  { value: 'Balanced', label: 'Balanced' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'ESG', label: 'ESG' },
];

// Risk levels for filtering
const riskLevels = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Medium-High', label: 'Medium-High' },
  { value: 'High', label: 'High' },
];

export default function PortfolioPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(['all']);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter portfolios based on selected criteria
  const filteredPortfolios = mockModelPortfolios.filter(portfolio => {
    // Filter by search term
    if (searchTerm && !portfolio.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (!selectedCategories.includes('all') && !selectedCategories.includes(portfolio.category)) {
      return false;
    }
    
    // Filter by risk level
    if (!selectedRiskLevels.includes('all') && !selectedRiskLevels.includes(portfolio.riskLevel)) {
      return false;
    }
    
    return true;
  });

  // Handle category selection
  const handleCategoryToggle = (value: string) => {
    setSelectedCategories(current => {
      if (value === 'all') return ['all'];
      
      const withoutAll = current.filter(item => item !== 'all');
      
      const newSelection = withoutAll.includes(value)
        ? withoutAll.filter(item => item !== value)
        : [...withoutAll, value];
      
      return newSelection.length === 0 ? ['all'] : newSelection;
    });
  };

  // Handle risk level selection
  const handleRiskLevelToggle = (value: string) => {
    setSelectedRiskLevels(current => {
      if (value === 'all') return ['all'];
      
      const withoutAll = current.filter(item => item !== 'all');
      
      const newSelection = withoutAll.includes(value)
        ? withoutAll.filter(item => item !== value)
        : [...withoutAll, value];
      
      return newSelection.length === 0 ? ['all'] : newSelection;
    });
  };

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Model Portfolios
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} mb-4`}>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search Portfolios
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={`w-full px-3 py-2 rounded border text-sm ${
                      isDark 
                        ? 'bg-gray-700 text-gray-100 border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className={`absolute right-3 top-2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </div>
              
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Categories
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.value} className="flex items-center">
                      <button
                        onClick={() => handleCategoryToggle(category.value)}
                        className={`flex items-center justify-between w-full px-3 py-1.5 rounded text-sm ${
                          selectedCategories.includes(category.value)
                            ? isDark
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-800'
                            : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        <span>{category.label}</span>
                        {selectedCategories.includes(category.value) && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Risk Level
                </label>
                <div className="space-y-2">
                  {riskLevels.map((risk) => (
                    <div key={risk.value} className="flex items-center">
                      <button
                        onClick={() => handleRiskLevelToggle(risk.value)}
                        className={`flex items-center justify-between w-full px-3 py-1.5 rounded text-sm ${
                          selectedRiskLevels.includes(risk.value)
                            ? isDark
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-800'
                            : isDark
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        <span>{risk.label}</span>
                        {selectedRiskLevels.includes(risk.value) && (
                          <Check className="h-4 w-4 ml-2" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Model Portfolios */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <Card key={portfolio.id} className={`overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {portfolio.name}
                        </h3>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {portfolio.ticker} · {portfolio.market} · {portfolio.holdings.length} positions
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
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
                        <Link href={`/portfolio/${portfolio.ticker.toLowerCase()}`}>
                          <Button size="sm" variant="outline" className="mt-1">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:divide-x md:divide-gray-200 dark:md:divide-gray-700">
                      {/* Chart - Left Column */}
                      <div className="h-[200px] flex items-end">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={portfolio.chartData}>
                            <XAxis 
                              dataKey="year" 
                              tick={{ fontSize: 11 }} 
                              tickFormatter={(value) => value.toString().substr(2)}
                            />
                            <YAxis 
                              tick={{ fontSize: 11 }}
                              domain={['dataMin', 'dataMax']}
                              tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip 
                              formatter={(value) => [`${value}%`, 'Value']}
                              labelFormatter={(value) => `Year: ${value}`}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              name={portfolio.name}
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Information - Right Column */}
                      <div className="md:pl-4 flex flex-col">
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {portfolio.description}
                          </p>
                        </div>
                        
                        <div className="mt-auto">
                          {/* Performance */}
                          <div className="mb-4">
                            <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Performance
                            </h4>
                            <div className="grid grid-cols-4 gap-2">
                              <div className={`text-center p-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <div className="text-xs text-gray-500">YTD</div>
                                <div className={`text-sm font-medium ${portfolio.performance.ytd.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                  {portfolio.performance.ytd}
                                </div>
                              </div>
                              <div className={`text-center p-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <div className="text-xs text-gray-500">1Y</div>
                                <div className={`text-sm font-medium ${portfolio.performance.oneYear.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                  {portfolio.performance.oneYear}
                                </div>
                              </div>
                              <div className={`text-center p-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <div className="relative">
                                        <div className="text-xs text-gray-500 flex items-center">
                                          3Y <Info className="h-3 w-3 ml-0.5 inline" />
                                        </div>
                                        <div className={`text-sm font-medium ${portfolio.performance.threeYear.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                          {portfolio.performance.threeYear}
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">3-year annualized return</p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              </div>
                              <div className={`text-center p-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <TooltipProvider>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <div className="relative">
                                        <div className="text-xs text-gray-500 flex items-center">
                                          5Y <Info className="h-3 w-3 ml-0.5 inline" />
                                        </div>
                                        <div className={`text-sm font-medium ${portfolio.performance.fiveYear.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                          {portfolio.performance.fiveYear}
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">5-year annualized return</p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                          
                          {/* Current Holdings */}
                          <div>
                            <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Current Holdings
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {portfolio.holdings.slice(0, 6).map((symbol) => (
                                <div 
                                  key={symbol}
                                  className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-black text-white rounded`}
                                >
                                  {symbol}
                                </div>
                              ))}
                              {portfolio.holdings.length > 6 && (
                                <div className={`text-xs text-blue-500 cursor-pointer flex items-center`}>
                                  Show all ({portfolio.holdings.length})
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 