import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OverviewTabProps {
  watchlist: any;
  isDark: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ watchlist, isDark }) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sector Allocation */}
      <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Sector Allocation
        </h3>
        
        <div className="space-y-4">
          {(watchlist.sectorBreakdown || []).map((sector: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {sector.sector}
                </span>
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {sector.weight.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${sector.weight}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Portfolio Statistics */}
      <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Portfolio Statistics
        </h3>
        
        <div className={`grid grid-cols-1 gap-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="flex justify-between border-b pb-2">
            <span>Total Market Value:</span>
            <span className="font-medium">{formatCurrency(watchlist.marketValue || 0)}</span>
          </div>
          
          <div className="flex justify-between border-b pb-2">
            <span>Average P/E Ratio:</span>
            <span className="font-medium">{(watchlist.averageMetrics?.peRatio || 0).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between border-b pb-2">
            <span>Dividend Yield:</span>
            <span className="font-medium">{(watchlist.averageMetrics?.dividendYield || 0).toFixed(2)}%</span>
          </div>
          
          <div className="flex justify-between border-b pb-2">
            <span>Beta:</span>
            <span className="font-medium">{(watchlist.averageMetrics?.beta || 0).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between border-b pb-2">
            <span>Sharpe Ratio:</span>
            <span className="font-medium">{(watchlist.riskMetrics?.sharpeRatio || 0).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between border-b pb-2">
            <span>Annual Volatility:</span>
            <span className="font-medium">{(watchlist.riskMetrics?.annualVolatility || 0).toFixed(2)}%</span>
          </div>
          
          <div className="flex justify-between">
            <span>Max Drawdown:</span>
            <span className="font-medium">{(watchlist.riskMetrics?.maxDrawdown || 0).toFixed(2)}%</span>
          </div>
        </div>
      </Card>
      
      {/* Top Performers */}
      <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Top Performers
        </h3>
        
        <div className="space-y-3">
          {(watchlist.topPerformers || []).slice(0, 5).map((stock: any, index: number) => (
            <div 
              key={index} 
              className={`flex justify-between items-center p-2 rounded ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="mr-3 text-xl font-bold text-gray-400">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stock.name}
                  </div>
                </div>
              </div>
              <div className="text-green-500 font-medium">
                +{stock.return.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Bottom Performers */}
      <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Bottom Performers
        </h3>
        
        <div className="space-y-3">
          {(watchlist.bottomPerformers || []).slice(0, 5).map((stock: any, index: number) => (
            <div 
              key={index} 
              className={`flex justify-between items-center p-2 rounded ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className="mr-3 text-xl font-bold text-gray-400">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stock.name}
                  </div>
                </div>
              </div>
              <div className="text-red-500 font-medium">
                {stock.return.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OverviewTab; 