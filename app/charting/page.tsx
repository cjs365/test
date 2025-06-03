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

type ChartType = 'line' | 'bar';
type TimeInterval = 'Annual' | 'TTM';
type ViewMode = 'single' | 'multi';

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

  const handleCompanySelect = (company: string) => {
    if (selectedCompanies.includes(company)) {
      setSelectedCompanies(prev => prev.filter(c => c !== company));
    } else {
      setSelectedCompanies(prev => [...prev, company]);
    }
  };

  const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCompany(e.target.value);
  };

  const handleMetricSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchMetric(e.target.value);
  };

  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    
    return (
      <ResponsiveContainer width="100%" height={500}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {selectedCompanies.map((company, index) => (
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
          ))}
          {showAverage && (
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

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Financial Charting</h1>
          
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Company Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Companies</label>
              <Input
                type="text"
                placeholder="Search companies..."
                value={searchCompany}
                onChange={handleCompanySearch}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {filteredCompanies.map(company => (
                  <Button
                    key={company.symbol}
                    variant={selectedCompanies.includes(company.symbol) ? "default" : "outline"}
                    onClick={() => handleCompanySelect(company.symbol)}
                    className="text-sm"
                  >
                    {company.symbol}
                  </Button>
                ))}
              </div>
            </div>

            {/* Metric Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Metrics</label>
              <Input
                type="text"
                placeholder="Search metrics..."
                value={searchMetric}
                onChange={handleMetricSearch}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {filteredMetrics.map(metric => (
                  <Button
                    key={metric}
                    variant={selectedMetric === metric ? "default" : "outline"}
                    onClick={() => setSelectedMetric(metric)}
                    className="text-sm"
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <Button
                variant={chartType === 'line' ? "default" : "outline"}
                onClick={() => setChartType('line')}
              >
                Line
              </Button>
              <Button
                variant={chartType === 'bar' ? "default" : "outline"}
                onClick={() => setChartType('bar')}
              >
                Bar
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={timeInterval === 'Annual' ? "default" : "outline"}
                onClick={() => setTimeInterval('Annual')}
              >
                Annual
              </Button>
              <Button
                variant={timeInterval === 'TTM' ? "default" : "outline"}
                onClick={() => setTimeInterval('TTM')}
              >
                TTM
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'single' ? "default" : "outline"}
                onClick={() => setViewMode('single')}
              >
                Single Panel
              </Button>
              <Button
                variant={viewMode === 'multi' ? "default" : "outline"}
                onClick={() => setViewMode('multi')}
              >
                Multi Panel
              </Button>
            </div>

            <Button
              variant={showAverage ? "default" : "outline"}
              onClick={() => setShowAverage(!showAverage)}
            >
              Show Average
            </Button>

            <Button variant="outline" onClick={() => {}}>
              Download
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          {renderChart()}
        </div>
      </div>
    </MainLayout>
  );
} 