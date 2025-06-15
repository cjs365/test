'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import MainLayout from '@/app/components/layout/MainLayout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeInterval = 'Annual' | 'TTM';
type GeoRegion = 'Global' | 'US' | 'China';

// Mock data structure
type DataPoint = {
  date: string;
  [key: string]: string | number;
};

// Mock indicators
const mockIndicators = {
  'Global': [
    'Global Recession Probability',
    'Global Inflation Index',
    'World Trade Volume',
    'Global Manufacturing PMI',
    'Global Services PMI',
    'Global Equity Markets Performance',
    'Global Bond Yields',
    'Commodity Price Index',
    'Global Consumer Confidence',
    'Global FDI Flows'
  ],
  'US': [
    'FedWatch - Rate Cut Probability',
    'US GDP Growth',
    'US Inflation Rate (CPI)',
    'US Unemployment Rate',
    'US Manufacturing PMI',
    'US Consumer Confidence',
    'US Housing Starts',
    'US Retail Sales',
    'US Industrial Production',
    'US Treasury Yields'
  ],
  'China': [
    'China GDP Growth',
    'China Inflation Rate',
    'China Manufacturing PMI',
    'China Retail Sales',
    'China Industrial Production',
    'China Fixed Asset Investment',
    'China Housing Price Index',
    'China Foreign Exchange Reserves',
    'China Export Growth',
    'China Credit Growth'
  ]
};

// Generate mock data
const generateMockData = (indicator: string): DataPoint[] => {
  const data: DataPoint[] = [];
  const startYear = 2015;
  const endYear = 2025;

  for (let year = startYear; year <= endYear; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const dataPoint: DataPoint = {
        date: `Q${quarter} '${year.toString().slice(-2)}`,
      };
      
      // Generate random value based on indicator type
      let value;
      if (indicator.includes('Probability')) {
        value = Math.random() * 100; // 0-100%
      } else if (indicator.includes('Rate') || indicator.includes('Growth')) {
        value = (Math.random() * 10) - 2; // -2% to 8%
      } else if (indicator.includes('Index')) {
        value = Math.random() * 200 + 800; // 800-1000
      } else {
        value = Math.random() * 50 + 50; // 50-100
      }
      
      dataPoint[indicator] = value;
      data.push(dataPoint);
    }
  }
  return data;
};

// Generate latest readings for indicators
const generateLatestReading = (indicator: string): string => {
  let value, unit;
  
  if (indicator.includes('Probability')) {
    value = (Math.random() * 100).toFixed(1);
    unit = '%';
  } else if (indicator.includes('Rate') || indicator.includes('Growth')) {
    value = (Math.random() * 10 - 2).toFixed(1);
    unit = '%';
  } else if (indicator.includes('Index')) {
    value = Math.floor(Math.random() * 200 + 800);
    unit = '';
  } else {
    value = (Math.random() * 50 + 50).toFixed(1);
    unit = '';
  }
  
  return `${value}${unit}`;
};

// Mock definitions for indicators
const mockDefinitions = {
  'Global Recession Probability': 'A statistical measure estimating the likelihood of a worldwide economic downturn over the next 12 months, based on various leading economic indicators across major economies.',
  'FedWatch - Rate Cut Probability': 'Market-implied probability of the Federal Reserve cutting interest rates at upcoming FOMC meetings, derived from federal funds futures pricing.',
  'US GDP Growth': 'The percentage change in the inflation-adjusted value of all goods and services produced by the U.S. economy, measured quarterly and annualized.',
  'China Manufacturing PMI': 'A survey-based indicator that measures manufacturing activity in China. Values above 50 indicate expansion, while values below 50 indicate contraction.',
  'Global Inflation Index': 'A composite measure of price changes across major global economies, weighted by GDP.',
};

export default function MacroPage() {
  const [selectedGeo, setSelectedGeo] = useState<GeoRegion>('Global');
  const [selectedIndicator, setSelectedIndicator] = useState('Global Recession Probability');
  const [timeInterval] = useState<TimeInterval>('Annual');

  const data = generateMockData(selectedIndicator);

  const handleGeoChange = (geo: GeoRegion) => {
    setSelectedGeo(geo);
    setSelectedIndicator(mockIndicators[geo][0]);
  };

  const handleIndicatorSelect = (indicator: string) => {
    setSelectedIndicator(indicator);
  };

  const renderChart = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={selectedIndicator}
            stroke="hsl(215, 70%, 50%)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-3xl font-bold mb-4">Macro Economic Indicators</h1>
        
        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Content - Charts and Controls */}
          <div className="lg:col-span-9">
            {/* Selection Controls - Compact Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b">
              <div className="flex gap-4 items-center">
                <div className="w-40">
                  <label className="text-sm font-medium mb-1 block">Region</label>
                  <Select
                    value={selectedGeo}
                    onValueChange={(value) => handleGeoChange(value as GeoRegion)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Global">Global</SelectItem>
                      <SelectItem value="US">US</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-64">
                  <label className="text-sm font-medium mb-1 block">Indicator</label>
                  <Select
                    value={selectedIndicator}
                    onValueChange={handleIndicatorSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select indicator" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockIndicators[selectedGeo].map((indicator) => (
                        <SelectItem key={indicator} value={indicator}>
                          {indicator}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>

            {/* Chart */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                {selectedIndicator} {timeInterval === 'TTM' ? '(TTM)' : ''}
              </h2>
              {renderChart()}
            </div>

            {/* Definition Section */}
            <div className="pt-4 border-t">
              <h2 className="text-lg font-semibold mb-4">Definition & Methodology</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-1">{selectedIndicator}</h3>
                  <p className="text-muted-foreground text-sm">
                    {mockDefinitions[selectedIndicator as keyof typeof mockDefinitions] || 
                    'A statistical measure that tracks economic performance across various sectors and regions.'}
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-medium mb-1">Data Source</h3>
                  <p className="text-muted-foreground text-sm">
                    Data compiled from various central banks, statistical agencies, and financial institutions.
                    Updated quarterly with a 45-day lag from the end of the reporting period.
                  </p>
                </div>
                <div>
                  <h3 className="text-md font-medium mb-1">Interpretation</h3>
                  <p className="text-muted-foreground text-sm">
                    Higher values typically indicate {selectedIndicator.includes('Recession') || selectedIndicator.includes('Inflation') ? 
                    'increased economic risk' : 'stronger economic performance'}. Historical average: 
                    {selectedIndicator.includes('Probability') ? ' 35%' : 
                      selectedIndicator.includes('Rate') || selectedIndicator.includes('Growth') ? ' 2.5%' : ' 75.3'}.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Top 10 Charts */}
          <div className="lg:col-span-3 border-l pl-4">
            <h2 className="text-lg font-semibold mb-3">Top {selectedGeo} Indicators</h2>
            <p className="text-xs text-muted-foreground mb-3">Most viewed indicators</p>
            
            <div className="space-y-1">
              {mockIndicators[selectedGeo].map((indicator) => (
                <div
                  key={indicator}
                  onClick={() => handleIndicatorSelect(indicator)}
                  className={`px-2 py-2 text-sm rounded-md cursor-pointer flex justify-between ${
                    selectedIndicator === indicator 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="truncate max-w-[70%]">{indicator}</span>
                  <span className="text-xs text-foreground">
                    {generateLatestReading(indicator)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 