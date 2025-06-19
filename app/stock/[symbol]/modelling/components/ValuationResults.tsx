import React from 'react';
import { Button } from '@/components/ui/button';
import { ValuationResult } from '@/mock-data/stock/stockService';

interface ValuationResultsProps {
  enterpriseValue: number | null;
  equityValue: number | null;
  pricePerShare: number | null;
  upside: string;
  calculationSteps: {
    name: string;
    value: string;
    calculation: string;
  }[];
  isSubmitting: boolean;
  apiResult: ValuationResult | null;
  apiError: string | null;
}

export default function ValuationResults({
  enterpriseValue,
  equityValue,
  pricePerShare,
  upside,
  calculationSteps,
  isSubmitting,
  apiResult,
  apiError
}: ValuationResultsProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 mt-6">
      <h3 className="text-lg font-semibold mb-3">Valuation Results</h3>
      
      {/* Loading indicator */}
      {isSubmitting && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Calculating valuation...</span>
        </div>
      )}
      
      {/* Error message */}
      {apiError && !isSubmitting && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded mb-4 text-sm">
          <p className="text-blue-600 dark:text-blue-400 font-medium">
            {apiError}
          </p>
        </div>
      )}
      
      {/* Results */}
      {!isSubmitting && calculationSteps.length > 0 && (
        <div className="space-y-4">
          {/* Results table */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calculationSteps.map((step, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                <div className="text-sm text-gray-500 dark:text-gray-400">{step.name}</div>
                <div className="text-xl font-bold">{step.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.calculation}</div>
              </div>
            ))}
            
            {/* Upside potential */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded md:col-span-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">Upside Potential</div>
              <div className={`text-xl font-bold ${parseFloat(upside) > 0 ? 'text-green-600' : parseFloat(upside) < 0 ? 'text-red-600' : ''}`}>
                {upside !== 'N/A' ? `${upside}%` : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Calculated based on current market price and estimated fair value
              </div>
            </div>
          </div>
          
          {/* Additional notes */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <p className="mb-1">
              <span className="font-semibold">Note:</span> These results are based on the input assumptions and should be used as one of many valuation methods.
            </p>
            <p>
              <span className="font-semibold">Disclaimer:</span> This is not financial advice. Always conduct your own research before making investment decisions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 