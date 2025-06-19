import React from 'react';
import { Card } from '@/components/ui/card';

interface FactorsTabProps {
  watchlistId: string;
  isDark: boolean;
}

const FactorsTab: React.FC<FactorsTabProps> = ({ watchlistId, isDark }) => {
  return (
    <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
      <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Factor Analysis
      </h3>
      
      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
        Factor analysis examines how your portfolio is exposed to various market factors like 
        value, growth, momentum, and quality.
      </p>
      
      <div className="mt-6 space-y-6">
        <div>
          <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Factor Exposures
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Value</span>
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>0.75</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Growth</span>
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>1.25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Momentum</span>
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>1.05</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Quality</span>
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>0.95</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Size (Small-Cap)</span>
                <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>0.65</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-pink-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mt-6`}>
          <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Factor Analysis Summary
          </h4>
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Your portfolio has strong exposures to Growth and Momentum factors, which have performed 
            well in recent market conditions. Consider increasing exposure to Value if you want more 
            balance, as this factor tends to perform better in different market environments.
          </p>
        </div>
        
        <div className="mt-6">
          <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Factor Performance (Last 12 Months)
          </h4>
          <div className="overflow-x-auto">
            <table className={`w-full ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <thead>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className="text-left py-2 px-4 font-medium">Factor</th>
                  <th className="text-right py-2 px-4 font-medium">1M</th>
                  <th className="text-right py-2 px-4 font-medium">3M</th>
                  <th className="text-right py-2 px-4 font-medium">6M</th>
                  <th className="text-right py-2 px-4 font-medium">1Y</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-2 px-4">Value</td>
                  <td className="text-right py-2 px-4 text-red-500">-1.2%</td>
                  <td className="text-right py-2 px-4 text-green-500">+2.3%</td>
                  <td className="text-right py-2 px-4 text-green-500">+4.1%</td>
                  <td className="text-right py-2 px-4 text-green-500">+7.2%</td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-2 px-4">Growth</td>
                  <td className="text-right py-2 px-4 text-green-500">+2.8%</td>
                  <td className="text-right py-2 px-4 text-green-500">+5.3%</td>
                  <td className="text-right py-2 px-4 text-green-500">+10.2%</td>
                  <td className="text-right py-2 px-4 text-green-500">+18.5%</td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-2 px-4">Momentum</td>
                  <td className="text-right py-2 px-4 text-green-500">+3.1%</td>
                  <td className="text-right py-2 px-4 text-green-500">+4.2%</td>
                  <td className="text-right py-2 px-4 text-green-500">+8.7%</td>
                  <td className="text-right py-2 px-4 text-green-500">+15.3%</td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-2 px-4">Quality</td>
                  <td className="text-right py-2 px-4 text-green-500">+1.5%</td>
                  <td className="text-right py-2 px-4 text-green-500">+3.2%</td>
                  <td className="text-right py-2 px-4 text-green-500">+6.1%</td>
                  <td className="text-right py-2 px-4 text-green-500">+11.2%</td>
                </tr>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="py-2 px-4">Size (Small-Cap)</td>
                  <td className="text-right py-2 px-4 text-red-500">-0.8%</td>
                  <td className="text-right py-2 px-4 text-red-500">-1.5%</td>
                  <td className="text-right py-2 px-4 text-green-500">+3.2%</td>
                  <td className="text-right py-2 px-4 text-green-500">+5.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FactorsTab; 