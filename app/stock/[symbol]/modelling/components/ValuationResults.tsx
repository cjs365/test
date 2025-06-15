import { useState } from 'react';
import { formatLargeNumber } from '../utils/formatters';
import { CalculationStep, ValuationVariables } from '../types';
import { ValuationResult } from '../services/api';

interface ValuationResultsProps {
  enterpriseValue: number | null;
  equityValue: number | null;
  pricePerShare: number | null;
  upside: string;
  calculationSteps: CalculationStep[];
  valuationVars: ValuationVariables;
  handleValuationVarChange: (key: keyof ValuationVariables, value: string) => void;
  apiResult?: ValuationResult | null;
  isFromApi?: boolean;
}

const ValuationResults = ({
  enterpriseValue,
  equityValue,
  pricePerShare,
  upside,
  calculationSteps,
  valuationVars,
  handleValuationVarChange,
  apiResult,
  isFromApi = false
}: ValuationResultsProps) => {
  const [isValuationExpanded, setIsValuationExpanded] = useState(false);

  // Use API result values if available
  const displayEnterpriseValue = apiResult?.result['Enterprise Value'] ?? enterpriseValue;
  const displayUpside = apiResult?.result['Calculated upside']?.toString() ?? upside;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Valuation Results</h3>
          <div className="flex items-center">
            <button
              onClick={() => setIsValuationExpanded(!isValuationExpanded)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              {isValuationExpanded ? 'Hide Details' : 'Show Details'}
              <svg
                className={`ml-1 w-4 h-4 transform transition-transform ${isValuationExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Enterprise Value</span>
            <span className={`text-sm font-medium ${isFromApi ? 'text-blue-600' : ''}`}>
              {displayEnterpriseValue ? formatLargeNumber(displayEnterpriseValue).formatted : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Equity Value</span>
            <span className="text-sm font-medium">{equityValue ? formatLargeNumber(equityValue).formatted : 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price per Share</span>
            <span className="text-sm font-medium">{pricePerShare ? `$${pricePerShare.toFixed(2)}` : 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Upside/Downside</span>
            <div className={`px-3 py-1 rounded text-white font-medium ${Number(displayUpside) >= 0 ? 'bg-green-500' : 'bg-red-500'} ${isFromApi ? 'ring-2 ring-blue-300' : ''}`}>
              {Number(displayUpside) >= 0 ? '+' : ''}{displayUpside} % Upside
            </div>
          </div>
        </div>
        
        {/* Calculation Details Table */}
        {isValuationExpanded && calculationSteps.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Calculation Details</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Label</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Value</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Calculation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calculationSteps.map((step, index) => (
                    <tr key={index} className={index === calculationSteps.length - 1 ? 'bg-blue-50' : ''}>
                      <td className="px-3 py-2 text-xs">{step.label}</td>
                      <td className="px-3 py-2 text-xs text-right font-medium">
                        {step.value}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-500">{step.calculation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValuationResults; 