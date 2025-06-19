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

// Mock data for key metrics
const keyMetrics = [
  { id: '1', name: 'Total Return', value: '21.4%' },
  { id: '2', name: 'Excess Return', value: '+3.7%' },
  { id: '3', name: 'Volatility', value: '16.8%' },
  { id: '4', name: 'Tracking Error', value: '3.2%' },
  { id: '5', name: 'Sharpe Ratio', value: '1.25' },
  { id: '6', name: 'Max Drawdown', value: '-8.7%' },
  { id: '7', name: 'VaR (95%)', value: '2.4%' },
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
            {/* Header content */}
          </div>
          
          {/* Main container - Two column layout with freely stacking sections */}
          <div className="flex flex-col lg:flex-row gap-2">
            {/* Left Column - All sections stack freely */}
            <div className="lg:w-1/2 space-y-2">
              {/* Portfolio Selection Options */}
              <div className="bg-card p-2 rounded-sm">
                {/* Selection content */}
              </div>
              
              {/* Performance Attribution Section */}
              <div className="bg-card p-2 rounded-sm">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
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
                  {/* Chart content */}
                </div>
              </div>
            </div>

            {/* Right Column - All sections stack freely */}
            <div className="lg:w-1/2 space-y-2">
              {/* Portfolio Return & Risk Snapshot */}
              <div className="bg-card p-2 rounded-sm">
                <div className="border-b border-gray-200 dark:border-gray-700 mb-2 pb-1">
                  <div className="flex items-center gap-1">
                    <h3 className="text-sm font-semibold">Portfolio Return & Risk Snapshot</h3>
                    <InfoTooltip text="Key performance and risk metrics for your portfolio." />
                  </div>
                </div>
                {/* Metrics grid */}
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
                {/* Holdings table */}
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
                  {/* Search controls and content */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </MainLayout>
  );
} 