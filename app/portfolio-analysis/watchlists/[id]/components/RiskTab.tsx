import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RiskTabProps {
  watchlistId: string;
  isDark: boolean;
}

const RiskTab: React.FC<RiskTabProps> = ({ watchlistId, isDark }) => {
  return (
    <div className="space-y-6">
      <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Risk Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Volatility
              </h4>
              <Badge variant={isDark ? 'outline' : 'secondary'}>Moderate</Badge>
            </div>
            <div className="text-3xl font-bold mb-2 text-amber-500">15.2%</div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Annual standard deviation of returns
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              vs. S&P 500: 14.3%
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Maximum Drawdown
              </h4>
              <Badge variant={isDark ? 'outline' : 'secondary'}>Moderate</Badge>
            </div>
            <div className="text-3xl font-bold mb-2 text-amber-500">-18.4%</div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Largest peak-to-trough decline
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              vs. S&P 500: -19.7%
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sharpe Ratio
              </h4>
              <Badge variant={isDark ? 'outline' : 'secondary'}>Good</Badge>
            </div>
            <div className="text-3xl font-bold mb-2 text-green-500">1.25</div>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Risk-adjusted return measure
            </p>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              vs. S&P 500: 1.08
            </p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Portfolio Beta
            </h4>
            <div className="flex items-center">
              <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center z-10 text-xs font-medium text-black dark:text-white">
                  1.12
                </div>
                <div className="absolute h-6 bg-blue-500 rounded-full" style={{ width: '56%' }}></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Less Volatile
              </span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                S&P 500 (1.0)
              </span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                More Volatile
              </span>
            </div>
            <p className={`mt-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your portfolio has slightly higher volatility than the overall market.
            </p>
          </div>
          
          <div>
            <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Diversification Score
            </h4>
            <div className="flex items-center">
              <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
                <div className="absolute inset-0 flex items-center justify-center z-10 text-xs font-medium text-black dark:text-white">
                  72/100
                </div>
                <div className="absolute h-6 bg-amber-500 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Concentrated
              </span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Balanced
              </span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Well Diversified
              </span>
            </div>
            <p className={`mt-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your portfolio has good diversification but could be improved with more exposure to other sectors.
            </p>
          </div>
        </div>
      </Card>
      
      <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Risk Concentration
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              TOP RISK CONTRIBUTORS
            </h4>
            <div className="overflow-x-auto">
              <table className={`w-full ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="text-left py-2 px-4 font-medium">Stock</th>
                    <th className="text-right py-2 px-4 font-medium">Weight</th>
                    <th className="text-right py-2 px-4 font-medium">Beta</th>
                    <th className="text-right py-2 px-4 font-medium">Risk Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-2 px-4">NVDA</td>
                    <td className="text-right py-2 px-4">8.5%</td>
                    <td className="text-right py-2 px-4">1.82</td>
                    <td className="text-right py-2 px-4">15.4%</td>
                  </tr>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-2 px-4">TSLA</td>
                    <td className="text-right py-2 px-4">5.2%</td>
                    <td className="text-right py-2 px-4">2.14</td>
                    <td className="text-right py-2 px-4">11.2%</td>
                  </tr>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-2 px-4">AMZN</td>
                    <td className="text-right py-2 px-4">7.3%</td>
                    <td className="text-right py-2 px-4">1.45</td>
                    <td className="text-right py-2 px-4">10.6%</td>
                  </tr>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-2 px-4">AAPL</td>
                    <td className="text-right py-2 px-4">9.1%</td>
                    <td className="text-right py-2 px-4">1.18</td>
                    <td className="text-right py-2 px-4">10.1%</td>
                  </tr>
                  <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="py-2 px-4">META</td>
                    <td className="text-right py-2 px-4">6.2%</td>
                    <td className="text-right py-2 px-4">1.36</td>
                    <td className="text-right py-2 px-4">8.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'} mt-6`}>
            <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Risk Analysis Summary
            </h4>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Your portfolio has slightly higher risk than the market, with technology stocks being the main contributors. 
              Consider adding more defensive sectors (utilities, consumer staples) to improve diversification and reduce 
              overall volatility.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskTab; 