import React from 'react';
import { Card } from '@/components/ui/card';

interface HoldingsTabProps {
  watchlist: any;
  isDark: boolean;
}

const HoldingsTab: React.FC<HoldingsTabProps> = ({ watchlist, isDark }) => {
  return (
    <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Portfolio Holdings ({watchlist.stocks.length} stocks)
      </h3>
      
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          <thead>
            <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <th className="text-left py-3 px-4 font-medium">Symbol</th>
              <th className="text-left py-3 px-4 font-medium">Company</th>
              <th className="text-right py-3 px-4 font-medium">Weight</th>
              <th className="text-right py-3 px-4 font-medium">Price</th>
            </tr>
          </thead>
          
          <tbody>
            {watchlist.stocks.map((stock: any) => (
              <tr 
                key={stock.symbol} 
                className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                <td className="py-3 px-4">{stock.name}</td>
                <td className="py-3 px-4 text-right">{stock.weight.toFixed(2)}%</td>
                <td className="py-3 px-4 text-right">${stock.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default HoldingsTab; 