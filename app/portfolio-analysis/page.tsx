'use client';

import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, Plus, ArrowRight, Download, 
  BarChart3, Activity, FileBarChart, Upload,
  TrendingUp, Percent, DollarSign, Calendar,
  AlertTriangle, ArrowUpRight, BarChart as LucideBarChart, TrendingDown, Maximize2
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

// Mock data for portfolio selector
const portfolios = [
  { id: '1', name: 'Technology Leaders' },
  { id: '2', name: 'Dividend Kings' },
  { id: '3', name: 'Green Energy' },
  { id: '4', name: 'Financial Sector' },
];

// Mock data for benchmarks
const benchmarks = [
  { id: '1', name: 'S&P 500' },
  { id: '2', name: 'Russell 2000' },
  { id: '3', name: 'NASDAQ Composite' },
  { id: '4', name: 'MSCI World Index' },
];

// Mock data for time periods
const timePeriods = [
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: 'ytd', label: 'Year to Date' },
  { value: '1y', label: '1 Year' },
  { value: '3y', label: '3 Years' },
  { value: '5y', label: '5 Years' },
];

// Mock data for key metrics with sparklines
const keyMetrics = [
  {
    id: '1',
    name: 'Total Return',
    value: '21.4%',
    trend: 'up',
    sparkline: [
      { value: 5 },
      { value: 10 },
      { value: 8 },
      { value: 15 },
      { value: 12 },
      { value: 18 },
      { value: 21.4 },
    ],
    icon: <TrendingUp size={18} />,
    color: 'green',
  },
  {
    id: '2',
    name: 'Excess Return',
    value: '+3.7%',
    trend: 'up',
    sparkline: [
      { value: 0.5 },
      { value: 1.2 },
      { value: 2.1 },
      { value: 1.8 },
      { value: 2.5 },
      { value: 3.2 },
      { value: 3.7 },
    ],
    icon: <ArrowUpRight size={18} />,
    color: 'green',
  },
  {
    id: '3',
    name: 'Volatility',
    value: '16.8%',
    trend: 'down',
    sparkline: [
      { value: 22 },
      { value: 19 },
      { value: 20 },
      { value: 18 },
      { value: 17.5 },
      { value: 17 },
      { value: 16.8 },
    ],
    icon: <Activity size={18} />,
    color: 'amber',
  },
  {
    id: '4',
    name: 'Tracking Error',
    value: '3.2%',
    trend: 'up',
    sparkline: [
      { value: 2.1 },
      { value: 2.3 },
      { value: 2.5 },
      { value: 2.8 },
      { value: 3.0 },
      { value: 3.1 },
      { value: 3.2 },
    ],
    icon: <Percent size={18} />,
    color: 'amber',
  },
  {
    id: '5',
    name: 'Sharpe Ratio',
    value: '1.25',
    trend: 'up',
    sparkline: [
      { value: 0.85 },
      { value: 0.9 },
      { value: 1.05 },
      { value: 1.12 },
      { value: 1.18 },
      { value: 1.22 },
      { value: 1.25 },
    ],
    icon: <LucideBarChart size={18} />,
    color: 'green',
  },
  {
    id: '6',
    name: 'Max Drawdown',
    value: '-8.7%',
    trend: 'down',
    sparkline: [
      { value: -12 },
      { value: -10.5 },
      { value: -11 },
      { value: -9.5 },
      { value: -9.2 },
      { value: -8.9 },
      { value: -8.7 },
    ],
    icon: <TrendingDown size={18} />,
    color: 'green',
  },
  {
    id: '7',
    name: 'VaR (95%)',
    value: '2.4%',
    trend: 'down',
    sparkline: [
      { value: 3.1 },
      { value: 2.9 },
      { value: 2.8 },
      { value: 2.7 },
      { value: 2.6 },
      { value: 2.5 },
      { value: 2.4 },
    ],
    icon: <AlertTriangle size={18} />,
    color: 'green',
  },
];

// Mock currency options
const currencyOptions = [
  { value: 'base', label: 'Base Currency' },
  { value: 'hedged', label: 'Hedged' },
];

