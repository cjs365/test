'use client';

import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, FileBarChart, Download, Filter, Info } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import AIFactorAnalysis from './AIFactorAnalysis';

// Mock data for market factor performance
const marketFactorData = [
  { name: 'Value', mtd: 1.2, qtd: 2.5, ytd: 5.7, oneYear: 7.2 },
  { name: 'Growth', mtd: -0.8, qtd: 1.5, ytd: 3.8, oneYear: 6.1 },
  { name: 'Quality', mtd: 0.5, qtd: 3.2, ytd: 4.9, oneYear: 8.3 },
  { name: 'Momentum', mtd: 2.1, qtd: 4.5, ytd: 7.2, oneYear: 9.8 },
  { name: 'Size', mtd: -0.3, qtd: 0.8, ytd: 2.1, oneYear: 3.5 },
  { name: 'Volatility', mtd: -1.4, qtd: -2.2, ytd: -3.5, oneYear: -2.8 },
];

// Type for timeframe values
type TimeframeKey = 'mtd' | 'qtd' | 'ytd' | 'oneYear';

// Mock data for factor returns chart
const factorReturnsData = [
  { name: 'Value', value: 5.7 },
  { name: 'Growth', value: 3.8 },
  { name: 'Quality', value: 4.9 },
  { name: 'Momentum', value: 7.2 },
  { name: 'Size', value: 2.1 },
  { name: 'Volatility', value: -3.5 },
];

// Factor definitions for description
const factorDefinitions = [
  { name: 'Value', description: 'Stocks trading at low multiples relative to their intrinsic value' },
  { name: 'Growth', description: 'Companies with strong revenue and earnings growth expectations' },
  { name: 'Quality', description: 'Companies with strong balance sheets, stable earnings, and high ROE' },
  { name: 'Momentum', description: 'Stocks that have performed well in the recent past (3-12 months)' },
  { name: 'Size', description: 'Companies categorized by their market capitalization' },
  { name: 'Volatility', description: 'Stocks with lower price fluctuations compared to the market' },
];

