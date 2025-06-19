'use client';

import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, Plus, ArrowRight, Download, 
  BarChart3, Activity, FileBarChart, Upload,
  DollarSign, Calendar, Maximize2, Info
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeProvider';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Legend,
  Cell, 
  PieChart as RechartsChart,
  Pie,
  Sector,
  LineChart,
  Line,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import UploadPortfolioDialog from './components/UploadPortfolioDialog';
import PortfolioManagementDialog from './components/PortfolioManagementDialog';

// Import the mock data
import {
  portfolios,
  benchmarks,
  timePeriods,
  currencyOptions,
  keyMetrics,
  factorAttributionData,
  factorExposureData,
  factorProfileData,
  predefinedScenarios,
  scenarioPnLData,
  topHoldings,
  similarStocks,
  factorReturnTable,
  getComparisonData,
  getComparisonAnalysis
} from '@/mock-data/portfolio-analysis';

export default function PortfolioAnalysisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0].id);
  const [selectedBenchmark, setSelectedBenchmark] = useState(benchmarks[0].id);
  const [timePeriod, setTimePeriod] = useState('ytd');
  const [currencyView, setCurrencyView] = useState('base');
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Added state for selected comparison stock with specific ticker type
  type StockTicker = 'TXN' | 'ROP' | 'ADI';
  const [comparisonStock, setComparisonStock] = useState<{ticker: StockTicker, name: string} | null>(null);
  
  // Colors for charts
  const COLORS = isDark ? 
    ['#4ade80', '#60a5fa', '#f97316', '#a78bfa', '#f43f5e', '#facc15', '#94a3b8'] : 
    ['#22c55e', '#3b82f6', '#ea580c', '#8b5cf6', '#e11d48', '#eab308', '#64748b'];
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Handle portfolio upload
  const handlePortfolioUpload = (portfolioName: string, tickers: any[]) => {
    // TODO: In a real app, we would send this data to the backend
    console.log('Uploading portfolio:', {
      name: portfolioName,
      tickers
    });
    
    // Add the new portfolio to the list (in a real app, this would come from the backend)
    const newPortfolio = {
      id: (portfolios.length + 1).toString(),
      name: portfolioName
    };
    
    // In a real application, we would refresh the portfolio list from the backend
    // and select the newly created portfolio
    setSelectedPortfolio(newPortfolio.id);
  };
  
  // Handle portfolio removal
  const handleRemovePortfolio = (portfolioId: string) => {
    // In a real app, this would call an API to remove the portfolio
    console.log('Removing portfolio with ID:', portfolioId);
    
    // If the selected portfolio is removed, select another one
    if (selectedPortfolio === portfolioId && portfolios.length > 1) {
      const remainingPortfolio = portfolios.find(p => p.id !== portfolioId);
      if (remainingPortfolio) {
        setSelectedPortfolio(remainingPortfolio.id);
      }
    }
  };
  
  // Handle portfolio edit
  const handleEditPortfolio = (portfolioId: string, newName: string) => {
    // In a real app, this would call an API to update the portfolio
    console.log('Editing portfolio:', {
      id: portfolioId,
      newName
    });
  };
  
  // Handle editing of portfolio holdings
  const handleEditHoldings = (portfolioId: string, holdings: any[]) => {
    // In a real app, this would call an API to update the holdings
    console.log('Updating portfolio holdings:', {
      portfolioId,
      holdings
    });
  };
  
  // Render Active Shape for Pie Chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={isDark ? "#f9fafb" : "#1f2937"}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={isDark ? "#d1d5db" : "#4b5563"}>
          {`${value.toFixed(2)}% (${(percent * 100).toFixed(1)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  // Render sparkline chart
  const renderSparkline = (data: any[], color: string) => {
    return (
      <ResponsiveContainer width="100%" height={30}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparkGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color === 'green' ? '#4ade80' : color === 'amber' ? '#f59e0b' : '#f43f5e'} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color === 'green' ? '#4ade80' : color === 'amber' ? '#f59e0b' : '#f43f5e'} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color === 'green' ? '#4ade80' : color === 'amber' ? '#f59e0b' : '#f43f5e'} 
            fillOpacity={1} 
            fill={`url(#sparkGradient-${color})`} 
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // Handle comparison stock selection
  const handleCompareStock = (ticker: StockTicker, name: string) => {
    setComparisonStock({ ticker, name });
    // Scroll to the comparison section
    setTimeout(() => {
      const comparisonSection = document.getElementById('stock-comparison');
      if (comparisonSection) {
        comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };
  
  return (
    <TooltipProvider>
    <MainLayout>
      <div className="p-3 max-w-[1600px] mx-auto">
        {/* Header section with title and export buttons */}
        <div className="mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Equity Portfolio Risk & Performance Dashboard
            </h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Data as of August 31, 2023
            </p>
          </div>
          </div>
        </div>
        
        {/* Main container - Two column layout with freely stacking sections */}
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Left Column - All sections stack freely */}
          <div className="lg:w-1/2 space-y-2">
            {/* Portfolio Selection Options */}
            <div className="bg-card p-2 rounded-sm">
              <div className="text-xs font-medium mb-2 pb-1 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span>Portfolio Selection</span>
              </div>
                
                {/* First row: three columns with selection controls */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Portfolio
                    </label>
                  <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                    <SelectTrigger className={`mt-1 h-7 text-xs ${isDark ? 'bg-card border-gray-700' : ''}`}>
                      <SelectValue placeholder="Select a portfolio" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-card border-gray-700' : ''}>
                      {portfolios.map((portfolio) => (
                        <SelectItem key={portfolio.id} value={portfolio.id}>
                          {portfolio.name}
                        </SelectItem>
                      ))}
                      <div className="px-1 py-1 border-t border-gray-100 dark:border-gray-800 mt-1">
                        <PortfolioManagementDialog
                          portfolios={portfolios} 
                          onAddPortfolio={handlePortfolioUpload}
                          onRemovePortfolio={handleRemovePortfolio}
                          onEditPortfolio={handleEditPortfolio}
                          onEditHoldings={handleEditHoldings}
                        />
                      </div>
                    </SelectContent>
                  </Select>
                </div>
                
                  <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Benchmark
                  </label>
                  <Select value={selectedBenchmark} onValueChange={setSelectedBenchmark}>
                    <SelectTrigger className={`mt-1 h-7 text-xs ${isDark ? 'bg-card border-gray-700' : ''}`}>
                      <SelectValue placeholder="Select a benchmark" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-card border-gray-700' : ''}>
                      {benchmarks.map((benchmark) => (
                        <SelectItem key={benchmark.id} value={benchmark.id}>
                          {benchmark.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
        
                  <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Time Period
                  </label>
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className={`mt-1 h-7 text-xs ${isDark ? 'bg-card border-gray-700' : ''}`}>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-card border-gray-700' : ''}>
                      {timePeriods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
                {/* Second row: Run button in middle column */}
                <div className="grid grid-cols-3 gap-3">
                  <div></div> {/* Empty left column */}
                  <div>
                    <Button className="w-full py-2" size="lg">
                      <Activity className="h-5 w-5 mr-2" />
                  Run Analysis
                </Button>
                  </div>
                  <div></div> {/* Empty right column */}
              </div>
            </div>
            
            {/* Performance Attribution Section */}
            <div className="bg-card p-2 rounded-sm">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                  <div className="flex items-center">
                  <h3 className="text-sm font-semibold">Performance Attribution</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        How did we perform?
                      </TooltipContent>
                    </Tooltip>
                </div>
              </div>
              
              {/* Factor Attribution Chart */}
              <div className="mb-2">
                <div className="text-xs font-medium mb-1">Factor Attribution Analysis</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                      data={factorAttributionData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={50} 
                      tick={{ fontSize: 9 }}
                      tickMargin={8}
                      stroke={isDark ? '#6b7280' : '#9ca3af'}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}bp`} 
                      tick={{ fontSize: 9 }}
                      stroke={isDark ? '#6b7280' : '#9ca3af'}
                    />
                    <RechartsTooltip
                      formatter={(value, name) => [
                        `${value} bp`, 
                        name === 'allocation' ? 'Allocation Effect (factor exposure)' : 
                        name === 'selection' ? 'Selection Effect (stock picking within factor)' : 
                        'Interaction Effect (combined impact)'
                      ]}
                      labelFormatter={(label) => `${label} Factor`}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={25}
                      iconSize={7}
                      wrapperStyle={{ fontSize: 9 }}
                      formatter={(value) => value === 'allocation' ? 'Allocation Effect' : value === 'selection' ? 'Selection Effect' : 'Interaction Effect'} 
                    />
                    <Bar dataKey="allocation" fill="#3b82f6" name="allocation" />
                    <Bar dataKey="selection" fill="#4ade80" name="selection" />
                    <Bar dataKey="interaction" fill="#f59e0b" name="interaction" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Factor Exposure and Performance Charts - Stacked vertically */}
              <div className="space-y-3">
                  {/* Factor Exposure Snapshot - With Profile on left side */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Portfolio Factor Profile on the left */}
                    <div>
                      <div className="text-xs font-medium mb-2">Portfolio Factor Profile</div>
                      <table className="w-full text-xs">
                        <tbody>
                          {Object.entries(factorProfileData).map(([factor, level], index) => (
                            <tr key={factor} className="border-b border-gray-100 dark:border-gray-800">
                              <td className="py-1 font-medium">{factor}</td>
                              <td className="py-1 text-right">{level}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Factor Exposure chart on the right */}
                  <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-medium">Factor Exposure (Z-Scores)</div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      layout="vertical"
                          data={factorExposureData}
                      margin={{ top: 0, right: 10, left: 70, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                      <XAxis 
                        type="number" 
                        domain={[-1, 1]} 
                        tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}σ`}
                        tick={{ fontSize: 8 }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 9 }} 
                        width={60}
                      />
                      <RechartsTooltip 
                        formatter={(value: number) => [`${value > 0 ? '+' : ''}${value.toFixed(2)}σ exposure`, 'vs Benchmark']}
                      />
                      <Bar dataKey="exposure" barSize={8}>
                            {factorExposureData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.exposure > 0 ? '#3b82f6' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                  </div>
              </div>

              {/* Factor Return Table - Compact Version */}
              <div className="mt-2">
                <div className="text-xs font-medium mb-1">Factor Return Table</div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left font-medium py-1 pr-2">Factor</th>
                        <th className="text-right font-medium py-1 px-2">Benchmark</th>
                        <th className="text-right font-medium py-1 px-2">Exposure</th>
                        <th className="text-right font-medium py-1 pl-2">Attribution</th>
                      </tr>
                    </thead>
                    <tbody>
                        {factorReturnTable.map((row, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 pr-2 font-medium">{row.factor}</td>
                            <td className="py-1 px-2 text-right">{row.benchmark}</td>
                            <td className={`py-1 px-2 text-right text-${row.exposureDirection === 'positive' ? 'blue' : 'red'}-500`}>
                              {row.exposure}
                            </td>
                            <td className="py-1 pl-2 text-right">{row.attribution}</td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              

            </div>
            
            {/* Scenario Analysis Section */}
            <div className="bg-card p-2 rounded-sm">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                  <div className="flex items-center">
                <h3 className="text-sm font-semibold">Scenario Analysis & Stress Testing</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        How would the portfolio perform in different scenarios?
                      </TooltipContent>
                    </Tooltip>
                  </div>
              </div>
              
              {/* Predefined Scenarios */}
              <div className="mb-2">
                <div className="text-xs font-medium mb-1">Predefined Scenarios</div>
                <div className="flex flex-wrap gap-1 mb-2">
                    {predefinedScenarios.map((scenario, index) => (
                    <Button 
                      key={index} 
                      variant={index === 0 ? "default" : "outline"} 
                      size="sm" 
                      className="text-[10px] h-5 px-2"
                    >
                      {scenario}
                    </Button>
                  ))}
                </div>
                
                {/* Scenario P&L Table */}
                <div className="overflow-x-auto text-xs">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "25%" }} />
                        <col style={{ width: "25%" }} />
                      </colgroup>
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-1 pr-2 font-medium">Scenario</th>
                        <th className="text-right py-1 px-2 font-medium">Return</th>
                          <th className="text-right py-1 px-2 font-medium">VaR Shift</th>
                          <th className="text-left py-1 px-2 font-medium">Factors</th>
                      </tr>
                    </thead>
                    <tbody>
                        {scenarioPnLData.map((row, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 pr-2 font-medium">{row.scenario}</td>
                            <td className="py-1 px-2 text-right text-red-500">{row.return}</td>
                            <td className="py-1 px-2 text-right">{row.varShift}</td>
                            <td className="py-1 px-2">
                              <div className="flex gap-1">
                                {row.factors.map((factor, i) => (
                                  <span 
                                    key={i}
                                    className={`bg-${factor.color}-100 dark:bg-${factor.color}-900/30 text-${factor.color}-800 dark:text-${factor.color}-200 text-[9px] px-1 py-0.5 rounded-sm`}
                                  >
                                    {factor.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                      </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                  </div>
              
              {/* Custom Factor Stress */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="text-xs font-medium mb-1">Custom Factor Stress</div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="col-span-2">
                    <label className={`block text-[10px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Factor
                    </label>
                    <Select value="momentum" onValueChange={() => {}}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Momentum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="momentum">Momentum</SelectItem>
                        <SelectItem value="quality">Quality</SelectItem>
                        <SelectItem value="valuation">Valuation</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="risk">Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={`block text-[10px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Shock Size
                    </label>
                    <Select value="2sigma" onValueChange={() => {}}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="+2σ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1sigma">+1σ</SelectItem>
                        <SelectItem value="2sigma">+2σ</SelectItem>
                        <SelectItem value="3sigma">+3σ</SelectItem>
                        <SelectItem value="-1sigma">-1σ</SelectItem>
                        <SelectItem value="-2sigma">-2σ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  </div>
                  
                {/* Shock Impact */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/50 border-l-2 border-red-400 dark:border-red-600 rounded-sm">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Expected Return Impact</div>
                    <div className="text-lg font-bold text-red-500">-4.6%</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Benchmark: -2.1%</div>
                        </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900/50 border-l-2 border-amber-400 dark:border-amber-600 rounded-sm">
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5">Top Affected Holdings</div>
                    <div className="text-xs">NVDA, AMZN, TSLA</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">52% of factor exposure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - All sections stack freely */}
          <div className="lg:w-1/2 space-y-2">
            {/* AI Portfolio Insights */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-sm border-l-2 border-blue-400 dark:border-blue-600">
              <div className="flex gap-2">
                <Activity className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-300">AI Portfolio Insights</div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 dark:text-blue-300">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Explain This Page
                    </Button>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    This portfolio is positioned as a <span className="font-medium">quality-momentum blend with growth tilt</span>. 
                    Your overweight to the Momentum factor (+0.85σ) was the key driver of outperformance, 
                    contributing +130bp of excess return over the benchmark. The Quality factor positioning (+0.6σ) 
                    also positively contributed, while your underweight to Valuation (-0.4σ) detracted slightly during 
                    this period. Consider reducing exposure to Risk stocks which underperformed.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Portfolio Return & Risk Snapshot */}
            <div className="bg-card p-2 rounded-sm">
              <div className="border-b border-gray-200 dark:border-gray-700 mb-2 pb-1">
                  <div className="flex items-center">
                <h3 className="text-sm font-semibold">Portfolio Return & Risk Snapshot</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Key performance and risk metrics for your portfolio
                      </TooltipContent>
                    </Tooltip>
                  </div>
              </div>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-2">
                {keyMetrics.map((metric) => (
                  <div key={metric.id} className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {metric.name}
                      </span>
                  </div>
                    <div className="flex items-baseline">
                      <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {metric.value}
                      </span>
                  </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Holdings Section */}
            <div className="bg-card p-2 rounded-sm">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                  <div className="flex items-center">
                  <h3 className="text-sm font-semibold">Top Holdings</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Portfolio key positions
                      </TooltipContent>
                    </Tooltip>
                  </div>
              </div>
              
              <div className="text-xs font-medium mb-1">Top 10 Holdings</div>
              <div className="overflow-x-auto text-xs mb-3">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-1 pr-2 font-medium">Ticker</th>
                      <th className="text-left py-1 px-2 font-medium">Name</th>
                      <th className="text-right py-1 px-2 font-medium">Weight</th>
                      <th className="text-right py-1 px-2 font-medium">Active</th>
                      <th className="text-left py-1 pl-2 font-medium">Factors</th>
                    </tr>
                  </thead>
                  <tbody>
                        {topHoldings.map((holding, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 pr-2 font-medium">{holding.ticker}</td>
                            <td className="py-1 px-2">{holding.name}</td>
                            <td className="py-1 px-2 text-right">{holding.weight}</td>
                            <td className="py-1 px-2 text-right text-green-500">{holding.active}</td>
                      <td className="py-1 pl-2">
                        <div className="flex gap-1">
                                {holding.factors.map((factor, i) => (
                                  <span 
                                    key={i}
                                    className={`bg-${factor.color}-100 dark:bg-${factor.color}-900/30 text-${factor.color}-800 dark:text-${factor.color}-200 text-[9px] px-1 py-0.5 rounded-sm`}
                                  >
                                    {factor.name}
                                  </span>
                                ))}
                        </div>
                      </td>
                    </tr>
                        ))}
                      </tbody>
                  </table>
                        </div>
                        </div>
              
              {/* Similar Stocks Based on Factor Exposure */}
              <div className="bg-card p-2 rounded-sm">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                  <div className="flex items-center flex-wrap">
                    <h3 className="text-sm font-semibold">Similar Stocks Based on Factor Exposure</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        We've analyzed the factor profile of your current portfolio and found stocks that closely match your exposure to valuation, growth, quality, momentum, and risk.
                      </TooltipContent>
                    </Tooltip>
                        </div>
                        </div>

                {/* Combined Search Controls */}
                <div className="mb-4 border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="text-xs font-medium mb-2">Search Options</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className={`block text-[10px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Find stocks similar to:
                      </label>
                      <Select defaultValue="portfolio">
                        <SelectTrigger className="h-8 text-xs w-full">
                          <SelectValue placeholder="Overall Portfolio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portfolio">Overall Portfolio</SelectItem>
                          <SelectItem value="aapl">AAPL - Apple Inc.</SelectItem>
                          <SelectItem value="msft">MSFT - Microsoft</SelectItem>
                          <SelectItem value="nvda">NVDA - NVIDIA</SelectItem>
                          <SelectItem value="googl">GOOGL - Alphabet</SelectItem>
                          <SelectItem value="other">Other Holding...</SelectItem>
                        </SelectContent>
                      </Select>
              </div>
              
              <div>
                      <label className={`block text-[10px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Market Cap:
                      </label>
                      <Select defaultValue="all">
                        <SelectTrigger className="h-8 text-xs w-full">
                          <SelectValue placeholder="All Market Caps" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Market Caps</SelectItem>
                          <SelectItem value="large">Large Cap</SelectItem>
                          <SelectItem value="mid">Mid Cap</SelectItem>
                          <SelectItem value="small">Small Cap</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className={`block text-[10px] mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Sector:
                      </label>
                      <Select defaultValue="same">
                        <SelectTrigger className="h-8 text-xs w-full">
                          <SelectValue placeholder="Include Same Sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="same">Include Same Sector</SelectItem>
                          <SelectItem value="all">All Sectors</SelectItem>
                          <SelectItem value="different">Different Sectors Only</SelectItem>
                        </SelectContent>
                      </Select>
                </div>
                </div>
                  
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <Button className="h-7 ml-auto" size="sm">
                      Find Similar Stocks
                    </Button>
              </div>
            </div>
            
                {/* Similar Stocks Table */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-1 pr-2 font-medium">Ticker</th>
                        <th className="text-left py-1 px-2 font-medium">Name</th>
                        <th className="text-right py-1 px-2 font-medium">Similarity</th>
                        <th className="text-left py-1 px-2 font-medium">Sector</th>
                        <th className="text-left py-1 px-2 font-medium">Key Factor Match</th>
                        <th className="text-center py-1 pl-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                                          <tbody>
                        {similarStocks.map((stock) => (
                          <tr 
                            key={stock.ticker}
                            className={`border-b border-gray-100 dark:border-gray-800 ${comparisonStock?.ticker === stock.ticker ? 'bg-blue-50 dark:bg-blue-900/20' : ''} transition-colors duration-200`}
                          >
                            <td className="py-1 pr-2 font-medium">{stock.ticker}</td>
                            <td className="py-1 px-2">{stock.name}</td>
                            <td className="py-1 px-2 text-right">{stock.similarity}</td>
                            <td className="py-1 px-2">{stock.sector}</td>
                            <td className="py-1 px-2">{stock.keyFactorMatch}</td>
                            <td className="py-1 pl-2 text-center">
                              <Button variant="ghost" size="sm" className="h-5 w-5 p-0 mx-1">➕</Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`h-5 w-5 p-0 mx-1 ${comparisonStock?.ticker === stock.ticker ? 'bg-blue-100 dark:bg-blue-800' : ''}`} 
                                onClick={() => handleCompareStock(stock.ticker as StockTicker, stock.name)}
                              >
                                🔍
                  </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                  </table>
              </div>
              
                {/* Exposure Comparison Tool Preview */}
                <div id="stock-comparison" className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-sm transition-all duration-300">
                  <div className="text-xs font-medium mb-2">Exposure Comparison {comparisonStock ? `(${comparisonStock.ticker})` : '(Preview)'}</div>
                  
                  {!comparisonStock ? (
                    // Default preview state
                    <div className="flex items-center gap-4 transition-opacity duration-300 ease-in-out">
                      <div className="flex-shrink-0 h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">🕸️</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-xs mb-1 font-semibold">Compare Stock vs Your Portfolio</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">Click the 🔍 button in the table to see detailed factor exposure comparison between your portfolio and a specific stock.</div>
                      </div>
                    </div>
                  ) : (
                    // Comparison view when stock is selected
                    <div className="animate-in fade-in duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-semibold">{comparisonStock.name} vs Your Portfolio</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 text-xs"
                          onClick={() => setComparisonStock(null)}
                        >
                          Close
                        </Button>
              </div>
              
                      {/* Factor Exposure Comparison Chart */}
                      <div className="mb-3">
                        <ResponsiveContainer width="100%" height={160}>
                    <BarChart
                      layout="vertical"
                            margin={{ top: 0, right: 0, left: 70, bottom: 0 }}
                            data={getComparisonData(comparisonStock.ticker)}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                            <XAxis 
                              type="number" 
                              domain={[-1, 1]} 
                              tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}σ`}
                              tick={{ fontSize: 8 }}
                            />
                      <YAxis 
                              dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 9 }}
                              width={60}
                            />
                            <RechartsTooltip 
                              formatter={(value: number, name: string) => [
                                `${value > 0 ? '+' : ''}${value.toFixed(2)}σ`, 
                                name === 'portfolio' ? 'Portfolio' : comparisonStock.ticker
                              ]}
                            />
                            <Legend 
                              verticalAlign="top" 
                              height={20}
                              iconSize={7}
                              wrapperStyle={{ fontSize: 9 }}
                              formatter={(value) => value === 'portfolio' ? 'Your Portfolio' : comparisonStock.ticker} 
                            />
                            <Bar dataKey="portfolio" name="portfolio" fill="#3b82f6" barSize={8} />
                            <Bar dataKey="stock" name="stock" fill="#10b981" barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                      
                      {/* Analysis text */}
                      <div 
                        className="text-xs text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-2 border-blue-400"
                        dangerouslySetInnerHTML={{ __html: getComparisonAnalysis(comparisonStock.ticker) }}
                      />
                </div>
                  )}
              </div>
            </div>
          </div>
          </div>
      </div>
    </MainLayout>
    </TooltipProvider>
  );
}