export default function PortfolioAnalysisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolios[0].id);
  const [selectedBenchmark, setSelectedBenchmark] = useState(benchmarks[0].id);
  const [timePeriod, setTimePeriod] = useState('ytd');
  const [currencyView, setCurrencyView] = useState('base');
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Portfolio upload state
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [tickers, setTickers] = useState('');
  const [weights, setWeights] = useState('');
  const [weightType, setWeightType] = useState('equal');
  const [uploadError, setUploadError] = useState('');
  
  // Colors for charts
  const COLORS = isDark ? 
    ['#4ade80', '#60a5fa', '#f97316', '#a78bfa', '#f43f5e', '#facc15', '#94a3b8'] : 
    ['#22c55e', '#3b82f6', '#ea580c', '#8b5cf6', '#e11d48', '#eab308', '#64748b'];
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Handle portfolio upload
  const handlePortfolioUpload = () => {
    // Basic validation
    if (!portfolioName.trim()) {
      setUploadError('Please enter a portfolio name');
      return;
    }
    
    if (!tickers.trim()) {
      setUploadError('Please enter ticker symbols');
      return;
    }
    
    if (weightType === 'custom' && !weights.trim()) {
      setUploadError('Please enter weights for custom weighting');
      return;
    }
    
    // Parse tickers
    const tickerList = tickers.split(/[,\t\n]/).map(t => t.trim()).filter(t => t);
    
    // For custom weights, validate weights match tickers count
    if (weightType === 'custom') {
      const weightList = weights.split(/[,\t\n]/).map(w => w.trim()).filter(w => w);
      if (weightList.length !== tickerList.length) {
        setUploadError(`Number of weights (${weightList.length}) doesn't match number of tickers (${tickerList.length})`);
        return;
      }
      
      // Validate weights are valid numbers
      const areAllWeightsValid = weightList.every(w => !isNaN(parseFloat(w)));
      if (!areAllWeightsValid) {
        setUploadError('All weights must be valid numbers');
        return;
      }
    }
    
    // TODO: In a real app, we would send this data to the backend
    console.log('Uploading portfolio:', {
      name: portfolioName,
      tickers: tickerList,
      weightType,
      weights: weightType === 'custom' ? weights.split(/[,\t\n]/).map(w => parseFloat(w.trim())).filter(w => !isNaN(w)) : []
    });
    
    // Add the new portfolio to the list (in a real app, this would come from the backend)
    const newPortfolio = {
      id: (portfolios.length + 1).toString(),
      name: portfolioName
    };
    
    // Clear form and close dialog
    setPortfolioName('');
    setTickers('');
    setWeights('');
    setWeightType('equal');
    setUploadError('');
    setIsUploadDialogOpen(false);
    
    // In a real application, we would refresh the portfolio list from the backend
    // and select the newly created portfolio
    setSelectedPortfolio(newPortfolio.id);
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
  
  return (
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
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      <Upload className="h-3 w-3 mr-1" />
                      Upload Portfolio
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Portfolio</DialogTitle>
                      <DialogDescription>
                        Upload your portfolio data in CSV or Excel format.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">File Type</Label>
                        <RadioGroup defaultValue="csv" className="col-span-3 flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="csv" id="csv" />
                            <Label htmlFor="csv">CSV</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="excel" id="excel" />
                            <Label htmlFor="excel">Excel</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Template</Label>
                        <Select defaultValue="standard">
                          <SelectTrigger className="col-span-3 h-8">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Format</SelectItem>
                            <SelectItem value="bloomberg">Bloomberg Export</SelectItem>
                            <SelectItem value="factset">FactSet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <div className="col-span-3">
                          <input
                            className="w-full h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
                            placeholder="Enter portfolio name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Notes</Label>
                        <Textarea className="col-span-3 h-20" placeholder="Add any additional notes..." />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handlePortfolioUpload}>
                        Upload & Process
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                <div className="col-span-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Portfolio
                    </label>
                  </div>
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
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col">
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
        
                <div className="flex flex-col">
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
              
              {/* Run Analysis Button */}
              <div className="mt-3 flex justify-end">
                <Button className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Run Analysis
                </Button>
              </div>
            </div>
            
            {/* Performance Attribution Section */}
            <div className="bg-card p-2 rounded-sm">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                <div>
                  <h3 className="text-sm font-semibold">Performance Attribution</h3>
                  <p className="text-xs text-muted-foreground">How did we perform?</p>
                </div>
              </div>
              
              {/* Factor Attribution Chart */}
              <div className="mb-2">
                <div className="text-xs font-medium mb-1">Factor Attribution Analysis</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Quality', allocation: 45, selection: -20, interaction: 8 },
                      { name: 'Value', allocation: -32, selection: 15, interaction: -5 },
                      { name: 'Momentum', allocation: 58, selection: 62, interaction: 10 },
                      { name: 'Low Vol', allocation: -18, selection: -12, interaction: -4 },
                      { name: 'Size', allocation: 25, selection: -38, interaction: -7 },
                      { name: 'Growth', allocation: 12, selection: 35, interaction: 5 },
                    ]}
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
                {/* Factor Exposure Snapshot */}
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
                      data={[
                        { name: 'Quality', exposure: 0.6 },
                        { name: 'Value', exposure: -0.4 },
                        { name: 'Momentum', exposure: 0.85 },
                        { name: 'Low Vol', exposure: -0.25 },
                        { name: 'Size', exposure: 0.3 },
                        { name: 'Growth', exposure: 0.15 },
                      ]}
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
                        {[
                          { name: 'Quality', exposure: 0.6 },
                          { name: 'Value', exposure: -0.4 },
                          { name: 'Momentum', exposure: 0.85 },
                          { name: 'Low Vol', exposure: -0.25 },
                          { name: 'Size', exposure: 0.3 },
                          { name: 'Growth', exposure: 0.15 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.exposure > 0 ? '#3b82f6' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
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
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">Quality</td>
                        <td className="py-1 px-2 text-right">+4.2%</td>
                        <td className="py-1 px-2 text-right text-blue-500">+0.6σ</td>
                        <td className="py-1 pl-2 text-right">+33bp</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">Value</td>
                        <td className="py-1 px-2 text-right">-1.8%</td>
                        <td className="py-1 px-2 text-right text-red-500">-0.4σ</td>
                        <td className="py-1 pl-2 text-right">-12bp</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">Momentum</td>
                        <td className="py-1 px-2 text-right">+7.5%</td>
                        <td className="py-1 px-2 text-right text-blue-500">+0.85σ</td>
                        <td className="py-1 pl-2 text-right">+130bp</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">Low Vol</td>
                        <td className="py-1 px-2 text-right">+2.1%</td>
                        <td className="py-1 px-2 text-right text-red-500">-0.25σ</td>
                        <td className="py-1 pl-2 text-right">-34bp</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              

            </div>
            
            {/* Scenario Analysis Section */}
            <div className="bg-card p-2 rounded-sm">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                <h3 className="text-sm font-semibold">Scenario Analysis & Stress Testing</h3>
                <p className="text-xs text-muted-foreground">How would the portfolio perform in different scenarios?</p>
              </div>
              
              {/* Predefined Scenarios */}
              <div className="mb-2">
                <div className="text-xs font-medium mb-1">Predefined Scenarios</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {['COVID Crash', 'GFC', 'Fed Rate Shock', 'Oil Spike', 'USD Rally'].map((scenario, index) => (
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
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-1 pr-2 font-medium">Scenario</th>
                        <th className="text-right py-1 px-2 font-medium">Return</th>
                        <th className="text-left py-1 px-2 font-medium">Top Factors</th>
                        <th className="text-right py-1 pl-2 font-medium">VaR Shift</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">COVID Crash</td>
                        <td className="py-1 px-2 text-right text-red-500">-18.7%</td>
                        <td className="py-1 px-2">Momentum, Volatility</td>
                        <td className="py-1 pl-2 text-right">+85%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">GFC</td>
                        <td className="py-1 px-2 text-right text-red-500">-24.3%</td>
                        <td className="py-1 px-2">Beta, Credit Spread</td>
                        <td className="py-1 pl-2 text-right">+120%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">Fed Rate Shock</td>
                        <td className="py-1 px-2 text-right text-red-500">-8.5%</td>
                        <td className="py-1 px-2">Interest Rates, USD</td>
                        <td className="py-1 pl-2 text-right">+45%</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-1 pr-2 font-medium">Oil Spike</td>
                        <td className="py-1 px-2 text-right text-red-500">-5.2%</td>
                        <td className="py-1 px-2">Energy, Inflation</td>
                        <td className="py-1 pl-2 text-right">+30%</td>
                      </tr>
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
                        <SelectItem value="value">Value</SelectItem>
                        <SelectItem value="rates">Interest Rates</SelectItem>
                        <SelectItem value="usd">USD</SelectItem>
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
                    also positively contributed, while your underweight to Value (-0.4σ) detracted slightly during 
                    this period. Consider reducing exposure to Low Volatility stocks which underperformed.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Portfolio Return & Risk Snapshot */}
            <div className="bg-card p-2 rounded-sm">
              <div className="border-b border-gray-200 dark:border-gray-700 mb-2 pb-1">
                <h3 className="text-sm font-semibold">Portfolio Return & Risk Snapshot</h3>
              </div>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-2">
                {keyMetrics.map((metric) => (
                  <div key={metric.id} className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {metric.name}
                      </span>
                      <span className={`
                        ${metric.trend === 'up' && metric.color === 'green' ? 'text-green-500' : ''}
                        ${metric.trend === 'down' && metric.color === 'green' ? 'text-green-500' : ''}
                        ${metric.trend === 'up' && metric.color === 'amber' ? 'text-amber-500' : ''}
                        ${metric.trend === 'down' && metric.color === 'amber' ? 'text-amber-500' : ''}
                        ${metric.trend === 'up' && metric.color === 'red' ? 'text-red-500' : ''}
                        ${metric.trend === 'down' && metric.color === 'red' ? 'text-red-500' : ''}
                      `}>
                        {metric.icon}
                      </span>
                  </div>
                    <div className="flex items-baseline">
                      <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {metric.value}
                      </span>
                      <span className={`ml-1 text-xs
                        ${metric.trend === 'up' && metric.color === 'green' ? 'text-green-500' : ''}
                        ${metric.trend === 'down' && metric.color === 'green' ? 'text-green-500' : ''}
                        ${metric.trend === 'up' && metric.color === 'amber' ? 'text-amber-500' : ''}
                        ${metric.trend === 'down' && metric.color === 'amber' ? 'text-amber-500' : ''}
                        ${metric.trend === 'up' && metric.color === 'red' ? 'text-red-500' : ''}
                        ${metric.trend === 'down' && metric.color === 'red' ? 'text-red-500' : ''}
                      `}>
                        {metric.trend === 'up' ? '↑' : '↓'}
                      </span>
                  </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Top Holdings Section */}
            <div className="bg-card p-2 rounded-sm">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                <div>
                  <h3 className="text-sm font-semibold">Top Holdings</h3>
                  <p className="text-xs text-muted-foreground">Portfolio key positions</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                  </Button>
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
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1 pr-2 font-medium">AAPL</td>
                      <td className="py-1 px-2">Apple Inc</td>
                      <td className="py-1 px-2 text-right">7.2%</td>
                      <td className="py-1 px-2 text-right text-green-500">+2.1%</td>
                      <td className="py-1 pl-2">
                        <div className="flex gap-1">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-[9px] px-1 py-0.5 rounded-sm">Quality</span>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-[9px] px-1 py-0.5 rounded-sm">Momentum</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1 pr-2 font-medium">MSFT</td>
                      <td className="py-1 px-2">Microsoft</td>
                      <td className="py-1 px-2 text-right">6.5%</td>
                      <td className="py-1 px-2 text-right text-green-500">+1.8%</td>
                      <td className="py-1 pl-2">
                        <div className="flex gap-1">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-[9px] px-1 py-0.5 rounded-sm">Quality</span>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-[9px] px-1 py-0.5 rounded-sm">Momentum</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1 pr-2 font-medium">AMZN</td>
                      <td className="py-1 px-2">Amazon</td>
                      <td className="py-1 px-2 text-right">4.8%</td>
                      <td className="py-1 px-2 text-right text-green-500">+1.3%</td>
                      <td className="py-1 pl-2">
                        <div className="flex gap-1">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-[9px] px-1 py-0.5 rounded-sm">Momentum</span>
                          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-[9px] px-1 py-0.5 rounded-sm">Size</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1 pr-2 font-medium">NVDA</td>
                      <td className="py-1 px-2">NVIDIA</td>
                      <td className="py-1 px-2 text-right">4.2%</td>
                      <td className="py-1 px-2 text-right text-green-500">+2.7%</td>
                      <td className="py-1 pl-2">
                        <div className="flex gap-1">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-[9px] px-1 py-0.5 rounded-sm">Momentum</span>
                          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-[9px] px-1 py-0.5 rounded-sm">Volatility</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-1 pr-2 font-medium">GOOGL</td>
                      <td className="py-1 px-2">Alphabet</td>
                      <td className="py-1 px-2 text-right">3.7%</td>
                      <td className="py-1 px-2 text-right text-green-500">+0.8%</td>
                      <td className="py-1 pl-2">
                        <div className="flex gap-1">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-[9px] px-1 py-0.5 rounded-sm">Quality</span>
                          <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-[9px] px-1 py-0.5 rounded-sm">Value</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Holding Style Summary - More compact */}
              <div>
                <div className="text-xs font-medium mb-1 border-t border-gray-200 dark:border-gray-700 pt-2">Holding Style Summary</div>
                <div className="relative h-[140px] w-full border border-gray-100 dark:border-gray-800 rounded-sm overflow-hidden bg-gray-50/50 dark:bg-gray-900/30">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 dark:text-gray-400 ml-1">Value</div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 dark:text-gray-400 mr-1">Growth</div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400 mt-1">Large Cap</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 dark:text-gray-400 mb-1">Small Cap</div>
                  
                  {/* Mock portfolio dots */}
                  <div className="absolute h-3 w-3 rounded-full bg-blue-500 opacity-80" style={{ left: '65%', top: '30%' }}></div>
                  <div className="absolute h-2 w-2 rounded-full bg-blue-500 opacity-70" style={{ left: '70%', top: '25%' }}></div>
                  <div className="absolute h-2 w-2 rounded-full bg-blue-500 opacity-70" style={{ left: '72%', top: '40%' }}></div>
                  <div className="absolute h-2 w-2 rounded-full bg-blue-500 opacity-60" style={{ left: '55%', top: '45%' }}></div>
                  <div className="absolute h-1.5 w-1.5 rounded-full bg-blue-500 opacity-60" style={{ left: '60%', top: '55%' }}></div>
                  
                  {/* Benchmark area */}
                  <div className="absolute h-16 w-16 rounded-full border-2 border-dashed border-gray-400 opacity-40" style={{ left: '55%', top: '35%', transform: 'translate(-50%, -50%)' }}></div>
                </div>
                <div className="flex justify-center mt-1 text-[9px] text-gray-500 dark:text-gray-400">
                  <span className="flex items-center mr-3">
                    <span className="h-2 w-2 rounded-full bg-blue-500 opacity-80 mr-1"></span>
                    Portfolio Holdings
                  </span>
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full border border-dashed border-gray-400 mr-1"></span>
                    Benchmark
                  </span>
                </div>
              </div>
            </div>
            
            {/* Risk-Adjusted Performance Metrics */}
            <div className="bg-card p-2 rounded-sm">
              <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                <div>
                  <h3 className="text-sm font-semibold">Risk-Adjusted Performance Metrics</h3>
                  <p className="text-xs text-muted-foreground">How efficiently is risk being used?</p>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <Activity className="h-3 w-3 mr-1" />
                  Historical
                  </Button>
              </div>
              
              {/* Metric Cards with Mini-Charts - More compact */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[
                  { 
                    name: 'Sharpe Ratio', 
                    value: '1.25', 
                    trend: 'up', 
                    trendValue: '+0.12', 
                    comment: 'In top quartile of peers',
                    chartData: [0.85, 0.9, 1.05, 1.12, 1.18, 1.22, 1.25]
                  },
                  { 
                    name: 'Information Ratio', 
                    value: '0.65', 
                    trend: 'neutral', 
                    trendValue: '+0.02', 
                    comment: 'Driven by strong selection',
                    chartData: [0.58, 0.62, 0.65, 0.64, 0.63, 0.64, 0.65] 
                  },
                  { 
                    name: 'Max Drawdown', 
                    value: '-8.7%', 
                    trend: 'down', 
                    trendValue: '-0.8%', 
                    comment: 'From tech exposure',
                    chartData: [-12, -10.5, -11, -9.5, -9.2, -8.9, -8.7] 
                  },
                  { 
                    name: 'Active Risk', 
                    value: '3.2%', 
                    trend: 'up', 
                    trendValue: '+0.3%', 
                    comment: 'Factor bets rising',
                    chartData: [2.1, 2.3, 2.5, 2.8, 3.0, 3.1, 3.2] 
                  },
                ].map((metric, index) => (
                  <div key={index} className={`relative overflow-hidden p-2 border-l-2 rounded-sm bg-gray-50 dark:bg-gray-900/30
                    ${metric.trend === 'up' ? 'border-green-400 dark:border-green-600' : 
                    metric.trend === 'down' ? 'border-red-400 dark:border-red-600' : 
                    'border-gray-300 dark:border-gray-600'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-medium">{metric.name}</div>
                        <div className="text-lg font-bold mt-0.5">{metric.value}</div>
                      </div>
                      <div className={`
                        text-[10px] px-1 py-0.5 rounded-sm
                        ${metric.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 
                          metric.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}
                      `}>
                        {metric.trendValue} {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                      </div>
                    </div>
                    <div className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">{metric.comment}</div>
                    <div className="h-[25px] mt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={metric.chartData.map((value, i) => ({ value }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <Line 
                            type="monotone" 
                            dataKey="value"
                            stroke={
                              metric.trend === 'up' ? '#4ade80' : 
                              metric.trend === 'down' ? '#f43f5e' : 
                              '#94a3b8'
                            } 
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                </div>
                ))}
              </div>
              
              {/* Risk-Return Scatterplot - More compact */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="text-xs font-medium mb-1">Risk-Return Scatterplot (vs Peers)</div>
                <div className="h-[140px] w-full">
                  <ResponsiveContainer width="100%" height="200%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { category: 'Risk-Adjusted Return', portfolio: 0.78, peer25: 0.45, peer50: 0.6, peer75: 0.7, benchmark: 0.65 },
                        { category: 'Upside Capture', portfolio: 1.12, peer25: 0.85, peer50: 0.92, peer75: 1.05, benchmark: 1.0 },
                        { category: 'Downside Capture', portfolio: 0.88, peer25: 1.15, peer50: 1.05, peer75: 0.95, benchmark: 1.0 },
                      ]}
                      margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? '#374151' : '#f3f4f6'} />
                      <XAxis type="number" tick={{ fontSize: 8 }} stroke={isDark ? '#6b7280' : '#9ca3af'} />
                      <YAxis 
                        dataKey="category" 
                        type="category" 
                        tick={{ fontSize: 9 }}
                        width={100}
                        stroke={isDark ? '#6b7280' : '#9ca3af'}
                      />
                      <RechartsTooltip />
                      <Legend align="right" verticalAlign="top" height={18} iconSize={7} wrapperStyle={{ fontSize: 8 }} />
                      <Bar dataKey="peer25" fill="#d1d5db" name="25th" barSize={5} />
                      <Bar dataKey="peer50" fill="#9ca3af" name="Median" barSize={5} />
                      <Bar dataKey="peer75" fill="#6b7280" name="75th" barSize={5} />
                      <Bar dataKey="benchmark" fill="#94a3b8" name="Benchmark" barSize={5} />
                      <Bar dataKey="portfolio" fill="#3b82f6" name="Portfolio" barSize={5} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                </div>
              </div>
            </div>
          </div>
          

      </div>
    </MainLayout>
  );
}