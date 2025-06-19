'use client';

import { useState, useEffect } from 'react';
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
  YAxis,
  ReferenceLine
} from 'recharts';
import { ArrowUp, ArrowDown, ArrowRight, Loader2 } from 'lucide-react';
import { portfolioService } from '@/api/v1/portfolios/service';

// Types
interface HoldingData {
  symbol: string;
  name: string;
  sector: string;
  weight: number;
  shares: number;
  price: number;
  marketValue: number;
  change: string;
}

interface HoldingsData {
  dates: string[];
  holdings: Record<string, HoldingData[]>;
}

interface FactorData {
  name: string;
  exposure: number;
  benchmark: number;
}

interface FactorsData {
  factors: FactorData[];
}

// Helper function to format currency values
const formatCurrency = (value: number | null | undefined) => {
  if (typeof value !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Helper function to format percentage values
const formatPercent = (value: number | null | undefined) => {
  if (typeof value !== 'number') return '0.0%';
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

export default function HoldingsTab({ ticker }: { ticker: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [holdingsData, setHoldingsData] = useState<HoldingsData | null>(null);
  const [factorData, setFactorData] = useState<FactorData[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch holdings data
        const fetchedHoldingsData = await portfolioService.getPortfolioHoldings(ticker);
        
        // Fetch factor data
        const fetchedFactorsData = await portfolioService.getPortfolioFactors(ticker);
        
        // Set the data
        setHoldingsData(fetchedHoldingsData);
        setFactorData(fetchedFactorsData.factors);
        
        // Set the selected date to the most recent one
        if (fetchedHoldingsData && fetchedHoldingsData.dates.length > 0) {
          setSelectedDate(fetchedHoldingsData.dates[0]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching holdings data:', err);
        setError('Failed to load holdings data. Please try again later.');
        setLoading(false);
      }
    };
    
    if (ticker) {
      fetchData();
    }
  }, [ticker]);
  
  // Get holdings for the selected date
  const currentHoldings = holdingsData && selectedDate 
    ? holdingsData.holdings[selectedDate as keyof typeof holdingsData.holdings] || []
    : [];
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Loader2 className={`h-8 w-8 animate-spin mx-auto mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`} />
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading holdings data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
        {error}
      </div>
    );
  }

  if (!holdingsData) {
    return (
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          No holdings data available for this portfolio.
        </p>
      </div>
    );
  }
  
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
              {holdingsData.dates.map((date) => (
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
          <Card className={`shadow-none border-0 ${isDark ? 'bg-gray-800' : ''}`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={`${isDark ? 'border-gray-700' : ''} border-b`}>
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
                  {currentHoldings.map((holding, index) => (
                    <TableRow 
                      key={holding.symbol} 
                      className={`${isDark ? 'border-gray-700' : ''} ${index !== currentHoldings.length - 1 ? 'border-b border-dashed' : 'border-0'}`}
                    >
                      <TableCell className="font-medium">
                        <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-black text-white rounded">
                          {holding.symbol}
                        </div>
                      </TableCell>
                      <TableCell>{holding.name}</TableCell>
                      <TableCell>{holding.sector}</TableCell>
                      <TableCell className="text-right">{formatPercent(holding.weight)}</TableCell>
                      <TableCell className="text-right">{typeof holding.shares === 'number' ? holding.shares.toLocaleString() : '0'}</TableCell>
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
          {factorData && (
            <Card className={`p-4 shadow-none border-0 ${isDark ? 'bg-gray-800' : ''}`}>
              <h3 className={`text-base font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Factor Exposures
              </h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={factorData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis 
                      type="number" 
                      domain={[-2, 2]} 
                      tickCount={5}
                      tickFormatter={(value) => {
                        if (typeof value === 'number') {
                          return value.toFixed(1);
                        }
                        return String(value);
                      }}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value) => {
                        // Check if value is a number before using toFixed
                        if (typeof value === 'number') {
                          return [value.toFixed(2), 'Exposure'];
                        }
                        return [String(value), 'Exposure'];
                      }}
                      labelStyle={{ color: isDark ? '#e5e7eb' : '#111827' }}
                      contentStyle={{ 
                        backgroundColor: isDark ? '#374151' : '#ffffff',
                        borderColor: isDark ? '#4b5563' : '#e5e7eb'
                      }}
                    />
                    <Bar dataKey="exposure" radius={[0, 4, 4, 0]}>
                      {factorData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.exposure > 0 ? '#10B981' : '#EF4444'} 
                        />
                      ))}
                    </Bar>
                    <ReferenceLine 
                      x={0} 
                      stroke={isDark ? "#6b7280" : "#9ca3af"} 
                      strokeWidth={1} 
                    />
                    {/* Add benchmark reference lines */}
                    {factorData.map((entry, index) => (
                      <ReferenceLine 
                        key={`benchmark-${index}`}
                        y={entry.name}
                        x={entry.benchmark}
                        stroke="#3b82f6"
                        strokeDasharray="3 3"
                        isFront={true}
                        strokeWidth={1.5}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Positive</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Negative</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-0.5 bg-blue-500 border-b border-blue-500 border-dashed"></div>
                    <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Benchmark</span>
                  </div>
                </div>
              </div>
              <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Factor exposures show how the portfolio is positioned relative to the market.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 