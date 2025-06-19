import React from 'react';
import { Card } from '@/components/ui/card';

interface AttributionTabProps {
  watchlistId: string;
  isDark: boolean;
}

const AttributionTab: React.FC<AttributionTabProps> = ({ watchlistId, isDark }) => {
  return (
    <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Performance Attribution
      </h3>
      
      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
        Attribution analysis shows how different components (stocks, sectors, factors) 
        contributed to the overall performance of your portfolio.
      </p>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Top Contributors
          </h4>
          <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex justify-between">
              <span>AAPL</span>
              <span className="text-green-500">+2.34%</span>
            </li>
            <li className="flex justify-between">
              <span>MSFT</span>
              <span className="text-green-500">+1.82%</span>
            </li>
            <li className="flex justify-between">
              <span>NVDA</span>
              <span className="text-green-500">+1.45%</span>
            </li>
          </ul>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sector Impact
          </h4>
          <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex justify-between">
              <span>Technology</span>
              <span className="text-green-500">+3.56%</span>
            </li>
            <li className="flex justify-between">
              <span>Healthcare</span>
              <span className="text-green-500">+1.23%</span>
            </li>
            <li className="flex justify-between">
              <span>Financials</span>
              <span className="text-red-500">-0.87%</span>
            </li>
          </ul>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Factor Impact
          </h4>
          <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <li className="flex justify-between">
              <span>Momentum</span>
              <span className="text-green-500">+2.11%</span>
            </li>
            <li className="flex justify-between">
              <span>Growth</span>
              <span className="text-green-500">+1.76%</span>
            </li>
            <li className="flex justify-between">
              <span>Value</span>
              <span className="text-red-500">-0.45%</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default AttributionTab; 