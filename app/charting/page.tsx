'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/app/components/layout/MainLayout';
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChartType = 'line' | 'bar';
type TimeInterval = 'Annual' | 'TTM';
type ViewMode = 'single' | 'multi';
type MetricType = 'equity' | 'macro';

// Mock data structure
type DataPoint = {
  date: string;
  [key: string]: string | number;
};

const mockMetrics = [
  'Revenue 3Y CAGR',
  'EPS Growth',
  'EBITDA Margin',
  'Operating Margin',
  'Net Margin',
  'ROE',
  'ROIC'
];

const mockMacroMetrics = [
  '10Y Treasury Yield',
  'Inflation Rate',
  'Unemployment Rate',
  'GDP Growth',
  'Fed Funds Rate',
  'Consumer Confidence',
  'ISM Manufacturing'
];

const mockCompanies = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' }
];

// Generate mock data
const generateMockData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  const startYear = 2015;
  const endYear = 2025;

  for (let year = startYear; year <= endYear; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const dataPoint: DataPoint = {
        date: `Q${quarter} '${year.toString().slice(-2)}`,
      };
      mockCompanies.forEach(company => {
        dataPoint[company.symbol] = Math.random() * 50 + 10; // Random value between 10 and 60
      });
      data.push(dataPoint);
    }
  }
  return data;
};

