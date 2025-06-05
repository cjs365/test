'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/app/context/ThemeProvider';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

// Mock holdings data with multiple periods
const mockHoldingsData = {
  dates: ['2024-06-30', '2024-03-31', '2023-12-31', '2023-09-30', '2023-06-30'],
  holdings: {
    '2024-06-30': [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Information Technology', weight: 8.5, shares: 16500, price: 123.45, marketValue: 2036925, change: 'new' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Information Technology', weight: 7.8, shares: 14200, price: 432.65, marketValue: 1874625, change: 'up' },
      { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Information Technology', weight: 6.9, shares: 22400, price: 231.75, marketValue: 1656750, change: 'down' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', weight: 5.7, shares: 9800, price: 178.45, marketValue: 1367750, change: 'unchanged' },
      { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', sector: 'Communication Services', weight: 5.2, shares: 6500, price: 187.65, marketValue: 1248500, change: 'up' },
      { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', weight: 4.8, shares: 7200, price: 477.50, marketValue: 1152000, change: 'unchanged' },
      { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Information Technology', weight: 4.2, shares: 3600, price: 876.35, marketValue: 1008500, change: 'new' },
      { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', weight: 3.5, shares: 11200, price: 233.75, marketValue: 840000, change: 'down' },
      { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Information Technology', weight: 3.1, shares: 4800, price: 510.25, marketValue: 744000, change: 'unchanged' },
      { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Information Technology', weight: 2.8, shares: 8900, price: 251.85, marketValue: 672000, change: 'up' },
    ],
    '2024-03-31': [
      { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Information Technology', weight: 8.2, shares: 24800, price: 218.75, marketValue: 1968750, change: 'unchanged' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Information Technology', weight: 7.4, shares: 12800, price: 410.65, marketValue: 1776000, change: 'up' },
      { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', sector: 'Communication Services', weight: 5.8, shares: 7200, price: 172.65, marketValue: 1392000, change: 'unchanged' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', weight: 5.7, shares: 9800, price: 168.75, marketValue: 1368000, change: 'unchanged' },
      { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', weight: 4.8, shares: 7200, price: 452.50, marketValue: 1152000, change: 'up' },
      { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', weight: 4.6, shares: 14400, price: 198.75, marketValue: 1104000, change: 'down' },
      { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Information Technology', weight: 3.1, shares: 4800, price: 485.00, marketValue: 744000, change: 'unchanged' },
      { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Information Technology', weight: 2.5, shares: 7800, price: 235.25, marketValue: 600000, change: 'up' },
      { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', weight: 2.4, shares: 3200, price: 456.25, marketValue: 576000, change: 'down' },
      { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Information Technology', weight: 2.1, shares: 25600, price: 49.75, marketValue: 504000, change: 'unchanged' },
    ]
  }
};

// Mock factor exposure data
const mockFactorData = [
  { name: 'Momentum', value: 1.24, color: '#2563EB' },
  { name: 'Value', value: -0.45, color: '#F59E0B' },
  { name: 'Size', value: 0.82, color: '#10B981' },
  { name: 'Quality', value: 1.05, color: '#EF4444' },
  { name: 'Volatility', value: -0.68, color: '#8B5CF6' },
  { name: 'Growth', value: 1.35, color: '#EC4899' },
  { name: 'Dividend Yield', value: -0.95, color: '#6366F1' }
];

// Helper function to format currency values
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Helper function to format percentage values
const formatPercent = (value: number) => {
  return `${value.toFixed(1)}%`;
};

const ChangeIndicator = ({ change }: { change: string }) => {
  if (change === 'up') {
    return <ArrowUp className="h-4 w-4 text-green-500" />;
  } else if (change === 'down') {
    return <ArrowDown className="h-4 w-4 text-red-500" />;
  } else if (change === 'new') {
    return <Badge variant="success" className="text-xs">New</Badge>;
  } else {
    return <ArrowRight className="h-4 w-4 text-gray-400" />;
  }
};

export default function HoldingsTab() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState(mockHoldingsData.dates[0]);
  
  // Get holdings for the selected date
  const currentHoldings = mockHoldingsData.holdings[selectedDate as keyof typeof mockHoldingsData.holdings] || [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Portfolio Holdings
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>As of:</span>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {mockHoldingsData.dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
            {currentHoldings.length} holdings
          </div>
          <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={isDark ? 'border-gray-700' : ''}>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Market Value</TableHead>
                    <TableHead className="text-center">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentHoldings.map((holding) => (
                    <TableRow key={holding.symbol} className={isDark ? 'border-gray-700' : ''}>
                      <TableCell className="font-medium">
                        <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-black text-white rounded">
                          {holding.symbol}
                        </div>
                      </TableCell>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell>{holding.sector}</TableCell>
                      <TableCell className="text-right">{formatPercent(holding.weight)}</TableCell>
                      <TableCell className="text-right">{holding.shares.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.marketValue)}</TableCell>
                      <TableCell className="text-center">
                        <ChangeIndicator change={holding.change} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
          
          <div className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Note: Holdings data is updated quarterly. Change column indicates position changes from the previous quarter.</p>
          </div>
        </div>
        
        <div>
          <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <h3 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Factor Exposure
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={mockFactorData}
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <XAxis type="number" domain={[-1.5, 1.5]} />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip 
                    formatter={(value) => {
                      const numValue = Number(value);
                      return [`${numValue.toFixed(2)}`, 'Z-Score'];
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {mockFactorData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.value > 0 ? '#10B981' : '#EF4444'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>Factor exposures shown as Z-scores relative to the benchmark.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 