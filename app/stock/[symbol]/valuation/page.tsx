'use client';

import { useState } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts';
import { ReactElement } from 'react';

type Props = {
  params: {
    symbol: string;
  };
};

export default function StockValuationPage({ params }: Props) {
  const mockCompanyData = {
    name: 'Apple Inc',
    symbol: params.symbol,
  };

  // Generate mock data with monthly intervals
  function generateMockEvEeData() {
    const startYear = 2019;
    const endYear = 2023;
    const average = 12.5;
    const stdDev = 1.5; // standard deviation
    const data = [];

    // Generate smoother data with less volatility
    let currentValue = average + (Math.random() - 0.5) * stdDev;
    
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        // Small random walk with momentum for smoother transitions
        const change = (Math.random() - 0.5) * stdDev * 0.4;
        currentValue = currentValue + change;
        // Keep values within reasonable bounds
        if (currentValue > average + stdDev * 2.5) currentValue = average + stdDev * 2;
        if (currentValue < average - stdDev * 2.5) currentValue = average - stdDev * 2;
        
        const value = +currentValue.toFixed(2);
        const label = `${year}-${String(month).padStart(2, '0')}`;
        data.push({
          date: label,
          value,
          average,
          upper: +(average + stdDev).toFixed(2),
          lower: +(average - stdDev).toFixed(2),
        });
      }
    }

    return data;
  }

  function generateMockEvIcData() {
    const startYear = 2019;
    const endYear = 2023;
    const average = 2.2;
    const stdDev = 0.3; // standard deviation
    const data = [];

    // Generate smoother data with less volatility
    let currentValue = average + (Math.random() - 0.5) * stdDev;
    
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        // Small random walk with momentum for smoother transitions
        const change = (Math.random() - 0.5) * stdDev * 0.4;
        currentValue = currentValue + change;
        // Keep values within reasonable bounds
        if (currentValue > average + stdDev * 2.5) currentValue = average + stdDev * 2;
        if (currentValue < average - stdDev * 2.5) currentValue = average - stdDev * 2;
        
        const value = +currentValue.toFixed(2);
        const label = `${year}-${String(month).padStart(2, '0')}`;
        data.push({
          date: label,
          value,
          average,
          upper: +(average + stdDev).toFixed(2),
          lower: +(average - stdDev).toFixed(2),
        });
      }
    }

    return data;
  }

  // Generate data
  const evEeData = generateMockEvEeData();
  const evIcData = generateMockEvIcData();

  // Calculate statistics for EV/EE
  const evEeValues = evEeData.map(item => item.value);
  const evEeMax = Math.max(...evEeValues).toFixed(2);
  const evEeMin = Math.min(...evEeValues).toFixed(2);
  const evEeCurrent = evEeValues[evEeValues.length - 1].toFixed(2);
  const evEeAvg = evEeData[0].average;
  const evEeUpper = evEeData[0].upper;
  const evEeLower = evEeData[0].lower;

  // Calculate statistics for EV/IC
  const evIcValues = evIcData.map(item => item.value);
  const evIcMax = Math.max(...evIcValues).toFixed(2);
  const evIcMin = Math.min(...evIcValues).toFixed(2);
  const evIcCurrent = evIcValues[evIcValues.length - 1].toFixed(2);
  const evIcAvg = evIcData[0].average;
  const evIcUpper = evIcData[0].upper;
  const evIcLower = evIcData[0].lower;

  const renderValuationChart = (
    data: any[],
    title: string,
    description: string,
    valueLabel: string,
    averageLabel: string,
    stats: {
      max: string;
      min: string;
      current: string;
      avg: number;
      upper: number;
      lower: number;
    }
  ) => {
    // Find indices for specific points to annotate
    const dataLength = data.length;
    const lastIndex = dataLength - 1;
    
    // Find max and min value indices
    let maxIndex = 0;
    let minIndex = 0;
    let maxValue = Number.MIN_SAFE_INTEGER;
    let minValue = Number.MAX_SAFE_INTEGER;
    
    data.forEach((item, index) => {
      if (item.value > maxValue) {
        maxValue = item.value;
        maxIndex = index;
      }
      if (item.value < minValue) {
        minValue = item.value;
        minIndex = index;
      }
    });
    
    // Create a new array with labels for max, min and current points
    const dataWithLabels = data.map((item, index) => {
      if (index === maxIndex || index === minIndex || index === lastIndex) {
        return {
          ...item,
          showLabel: true,
          labelValue: item.value.toFixed(1),
          labelType: index === maxIndex ? 'max' : index === minIndex ? 'min' : 'current'
        };
      }
      return item;
    });
    
    // Custom dot component to show values above points
    const CustomizedDot = (props: any): ReactElement | null => {
      const { cx, cy, payload } = props;
      
      if (payload.showLabel) {
        const labelText = payload.labelType === 'max' ? 'Max: ' + payload.labelValue :
                         payload.labelType === 'min' ? 'Min: ' + payload.labelValue :
                         'Current: ' + payload.labelValue;
        
        return (
          <g>
            <circle 
              cx={cx} 
              cy={cy} 
              r={4} 
              fill={payload.labelType === 'max' ? '#10b981' : 
                   payload.labelType === 'min' ? '#ef4444' : 
                   '#2563eb'} 
            />
            <text 
              x={cx} 
              y={cy - 10} 
              textAnchor="middle" 
              fill={payload.labelType === 'max' ? '#10b981' : 
                   payload.labelType === 'min' ? '#ef4444' : 
                   '#2563eb'} 
              fontSize={12}
              fontWeight="bold"
            >
              {labelText}
            </text>
          </g>
        );
      }
      
      return null; // Don't render dots for non-labeled points
    };
    
    // Find the middle point for standard deviation labels
    const middleIndex = Math.floor(dataLength / 2);
    
    return (
      <div className="mb-8">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            <HoverCard>
              <HoverCardTrigger>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.06 2.75 2.75 0 013.89 0 .75.75 0 01-1.06 1.06 1.25 1.25 0 00-1.77 0zM7 10a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 017 10zm3 0a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 10z" clipRule="evenodd" />
                  </svg>
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm text-gray-600">{description}</p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
        <div className="h-[300px] bg-white">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataWithLabels} margin={{ top: 25, right: 80, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                interval={11} // Show one tick per year
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(2), '']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              
              <Line
                type="monotone"
                dataKey="value"
                name={valueLabel}
                stroke="#2563eb"
                strokeWidth={2}
                dot={CustomizedDot as any}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="average"
                name={averageLabel}
                stroke="#9ca3af"
                strokeWidth={2}
                dot={false}
              />
              
              {/* Standard deviation lines with labels */}
              <Line
                type="monotone"
                dataKey="upper"
                name="+1 StdDev"
                stroke="#9ca3af"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
              >
                <Label
                  content={({ viewBox }) => (
                    <text
                      x={(viewBox as any).width / 2 + (viewBox as any).x}
                      y={(viewBox as any).y - 8}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize={11}
                      fontWeight="bold"
                    >
                      +1σ: {stats.upper.toFixed(1)}
                    </text>
                  )}
                  position="top"
                />
              </Line>
              
              <Line
                type="monotone"
                dataKey="lower"
                name="-1 StdDev"
                stroke="#9ca3af"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
              >
                <Label
                  content={({ viewBox }) => (
                    <text
                      x={(viewBox as any).width / 2 + (viewBox as any).x}
                      y={(viewBox as any).y + 15}
                      textAnchor="middle"
                      fill="#9ca3af"
                      fontSize={11}
                      fontWeight="bold"
                    >
                      -1σ: {stats.lower.toFixed(1)}
                    </text>
                  )}
                  position="bottom"
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <StockLayout 
      symbol={mockCompanyData.symbol} 
      companyName={mockCompanyData.name}
      sector="Technology"
      country="United States"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-9 lg:border-r lg:pr-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Valuation Analysis</h2>
          </div>

          {renderValuationChart(
            evEeData,
            'Enterprise Value / Economic Earnings',
            'Shows the relationship between the company\'s enterprise value and its economic earnings, indicating whether the stock might be overvalued or undervalued.',
            'EV/EE Ratio',
            '5Y Average',
            {
              max: evEeMax,
              min: evEeMin,
              current: evEeCurrent,
              avg: evEeAvg,
              upper: evEeUpper,
              lower: evEeLower
            }
          )}

          {renderValuationChart(
            evIcData,
            'Enterprise Value / Invested Capital',
            'Measures how efficiently the market values the company\'s invested capital, providing insights into market expectations for future returns.',
            'EV/IC Ratio',
            '5Y Average',
            {
              max: evIcMax,
              min: evIcMin,
              current: evIcCurrent,
              avg: evIcAvg,
              upper: evIcUpper,
              lower: evIcLower
            }
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current EV/EE</span>
                <span className="font-mono text-sm">{evEeCurrent}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">5Y Avg EV/EE</span>
                <span className="font-mono text-sm">{evEeAvg}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">EV/EE StdDev</span>
                <span className="font-mono text-sm">±{(evEeUpper - evEeAvg).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current EV/IC</span>
                <span className="font-mono text-sm">{evIcCurrent}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">5Y Avg EV/IC</span>
                <span className="font-mono text-sm">{evIcAvg}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">EV/IC StdDev</span>
                <span className="font-mono text-sm">±{(evIcUpper - evIcAvg).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 