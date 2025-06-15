'use client';

import { useState } from 'react';
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
    marketsId: string;
  };
};

export default function MarketsValuationPage({ params }: Props) {
  const marketsId = params.marketsId.charAt(0).toUpperCase() + params.marketsId.slice(1);

  // Generate mock data with monthly intervals for EV/EBITDA
  function generateMockEvEeData() {
    const startYear = 2019;
    const endYear = 2023;
    const average = 14.5; // Higher for industry average
    const stdDev = 1.8; // standard deviation
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

  // Generate mock data with monthly intervals for P/B
  function generateMockPbData() {
    const startYear = 2019;
    const endYear = 2023;
    const average = 3.2; // Industry P/B
    const stdDev = 0.4; // standard deviation
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

  // Generate mock data with monthly intervals for P/E
  function generateMockPeData() {
    const startYear = 2019;
    const endYear = 2023;
    const average = 22.5; // Industry P/E
    const stdDev = 2.8; // standard deviation
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
  const pbData = generateMockPbData();
  const peData = generateMockPeData();

  // Calculate statistics for EV/EBITDA
  const evEeValues = evEeData.map(item => item.value);
  const evEeMax = Math.max(...evEeValues).toFixed(2);
  const evEeMin = Math.min(...evEeValues).toFixed(2);
  const evEeCurrent = evEeValues[evEeValues.length - 1].toFixed(2);
  const evEeAvg = evEeData[0].average;
  const evEeUpper = evEeData[0].upper;
  const evEeLower = evEeData[0].lower;

  // Calculate statistics for P/B
  const pbValues = pbData.map(item => item.value);
  const pbMax = Math.max(...pbValues).toFixed(2);
  const pbMin = Math.min(...pbValues).toFixed(2);
  const pbCurrent = pbValues[pbValues.length - 1].toFixed(2);
  const pbAvg = pbData[0].average;
  const pbUpper = pbData[0].upper;
  const pbLower = pbData[0].lower;

  // Calculate statistics for P/E
  const peValues = peData.map(item => item.value);
  const peMax = Math.max(...peValues).toFixed(2);
  const peMin = Math.min(...peValues).toFixed(2);
  const peCurrent = peValues[peValues.length - 1].toFixed(2);
  const peAvg = peData[0].average;
  const peUpper = peData[0].upper;
  const peLower = peData[0].lower;

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
              <Legend 
                verticalAlign="top"
                height={36}
              />
              
              <ReferenceLine 
                y={stats.avg} 
                stroke="#9CA3AF" 
                strokeDasharray="3 3" 
                strokeWidth={2}
              >
                <Label 
                  value={`Avg: ${stats.avg}`} 
                  position="right" 
                  fill="#9CA3AF" 
                  fontSize={12}
                />
              </ReferenceLine>
              
              <ReferenceLine 
                y={stats.upper} 
                stroke="#9CA3AF" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              >
                <Label 
                  value={`+1σ: ${stats.upper}`} 
                  position="right" 
                  fill="#9CA3AF" 
                  fontSize={12}
                />
              </ReferenceLine>
              
              <ReferenceLine 
                y={stats.lower} 
                stroke="#9CA3AF" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              >
                <Label 
                  value={`-1σ: ${stats.lower}`} 
                  position="right" 
                  fill="#9CA3AF" 
                  fontSize={12}
                />
              </ReferenceLine>
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563EB" 
                strokeWidth={2}
                name={valueLabel}
                dot={false}
                activeDot={{ r: 6 }}
              />
              
              {/* Custom dots for max, min and current */}
              <Line 
                type="monotone" 
                dataKey="value"
                stroke="transparent"
                dot={<CustomizedDot />}
                isAnimationActive={false}
                legendType="none"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
          <div className="p-2 border rounded">
            <div className="text-gray-600">Current</div>
            <div className="font-bold">{stats.current}</div>
          </div>
          <div className="p-2 border rounded">
            <div className="text-gray-600">Average</div>
            <div className="font-bold">{stats.avg.toFixed(2)}</div>
          </div>
          <div className="p-2 border rounded">
            <div className="text-gray-600">Max (5Y)</div>
            <div className="font-bold text-green-600">{stats.max}</div>
          </div>
          <div className="p-2 border rounded">
            <div className="text-gray-600">Min (5Y)</div>
            <div className="font-bold text-red-600">{stats.min}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-9">
        <div className="pb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">Valuation Analysis</h2>
            <div className="text-xs text-gray-500">Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          
          {/* Valuation Charts */}
          <div className="space-y-8">
            {renderValuationChart(
              evEeData,
              "EV/EBITDA",
              "Enterprise Value to Earnings Before Interest, Taxes, Depreciation, and Amortization ratio measures the value of a business relative to its operating profit. This ratio is used to compare companies within the same industry.",
              "EV/EBITDA",
              "Industry Average",
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
              pbData,
              "Price to Book (P/B) Ratio",
              "Price to Book ratio compares a company's market price to its book value. It indicates whether a stock is undervalued or overvalued relative to its asset value.",
              "P/B Ratio",
              "Industry Average",
              {
                max: pbMax,
                min: pbMin,
                current: pbCurrent,
                avg: pbAvg,
                upper: pbUpper,
                lower: pbLower
              }
            )}
            
            {renderValuationChart(
              peData,
              "Price to Earnings (P/E) Ratio",
              "Price to Earnings ratio measures a company's current share price relative to its per-share earnings. Higher P/E ratios indicate investors expect higher earnings growth in the future.",
              "P/E Ratio",
              "Industry Average",
              {
                max: peMax,
                min: peMin,
                current: peCurrent,
                avg: peAvg,
                upper: peUpper,
                lower: peLower
              }
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Valuation Key Metrics */}
      <div className="lg:col-span-3">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-bold mb-3">Valuation Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">P/E Ratio</span>
              <span className="font-mono text-xs">{peCurrent} <span className="text-gray-400">vs {peAvg.toFixed(1)} avg</span></span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Forward P/E</span>
              <span className="font-mono text-xs">{(Number(peCurrent) * 0.92).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">P/B Ratio</span>
              <span className="font-mono text-xs">{pbCurrent} <span className="text-gray-400">vs {pbAvg.toFixed(1)} avg</span></span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">EV/EBITDA</span>
              <span className="font-mono text-xs">{evEeCurrent} <span className="text-gray-400">vs {evEeAvg.toFixed(1)} avg</span></span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Dividend Yield</span>
              <span className="font-mono text-xs">1.72%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Price/Sales</span>
              <span className="font-mono text-xs">3.4</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Price/FCF</span>
              <span className="font-mono text-xs">21.3</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">PEG Ratio</span>
              <span className="font-mono text-xs">1.82</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">EV/Revenue</span>
              <span className="font-mono text-xs">3.8</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">EV/EBIT</span>
              <span className="font-mono text-xs">17.2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 