export default function ChartingPage() {
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['NVDA', 'MSFT']);
  const [selectedMetric, setSelectedMetric] = useState('Revenue 3Y CAGR');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('Annual');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [showAverage, setShowAverage] = useState(true);
  const [searchCompany, setSearchCompany] = useState('');
  const [searchMetric, setSearchMetric] = useState('');
  const [metricType, setMetricType] = useState<MetricType>('equity');
  const [searchMacroMetric, setSearchMacroMetric] = useState('');
  const [selectedMacroMetrics, setSelectedMacroMetrics] = useState<string[]>(['10Y Treasury Yield']);

  const data = generateMockData();

  // Calculate average for selected companies
  const calculateAverage = (data: DataPoint[]): number => {
    let sum = 0;
    let count = 0;
    data.forEach(point => {
      selectedCompanies.forEach(company => {
        if (typeof point[company] === 'number') {
          sum += point[company] as number;
          count++;
        }
      });
    });
    return count > 0 ? sum / count : 0;
  };

  const average = calculateAverage(data);

  const filteredCompanies = mockCompanies.filter(company =>
    company.symbol.toLowerCase().includes(searchCompany.toLowerCase()) ||
    company.name.toLowerCase().includes(searchCompany.toLowerCase())
  );

  const filteredMetrics = mockMetrics.filter(metric =>
    metric.toLowerCase().includes(searchMetric.toLowerCase())
  );

  const filteredMacroMetrics = mockMacroMetrics.filter(metric =>
    metric.toLowerCase().includes(searchMacroMetric.toLowerCase())
  );

  const handleCompanySelect = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(prev => prev.filter(c => c !== company));
    } else {
      setSelectedCompanies(prev => [...prev, company]);
    }
  };

  const handleRemoveCompany = (company: string) => {
    setSelectedCompanies(prev => prev.filter(c => c !== company));
  };

  const handleMetricSelect = (metric: string) => {
    setSelectedMetric(metric);
  };

  const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCompany(e.target.value);
  };

  const handleMetricSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMetric(e.target.value);
  };

  const handleMacroMetricSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMacroMetric(e.target.value);
  };

  const handleMacroMetricSelect = (metric: string) => {
    if (!selectedMacroMetrics.includes(metric)) {
      setSelectedMacroMetrics(prev => [...prev, metric]);
    }
    setSelectedMetric(metric); // Use the same state for chart display
  };
  
  const handleRemoveMacroMetric = (metric: string) => {
    setSelectedMacroMetrics(prev => prev.filter(m => m !== metric));
  };

  // Generate mock macro data
  const generateMockMacroData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    const startYear = 2015;
    const endYear = 2025;

    for (let year = startYear; year <= endYear; year++) {
      for (let quarter = 1; quarter <= 4; quarter++) {
        const dataPoint: DataPoint = {
          date: `Q${quarter} '${year.toString().slice(-2)}`,
        };
        
        // Add macro metrics with random values
        mockMacroMetrics.forEach(metric => {
          const metricKey = metric.replace(/\s+/g, '_');
          dataPoint[metricKey] = Math.random() * 10 + (metric.includes('Yield') ? 2 : 1);
        });
        
        data.push(dataPoint);
      }
    }
    return data;
  };

  const macroData = generateMockMacroData();

  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    const currentData = metricType === 'equity' ? data : macroData;
    
    return (
      <ResponsiveContainer width="100%" height={500}>
        <ChartComponent data={currentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {metricType === 'equity' ? (
            // Render equity data
            selectedCompanies.map((company, index) => (
              chartType === 'line' ? (
                <Line
                  key={company}
                  type="monotone"
                  dataKey={company}
                  stroke={`hsl(${index * 45}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ) : (
                <Bar
                  key={company}
                  dataKey={company}
                  fill={`hsl(${index * 45}, 70%, 50%)`}
                />
              )
            ))
          ) : (
            // Render macro data
            selectedMacroMetrics.map((metric, index) => (
              chartType === 'line' ? (
                <Line
                  key={metric.replace(/\s+/g, '_')}
                  type="monotone"
                  dataKey={metric.replace(/\s+/g, '_')}
                  stroke={`hsl(${index * 45 + 180}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ) : (
                <Bar
                  key={metric.replace(/\s+/g, '_')}
                  dataKey={metric.replace(/\s+/g, '_')}
                  fill={`hsl(${index * 45 + 180}, 70%, 50%)`}
                />
              )
            ))
          )}
          {showAverage && metricType === 'equity' && (
            <ReferenceLine
              y={average}
              stroke="gray"
              strokeDasharray="3 3"
              label={`Avg: ${average.toFixed(2)}%`}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  const getCompanyNameBySymbol = (symbol: string) => {
    const company = mockCompanies.find(c => c.symbol === symbol);
    return company ? company.name : symbol;
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Financial Charting</h1>
          
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Left Column - Selections */}
            <div className="lg:col-span-4 space-y-6">
              {/* Tabs for Equity vs Macro */}
              <Tabs defaultValue="equity" className="w-full" onValueChange={(value) => setMetricType(value as MetricType)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="equity">Equity</TabsTrigger>
                  <TabsTrigger value="macro">Macro</TabsTrigger>
                </TabsList>
                
                <TabsContent value="equity" className="space-y-6 mt-4">
                  {/* Company Selection */}
                  <div className="bg-card rounded-lg shadow p-4 border">
                    <h2 className="text-lg font-semibold mb-3">Companies</h2>
                    
                    {/* Selected Companies */}
                    {selectedCompanies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedCompanies.map(company => (
                          <div 
                            key={`selected-${company}`}
                            className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm"
                          >
                            <span title={getCompanyNameBySymbol(company)}>{company}</span>
                            <button 
                              onClick={() => handleRemoveCompany(company)}
                              className="ml-2 text-primary hover:text-primary/80"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Search Input */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search companies..."
                        value={searchCompany}
                        onChange={handleCompanySearch}
                        className="mb-3"
                      />
                    </div>
                    
                    {/* Search Results */}
                    {searchCompany && (
                      <div className="max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-2">
                          {filteredCompanies.map(company => (
                            <div
                              key={company.symbol}
                              onClick={() => handleCompanySelect(company.symbol)}
                              className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                                selectedCompanies.includes(company.symbol) 
                                  ? "bg-primary/10 text-primary" 
                                  : "hover:bg-muted"
                              }`}
                              title={company.name}
                            >
                              <span className="truncate">{company.symbol}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metric Selection */}
                  <div className="bg-card rounded-lg shadow p-4 border">
                    <h2 className="text-lg font-semibold mb-3">Metrics</h2>
                    
                    {/* Selected Metric */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm">
                        <span>{selectedMetric}</span>
                      </div>
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search metrics..."
                        value={searchMetric}
                        onChange={handleMetricSearch}
                        className="mb-3"
                      />
                    </div>
                    
                    {/* Metric Search Results */}
                    {searchMetric && (
                      <div className="max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-2">
                          {filteredMetrics.map(metric => (
                            <div
                              key={metric}
                              onClick={() => handleMetricSelect(metric)}
                              className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                                selectedMetric === metric 
                                  ? "bg-primary/10 text-primary" 
                                  : "hover:bg-muted"
                              }`}
                            >
                              <span className="truncate">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="macro" className="space-y-6 mt-4">
                  {/* Macro Metrics Selection */}
                  <div className="bg-card rounded-lg shadow p-4 border">
                    <h2 className="text-lg font-semibold mb-3">Macro Metrics</h2>
                    
                    {/* Selected Macro Metrics */}
                    {selectedMacroMetrics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedMacroMetrics.map(metric => (
                          <div 
                            key={`selected-macro-${metric}`}
                            className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1.5 text-sm"
                          >
                            <span>{metric}</span>
                            <button 
                              onClick={() => handleRemoveMacroMetric(metric)}
                              className="ml-2 text-primary hover:text-primary/80"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Search Input */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search macro metrics..."
                        value={searchMacroMetric}
                        onChange={handleMacroMetricSearch}
                        className="mb-3"
                      />
                    </div>
                    
                    {/* Macro Metric Search Results */}
                    {searchMacroMetric && (
                      <div className="max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-2">
                          {filteredMacroMetrics.map(metric => (
                            <div
                              key={metric}
                              onClick={() => handleMacroMetricSelect(metric)}
                              className={`px-3 py-2 text-sm rounded-md cursor-pointer ${
                                selectedMacroMetrics.includes(metric) 
                                  ? "bg-primary/10 text-primary" 
                                  : "hover:bg-muted"
                              }`}
                            >
                              <span className="truncate">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Chart Area */}
            <div className="lg:col-span-8">
              {/* Chart Controls */}
              <div className="bg-card rounded-lg shadow p-4 border mb-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Chart Type</label>
                    <div className="flex gap-1">
                      <Button
                        variant={chartType === 'line' ? "default" : "outline"}
                        onClick={() => setChartType('line')}
                        size="sm"
                      >
                        Line
                      </Button>
                      <Button
                        variant={chartType === 'bar' ? "default" : "outline"}
                        onClick={() => setChartType('bar')}
                        size="sm"
                      >
                        Bar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Time Period</label>
                    <div className="flex gap-1">
                      <Button
                        variant={timeInterval === 'Annual' ? "default" : "outline"}
                        onClick={() => setTimeInterval('Annual')}
                        size="sm"
                      >
                        Annual
                      </Button>
                      <Button
                        variant={timeInterval === 'TTM' ? "default" : "outline"}
                        onClick={() => setTimeInterval('TTM')}
                        size="sm"
                      >
                        TTM
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">View</label>
                    <div className="flex gap-1">
                      <Button
                        variant={viewMode === 'single' ? "default" : "outline"}
                        onClick={() => setViewMode('single')}
                        size="sm"
                      >
                        Single
                      </Button>
                      <Button
                        variant={viewMode === 'multi' ? "default" : "outline"}
                        onClick={() => setViewMode('multi')}
                        size="sm"
                      >
                        Multi
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Options</label>
                    <div className="flex gap-1">
                      <Button
                        variant={showAverage ? "default" : "outline"}
                        onClick={() => setShowAverage(!showAverage)}
                        size="sm"
                      >
                        Show Average
                      </Button>

                      <Button variant="outline" onClick={() => {}} size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-card rounded-lg shadow p-4 border">
                <h2 className="text-lg font-semibold mb-4">
                  {metricType === 'equity' ? selectedMetric : selectedMacroMetrics.length > 0 ? selectedMacroMetrics.join(', ') : 'No metrics selected'} {timeInterval === 'TTM' ? '(TTM)' : ''}
                </h2>
                {renderChart()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 