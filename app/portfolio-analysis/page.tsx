'use client';

import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, Plus, ArrowRight, Download, 
  BarChart3, Activity, FileBarChart, Upload,
  DollarSign, Calendar, Maximize2, 
  HelpCircle, Info
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

// Simple tooltip component for info icons
function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-xs">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Tooltip label component to reuse
const TooltipLabel = ({ label, tooltip }: { label: string | React.ReactNode, tooltip: string }) => (
  <div className="flex items-center gap-1">
    {typeof label === 'string' ? <div className="text-sm font-semibold">{label}</div> : label}
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-xs">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </div>
);

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
    sparkline: [
      { value: 5 },
      { value: 10 },
      { value: 8 },
      { value: 15 },
      { value: 12 },
      { value: 18 },
      { value: 21.4 },
    ],
    color: 'green',
  },
  {
    id: '2',
    name: 'Excess Return',
    value: '+3.7%',
    sparkline: [
      { value: 0.5 },
      { value: 1.2 },
      { value: 2.1 },
      { value: 1.8 },
      { value: 2.5 },
      { value: 3.2 },
      { value: 3.7 },
    ],
    color: 'green',
  },
  {
    id: '3',
    name: 'Volatility',
    value: '16.8%',
    sparkline: [
      { value: 22 },
      { value: 19 },
      { value: 20 },
      { value: 18 },
      { value: 17.5 },
      { value: 17 },
      { value: 16.8 },
    ],
    color: 'amber',
  },
  {
    id: '4',
    name: 'Tracking Error',
    value: '3.2%',
    sparkline: [
      { value: 2.1 },
      { value: 2.3 },
      { value: 2.5 },
      { value: 2.8 },
      { value: 3.0 },
      { value: 3.1 },
      { value: 3.2 },
    ],
    color: 'amber',
  },
  {
    id: '5',
    name: 'Sharpe Ratio',
    value: '1.25',
    sparkline: [
      { value: 0.85 },
      { value: 0.9 },
      { value: 1.05 },
      { value: 1.12 },
      { value: 1.18 },
      { value: 1.22 },
      { value: 1.25 },
    ],
    color: 'green',
  },
  {
    id: '6',
    name: 'Max Drawdown',
    value: '-8.7%',
    sparkline: [
      { value: -12 },
      { value: -10.5 },
      { value: -11 },
      { value: -9.5 },
      { value: -9.2 },
      { value: -8.9 },
      { value: -8.7 },
    ],
    color: 'green',
  },
  {
    id: '7',
    name: 'VaR (95%)',
    value: '2.4%',
    sparkline: [
      { value: 3.1 },
      { value: 2.9 },
      { value: 2.8 },
      { value: 2.7 },
      { value: 2.6 },
      { value: 2.5 },
      { value: 2.4 },
    ],
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
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [comparisonStock, setComparisonStock] = useState<{ ticker: string, name: string } | null>(null);
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

  // Handle comparison stock selection
  const handleCompareStock = (ticker: string, name: string) => {
    setComparisonStock({ ticker, name });
    // Smooth scroll to comparison section
    document.getElementById('stock-comparison')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <MainLayout>
      <TooltipProvider>
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
                  <TooltipLabel 
                    label="Performance Attribution"
                    tooltip="How did we perform?"
                  />
                </div>
                
                {/* Factor Attribution Chart */}
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">Performance Attribution</h3>
                    <InfoTooltip text="How did we perform?" />
                  </div>
                </div>
                
                {/* Factor Attribution Chart */}
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="text-xs font-medium">Factor Attribution Analysis</div>
                    <InfoTooltip text="Shows how each factor contributed to portfolio performance through allocation, selection, and interaction effects." />
                  </div>
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
                  {/* Factor Exposure Snapshot - With Profile on left side */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Portfolio Factor Profile on the left */}
                    <div>
                      <div className="text-xs font-medium mb-2">Portfolio Factor Profile</div>
                      <table className="w-full text-xs">
                        <tbody>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 font-medium">Value</td>
                            <td className="py-1 text-right">Medium-High</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 font-medium">Growth</td>
                            <td className="py-1 text-right">Low</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 font-medium">Quality</td>
                            <td className="py-1 text-right">High</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 font-medium">Momentum</td>
                            <td className="py-1 text-right">High</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1 font-medium">Volatility</td>
                            <td className="py-1 text-right">Low</td>
                          </tr>
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
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">Scenario Analysis & Stress Testing</h3>
                    <InfoTooltip text="How would the portfolio perform in different scenarios?" />
                  </div>
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
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1 pr-2 font-medium">COVID Crash</td>
                          <td className="py-1 px-2 text-right text-red-500">-18.7%</td>
                          <td className="py-1 px-2 text-right">+85%</td>
                          <td className="py-1 px-2">
                            <div className="flex gap-1">
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-[9px] px-1 py-0.5 rounded-sm">Momentum</span>
                              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-[9px] px-1 py-0.5 rounded-sm">Volatility</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1 pr-2 font-medium">GFC</td>
                          <td className="py-1 px-2 text-right text-red-500">-24.3%</td>
                          <td className="py-1 px-2 text-right">+120%</td>
                          <td className="py-1 px-2">
                            <div className="flex gap-1">
                              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-[9px] px-1 py-0.5 rounded-sm">Beta</span>
                              <span className="bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-200 text-[9px] px-1 py-0.5 rounded-sm">Credit Spread</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1 pr-2 font-medium">Fed Rate Shock</td>
                          <td className="py-1 px-2 text-right text-red-500">-8.5%</td>
                          <td className="py-1 px-2 text-right">+45%</td>
                          <td className="py-1 px-2">
                            <div className="flex gap-1">
                              <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 text-[9px] px-1 py-0.5 rounded-sm">Interest Rates</span>
                              <span className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 text-[9px] px-1 py-0.5 rounded-sm">USD</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-1 pr-2 font-medium">Oil Spike</td>
                          <td className="py-1 px-2 text-right text-red-500">-5.2%</td>
                          <td className="py-1 px-2 text-right">+30%</td>
                          <td className="py-1 px-2">
                            <div className="flex gap-1">
                              <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-[9px] px-1 py-0.5 rounded-sm">Energy</span>
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-[9px] px-1 py-0.5 rounded-sm">Inflation</span>
                            </div>
                          </td>
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
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">Portfolio Return & Risk Snapshot</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">Key performance and risk metrics for your portfolio.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">Top Holdings</h3>
                    <InfoTooltip text="Portfolio key positions" />
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
                        <td className="py-1 px-2 text-right">6.8%</td>
                        <td className="py-1 px-2 text-right text-green-500">+1.5%</td>
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
              
              {/* Similar Stocks Based on Factor Exposure */}
              <div className="bg-card p-2 rounded-sm">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">Similar Stocks Based on Factor Exposure</h3>
                    <InfoTooltip text="We've analyzed the factor profile of your current portfolio and found stocks that closely match your exposure to value, growth, quality, momentum, and volatility." />
                  </div>
                </div>

                {/* Combined Search Controls */}
                <div className="mb-4 border-t border-gray-200 dark:border-gray-700 pt-2">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="text-xs font-medium">Search Options</div>
                    <InfoTooltip text="Configure criteria to find stocks that match your desired factor profile." />
                  </div>
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
                      <tr className={`border-b border-gray-100 dark:border-gray-800 ${comparisonStock?.ticker === 'TXN' ? 'bg-blue-50 dark:bg-blue-900/20' : ''} transition-colors duration-200`}>
                        <td className="py-1 pr-2 font-medium">TXN</td>
                        <td className="py-1 px-2">Texas Instruments</td>
                        <td className="py-1 px-2 text-right">97%</td>
                        <td className="py-1 px-2">Tech</td>
                        <td className="py-1 px-2">High Quality, Low Vol</td>
                        <td className="py-1 pl-2 text-center">
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 mx-1">➕</Button>
                          <Button variant="ghost" size="sm" className={`h-5 w-5 p-0 mx-1 ${comparisonStock?.ticker === 'TXN' ? 'bg-blue-100 dark:bg-blue-800' : ''}`} onClick={() => handleCompareStock('TXN', 'Texas Instruments')}>🔍</Button>
                        </td>
                      </tr>
                      <tr className={`border-b border-gray-100 dark:border-gray-800 ${comparisonStock?.ticker === 'ROP' ? 'bg-blue-50 dark:bg-blue-900/20' : ''} transition-colors duration-200`}>
                        <td className="py-1 pr-2 font-medium">ROP</td>
                        <td className="py-1 px-2">Roper Technologies</td>
                        <td className="py-1 px-2 text-right">95%</td>
                        <td className="py-1 px-2">Industrials</td>
                        <td className="py-1 px-2">Quality, Momentum</td>
                        <td className="py-1 pl-2 text-center">
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 mx-1">➕</Button>
                          <Button variant="ghost" size="sm" className={`h-5 w-5 p-0 mx-1 ${comparisonStock?.ticker === 'ROP' ? 'bg-blue-100 dark:bg-blue-800' : ''}`} onClick={() => handleCompareStock('ROP', 'Roper Technologies')}>🔍</Button>
                        </td>
                      </tr>
                      <tr className={`border-b border-gray-100 dark:border-gray-800 ${comparisonStock?.ticker === 'ADI' ? 'bg-blue-50 dark:bg-blue-900/20' : ''} transition-colors duration-200`}>
                        <td className="py-1 pr-2 font-medium">ADI</td>
                        <td className="py-1 px-2">Analog Devices</td>
                        <td className="py-1 px-2 text-right">94%</td>
                        <td className="py-1 px-2">Tech</td>
                        <td className="py-1 px-2">Value, Low Volatility</td>
                        <td className="py-1 pl-2 text-center">
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 mx-1">➕</Button>
                          <Button variant="ghost" size="sm" className={`h-5 w-5 p-0 mx-1 ${comparisonStock?.ticker === 'ADI' ? 'bg-blue-100 dark:bg-blue-800' : ''}`} onClick={() => handleCompareStock('ADI', 'Analog Devices')}>🔍</Button>
                        </td>
                      </tr>
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
                            data={[
                              { 
                                name: 'Quality', 
                                portfolio: 0.6, 
                                stock: comparisonStock.ticker === 'TXN' ? 0.8 : 
                                      comparisonStock.ticker === 'ROP' ? 0.75 : 0.4
                              },
                              { 
                                name: 'Value', 
                                portfolio: -0.4, 
                                stock: comparisonStock.ticker === 'TXN' ? -0.3 : 
                                       comparisonStock.ticker === 'ROP' ? -0.5 : 0.6
                              },
                              { 
                                name: 'Momentum', 
                                portfolio: 0.85, 
                                stock: comparisonStock.ticker === 'TXN' ? 0.4 : 
                                       comparisonStock.ticker === 'ROP' ? 0.9 : 0.3
                              },
                              { 
                                name: 'Low Vol', 
                                portfolio: -0.25, 
                                stock: comparisonStock.ticker === 'TXN' ? 0.7 : 
                                       comparisonStock.ticker === 'ROP' ? 0.2 : 0.8
                              },
                              { 
                                name: 'Growth', 
                                portfolio: 0.15, 
                                stock: comparisonStock.ticker === 'TXN' ? 0.1 : 
                                       comparisonStock.ticker === 'ROP' ? 0.4 : -0.2
                              },
                            ]}
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
                      <div className="text-xs text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border-l-2 border-blue-400">
                        {comparisonStock.ticker === 'TXN' && (
                          <>
                            <span className="font-medium">TXN</span> has stronger <span className="font-medium">Quality</span> and <span className="font-medium">Low Volatility</span> exposure than your portfolio, but weaker <span className="font-medium">Momentum</span> exposure. Consider adding this stock to increase your quality factor exposure.
                          </>
                        )}
                        {comparisonStock.ticker === 'ROP' && (
                          <>
                            <span className="font-medium">ROP</span> has very similar <span className="font-medium">Momentum</span> and <span className="font-medium">Quality</span> exposure to your overall portfolio. Adding this stock would maintain your current factor tilt.
                          </>
                        )}
                        {comparisonStock.ticker === 'ADI' && (
                          <>
                            <span className="font-medium">ADI</span> offers significantly more <span className="font-medium">Value</span> and <span className="font-medium">Low Volatility</span> exposure than your portfolio. Consider adding this stock to diversify your factor exposures.
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </MainLayout>
  );
}