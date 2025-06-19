'use client';

import { useState, useEffect } from 'react';
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
import { Check, Filter, Search, Info, Loader2 } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';
import { portfolioService } from '@/api/v1/portfolios/service';

// Portfolio interface
interface Portfolio {
  id: string;
  name: string;
  ticker: string;
  market: string;
  description: string;
  category: string;
  riskLevel: string;
  performance: {
    ytd: string;
    oneYear: string;
    threeYear: string;
    fiveYear: string;
  };
  chartData: Array<{ year: number; value: number }>;
  holdings: string[];
}

export default function PortfolioPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(['all']);
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [benchmark, setBenchmark] = useState<any>(null);
  const [categories, setCategories] = useState<{label: string, value: string}[]>([]);
  const [riskLevels, setRiskLevels] = useState<{label: string, value: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define fetchData outside the useEffect
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching portfolio data...');
      
      const result = await portfolioService.getAllPortfolios();
      console.log('Portfolio data fetched:', result);
      
      const { portfolios: fetchedPortfolios, categories: fetchedCategories, riskLevels: fetchedRiskLevels } = result;
      
      // Find the benchmark portfolio (S&P 500)
      const benchmarkPortfolio = fetchedPortfolios.find((p: Portfolio) => p.ticker === 'SPY');
      
      // Set the portfolios excluding the benchmark
      setPortfolios(fetchedPortfolios.filter((p: Portfolio) => p.ticker !== 'SPY'));
      
      // Set the benchmark separately
      if (benchmarkPortfolio) {
        setBenchmark(benchmarkPortfolio);
      }
      
      // Set categories and risk levels for filtering
      setCategories([
        { label: 'All Categories', value: 'all' },
        ...fetchedCategories.map((cat: string) => ({ label: cat, value: cat }))
      ]);
      
      setRiskLevels([
        { label: 'All Risk Levels', value: 'all' },
        ...fetchedRiskLevels.map((risk: string) => ({ label: risk, value: risk }))
      ]);
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching portfolio data:', err);
      setError(`Failed to load portfolio data: ${err.message || 'Unknown error'}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get all portfolios performance ranked by 1Y performance
  const sortedPortfolios = [...portfolios].sort((a, b) => {
    const aPerf = parseFloat(a.performance.oneYear.replace('%', ''));
    const bPerf = parseFloat(b.performance.oneYear.replace('%', ''));
    return bPerf - aPerf;
  });

  // Get top 10 portfolios with S&P 500 benchmark inserted
  const topPortfolios = [...sortedPortfolios];
  
  // Only insert benchmark if it exists
  if (benchmark) {
    const sp500OneYearPerf = parseFloat(benchmark.performance.oneYear.replace('%', ''));
    const benchmarkIndex = topPortfolios.findIndex(p => 
      parseFloat(p.performance.oneYear.replace('%', '')) < sp500OneYearPerf
    );
    
    // Insert S&P 500 at the correct position based on its performance
    if (benchmarkIndex !== -1) {
      topPortfolios.splice(benchmarkIndex, 0, benchmark);
    } else {
      topPortfolios.push(benchmark);
    }
  }

  // Filter portfolios based on selected criteria
  const filteredPortfolios = portfolios.filter(portfolio => {
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

  if (loading) {
    return (
      <MainLayout>
        <div className="py-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className={`h-10 w-10 animate-spin mx-auto mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Loading portfolios...
            </h3>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="py-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className={`p-4 mb-4 rounded-lg ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
              {error}
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-6">
        <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Model Portfolios
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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
          
          {/* Middle Column - Model Portfolios */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-6">
              {filteredPortfolios.length === 0 ? (
                <div className={`p-8 text-center border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    No portfolios found
                  </div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Try adjusting your filters or search term.
                  </p>
                </div>
              ) : (
                filteredPortfolios.map((portfolio) => (
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
                                          <div className="text-xs text-gray-500 flex items-center justify-center">
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
                                          <div className="text-xs text-gray-500 flex items-center justify-center">
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
                ))
              )}
            </div>
          </div>

          {/* Right Column - Top Performing Portfolios */}
          <div className="lg:col-span-1">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'} sticky top-6`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                Top Performing Portfolios
              </h3>
              <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                1-Year Performance Ranking
              </p>
              
              <div className={`space-y-2 max-h-[600px] overflow-y-auto pr-2 ${isDark ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                {topPortfolios.slice(0, 10).map((portfolio, index) => {
                  const perfValue = parseFloat(portfolio.performance.oneYear.replace('%', ''));
                  const isBenchmark = portfolio.id === 'sp500';
                  const sp500OneYearPerf = benchmark ? parseFloat(benchmark.performance.oneYear.replace('%', '')) : 0;
                  const vsSpPerformance = perfValue - sp500OneYearPerf;
                  
                  return (
                    <div 
                      key={portfolio.id}
                      className={`relative py-2 ${
                        index < topPortfolios.slice(0, 10).length - 1 ? 
                        `border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}` : ''
                      } ${isBenchmark ? `${isDark ? 'bg-gray-700/30' : 'bg-blue-50/40'} -mx-4 px-4` : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className={`w-5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {index + 1}.
                          </span>
                          <div>
                            <div className={`text-sm font-medium truncate max-w-[120px] ${isBenchmark ? 'font-semibold' : ''} ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                              {portfolio.name}
                            </div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {portfolio.ticker}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            perfValue > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {portfolio.performance.oneYear}
                          </div>
                          
                          {!isBenchmark && benchmark && (
                            <div className={`text-xs ${
                              vsSpPerformance > 0 
                                ? 'text-green-400' 
                                : vsSpPerformance < 0 
                                  ? 'text-red-400' 
                                  : isDark ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {vsSpPerformance > 0 ? '+' : ''}{vsSpPerformance.toFixed(1)}% vs S&P
                            </div>
                          )}
                          
                          {isBenchmark && (
                            <div className={`text-xs ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              Benchmark
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4">
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  * Performance data as of {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 