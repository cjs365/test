'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/app/context/ThemeProvider';

interface Holding {
  symbol: string;
  name: string;
  weight: number;
  sector: string;
}

interface PortfolioSummaryProps {
  portfolioId: string;
  portfolioName: string;
  holdings: Holding[];
  metrics?: {
    totalReturn?: string;
    volatility?: string;
    sharpe?: string;
    beta?: string;
  };
}

export default function PortfolioSummary({ portfolioId, portfolioName, holdings, metrics }: PortfolioSummaryProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Sort holdings by weight (descending) to get top holdings
  const topHoldings = [...holdings].sort((a, b) => b.weight - a.weight).slice(0, 5);
  
  // Calculate sector allocations
  const sectorAllocations = holdings.reduce((acc, holding) => {
    acc[holding.sector] = (acc[holding.sector] || 0) + holding.weight;
    return acc;
  }, {} as Record<string, number>);
  
  // Get top 3 sectors
  const topSectors = Object.entries(sectorAllocations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([sector, weight]) => ({ sector, weight }));

  return (
    <div className="space-y-3">
      {/* Portfolio summary header */}
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-medium">{portfolioName}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{holdings.length} holdings</p>
        </div>
        {metrics && (
          <div className="text-right">
            {metrics.totalReturn && (
              <p className={`text-sm font-medium ${parseFloat(metrics.totalReturn) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {metrics.totalReturn}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Top holdings */}
      <div>
        <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">Top 5 Holdings</p>
        <div className="grid grid-cols-2 gap-1">
          {topHoldings.map(holding => (
            <div key={holding.symbol} className="flex items-center justify-between text-xs p-1 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="flex items-center">
                <span className="font-mono w-12">{holding.symbol}</span>
                <span className="truncate max-w-[100px]">{holding.name}</span>
              </div>
              <span className="font-medium">{holding.weight.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector allocation */}
      <div>
        <p className="text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">Top Sectors</p>
        <div className="flex flex-wrap gap-1">
          {topSectors.map(({ sector, weight }) => (
            <Badge key={sector} variant="outline" className={`text-xs ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
              {sector}: {weight.toFixed(1)}%
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-4 gap-2 text-center border-t pt-2 border-gray-100 dark:border-gray-800">
          {metrics.volatility && (
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Volatility</p>
              <p className="text-xs font-medium">{metrics.volatility}</p>
            </div>
          )}
          {metrics.sharpe && (
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Sharpe</p>
              <p className="text-xs font-medium">{metrics.sharpe}</p>
            </div>
          )}
          {metrics.beta && (
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Beta</p>
              <p className="text-xs font-medium">{metrics.beta}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 