export default function FactorPerformancePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [timeframe, setTimeframe] = useState<TimeframeKey>('ytd');
  
  // Get data based on selected timeframe
  const getDataForTimeframe = () => {
    return marketFactorData.map(item => {
      return {
        name: item.name,
        value: item[timeframe]
      };
    }).sort((a, b) => b.value - a.value);
  };
  
  const barColors = {
    positive: isDark ? '#4ade80' : '#22c55e',
    negative: isDark ? '#f87171' : '#ef4444'
  };
  
  return (
    <MainLayout>
      <div className="py-4 px-4 max-w-[1200px] mx-auto">
        {/* Header with breadcrumb */}
        <div className="mb-4">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/portfolio" className="hover:underline">Portfolio</Link>
            <span className="mx-2">/</span>
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>Factor Performance</span>
          </div>
          <div className="flex justify-between items-center">
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Market Factor Performance
            </h1>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <Info className="h-3 w-3 mr-1" />
                About Factors
              </Button>
            </div>
          </div>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Analysis of key market factors across different time periods
          </p>
        </div>
        
        {/* Time period selector - Morningstar style tabs */}
        <div className={`flex border-b mb-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'mtd' ? 
              (isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
              (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
            onClick={() => setTimeframe('mtd')}
          >
            MTD
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'qtd' ? 
              (isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
              (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
            onClick={() => setTimeframe('qtd')}
          >
            QTD
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'ytd' ? 
              (isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
              (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
            onClick={() => setTimeframe('ytd')}
          >
            YTD
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${timeframe === 'oneYear' ? 
              (isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600') : 
              (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')}`}
            onClick={() => setTimeframe('oneYear')}
          >
            1Y
          </button>
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          {/* Main Panel - Left */}
          <div className="col-span-12 lg:col-span-8">
            {/* Market Factor Performance Chart */}
            <Card className={`mb-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Market Factor Performance</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getDataForTimeframe()}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? '#374151' : '#e5e7eb'} />
                      <XAxis type="number" tickFormatter={(value: number) => `${value.toFixed(1)}%`} stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={10} />
                      <YAxis dataKey="name" type="category" width={60} stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={10} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
                        contentStyle={{ 
                          backgroundColor: isDark ? '#1f2937' : '#ffffff',
                          borderColor: isDark ? '#374151' : '#e5e7eb',
                          color: isDark ? '#f9fafb' : '#111827',
                          fontSize: '12px',
                          padding: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="value"
                        fill={barColors.positive}
                        radius={[0, 3, 3, 0]}
                      >
                        {
                          getDataForTimeframe().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value >= 0 ? barColors.positive : barColors.negative} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Factor Performance Table */}
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Historical Performance (%)</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className={`${isDark ? 'border-gray-700' : ''}`}>
                        <TableHead className={`py-2 text-xs ${isDark ? 'text-gray-300' : ''}`}>Factor</TableHead>
                        <TableHead className={`text-right py-2 text-xs ${isDark ? 'text-gray-300' : ''}`}>MTD</TableHead>
                        <TableHead className={`text-right py-2 text-xs ${isDark ? 'text-gray-300' : ''}`}>QTD</TableHead>
                        <TableHead className={`text-right py-2 text-xs ${isDark ? 'text-gray-300' : ''}`}>YTD</TableHead>
                        <TableHead className={`text-right py-2 text-xs ${isDark ? 'text-gray-300' : ''}`}>1 Year</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {marketFactorData.map((factor) => (
                        <TableRow key={factor.name} className={`${isDark ? 'border-gray-700' : ''}`}>
                          <TableCell className={`py-2 text-xs font-medium ${isDark ? 'text-white' : ''}`}>
                            {factor.name}
                          </TableCell>
                          <TableCell className={`text-right py-2 text-xs ${factor.mtd >= 0 
                            ? (isDark ? 'text-green-400' : 'text-green-600')
                            : (isDark ? 'text-red-400' : 'text-red-600')
                          }`}>
                            {factor.mtd > 0 ? '+' : ''}{factor.mtd.toFixed(2)}%
                          </TableCell>
                          <TableCell className={`text-right py-2 text-xs ${factor.qtd >= 0 
                            ? (isDark ? 'text-green-400' : 'text-green-600')
                            : (isDark ? 'text-red-400' : 'text-red-600')
                          }`}>
                            {factor.qtd > 0 ? '+' : ''}{factor.qtd.toFixed(2)}%
                          </TableCell>
                          <TableCell className={`text-right py-2 text-xs ${factor.ytd >= 0 
                            ? (isDark ? 'text-green-400' : 'text-green-600')
                            : (isDark ? 'text-red-400' : 'text-red-600')
                          }`}>
                            {factor.ytd > 0 ? '+' : ''}{factor.ytd.toFixed(2)}%
                          </TableCell>
                          <TableCell className={`text-right py-2 text-xs ${factor.oneYear >= 0 
                            ? (isDark ? 'text-green-400' : 'text-green-600')
                            : (isDark ? 'text-red-400' : 'text-red-600')
                          }`}>
                            {factor.oneYear > 0 ? '+' : ''}{factor.oneYear.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Right */}
          <div className="col-span-12 lg:col-span-4">
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Factor Definitions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {factorDefinitions.map((factor) => (
                    <div key={factor.name} className="border-b last:border-0 pb-2 last:pb-0 border-gray-200 dark:border-gray-700">
                      <h3 className={`text-xs font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {factor.name}
                      </h3>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {factor.description}
                      </p>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <Link href="/academy/methodology" className={`text-xs ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline flex items-center`}>
                      Learn more about factor investing
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* AI Factor Analysis */}
        <AIFactorAnalysis />
      </div>
    </MainLayout>
  );
} 