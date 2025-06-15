import { useState, useEffect } from 'react';
import { TableData, ValuationVariables, CalculationStep } from '../types';
import { 
  calculateEnterpriseValue, 
  calculateEquityValue, 
  calculatePricePerShare 
} from '../utils/calculations';
import { formatLargeNumber } from '../utils/formatters';
import { calculateStockValuation, ValuationResult } from '../services/api';
import { generateMockValuationResult } from '../services/mockData';

interface ValuationResults {
  enterpriseValue: number | null;
  equityValue: number | null;
  pricePerShare: number | null;
  upside: string;
  calculationSteps: CalculationStep[];
}

interface UseValuationCalculatorResult extends ValuationResults {
  calculateValuationResults: () => void;
  submitValuation: (symbol: string, customTableData?: TableData, customValuationVars?: ValuationVariables) => Promise<ValuationResult | null>;
  isSubmitting: boolean;
  apiResult: ValuationResult | null;
  apiError: string | null;
}

/**
 * Custom hook to handle valuation calculations
 */
export function useValuationCalculator(
  tableData: TableData,
  valuationVars: ValuationVariables,
  headers: string[],
  isLoading: boolean
): UseValuationCalculatorResult {
  const [enterpriseValue, setEnterpriseValue] = useState<number | null>(null);
  const [equityValue, setEquityValue] = useState<number | null>(null);
  const [pricePerShare, setPricePerShare] = useState<number | null>(null);
  const [upside, setUpside] = useState<string>('0.0');
  const [calculationSteps, setCalculationSteps] = useState<CalculationStep[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<ValuationResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [usedMockData, setUsedMockData] = useState(false);

  // Debug log for received data
  useEffect(() => {
    if (!isLoading && headers.length > 0) {
      console.log('useValuationCalculator received tableData:', tableData);
      
      // Check forecast metrics specifically
      const forecastYears = headers.slice(-5);
      console.log('useValuationCalculator forecast years:', forecastYears);
      
      // Log the forecast values for the key metrics
      ['revenue_gr', 'earnings_margin', 'ic_gr'].forEach(metric => {
        if (tableData[metric]) {
          console.log(`useValuationCalculator ${metric} forecast values:`, 
            forecastYears.map(year => ({ 
              year, 
              value: tableData[metric]?.[year] || 0 
            }))
          );
        } else {
          console.log(`useValuationCalculator ${metric} is undefined or null in tableData`);
        }
      });
    }
  }, [tableData, headers, isLoading]);

  // Calculate valuation results
  const calculateValuationResults = () => {
    if (!tableData || !tableData.fcf || Object.keys(tableData.fcf).length === 0) {
      console.log("No data available for valuation calculation");
      return;
    }

    try {
      console.log('Calculating valuation with tableData:', tableData);
      console.log('FCF data:', tableData.fcf);
      
      // Calculate enterprise value
      const newEnterpriseValue = calculateEnterpriseValue(valuationVars, tableData.fcf, headers);
      
      // Calculate equity value (only if enterprise value is available)
      const newEquityValue = calculateEquityValue(newEnterpriseValue, valuationVars);
      
      // Calculate price per share
      const newPricePerShare = calculatePricePerShare(newEquityValue, valuationVars);
      
      // Calculate upside (if market cap is provided)
      let newUpside = "0.0";
      if (valuationVars['Current market cap (mn)'] && newEquityValue) {
        const upsideVal = (newEquityValue / valuationVars['Current market cap (mn)'] - 1) * 100;
        newUpside = upsideVal.toFixed(1);
      }
      
      console.log('Valuation results:', {
        enterpriseValue: newEnterpriseValue,
        equityValue: newEquityValue,
        pricePerShare: newPricePerShare,
        upside: newUpside
      });
      
      // Generate calculation steps for showing the math
      const newCalculationSteps: CalculationStep[] = [
        {
          label: "Enterprise Value",
          value: `$${formatLargeNumber(newEnterpriseValue).formatted}`,
          calculation: "Sum of discounted future Free Cash Flows"
        },
        {
          label: "Equity Value",
          value: `$${formatLargeNumber(newEquityValue).formatted}`,
          calculation: `Enterprise Value ($${formatLargeNumber(newEnterpriseValue).formatted}) - Total Debt ($${formatLargeNumber(Number(valuationVars['Total debt']) || 0).formatted}) + Market Investments ($${formatLargeNumber(Number(valuationVars['Market investment']) || 0).formatted})`
        },
        {
          label: "Price Per Share",
          value: `$${newPricePerShare?.toFixed(2) || '0.00'}`,
          calculation: `Equity Value / Outstanding Shares × Shareholder Ratio (${valuationVars['Shareholder ratio']}%)`
        }
      ];
      
      // Update state with calculated values
      setEnterpriseValue(newEnterpriseValue);
      setEquityValue(newEquityValue);
      setPricePerShare(newPricePerShare);
      setUpside(newUpside);
      setCalculationSteps(newCalculationSteps);
    } catch (err) {
      console.error("Error calculating valuation:", err);
    }
  };

  // Submit valuation data to API
  const submitValuation = async (symbol: string, customTableData?: TableData, customValuationVars?: ValuationVariables): Promise<ValuationResult | null> => {
    setIsSubmitting(true);
    setApiError(null);
    setUsedMockData(false);
    
    // Use customTableData if provided, otherwise use tableData
    const dataToSubmit = customTableData || tableData;
    // Use customValuationVars if provided, otherwise use valuationVars
    const varsToSubmit = customValuationVars || valuationVars;
    
    try {
      console.log('Submitting valuation with data:', dataToSubmit);
      console.log('Submitting valuation with variables:', varsToSubmit);
      
      try {
        // Call the API service with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const result = await calculateStockValuation(symbol, dataToSubmit, varsToSubmit);
        clearTimeout(timeoutId);
        
        // Update state with API results
        setApiResult(result);
        
        // Update the enterprise value and upside from API result
        if (result.result['Enterprise Value']) {
          setEnterpriseValue(result.result['Enterprise Value']);
          
          // Calculate equity value based on the new enterprise value
          const newEquityValue = calculateEquityValue(result.result['Enterprise Value'], varsToSubmit);
          setEquityValue(newEquityValue);
          
          // Calculate price per share based on the new equity value
          const newPricePerShare = calculatePricePerShare(newEquityValue, varsToSubmit);
          setPricePerShare(newPricePerShare);
          
          // Update calculation steps
          setCalculationSteps(prev => {
            const newSteps = [...prev];
            newSteps[0] = {
              ...newSteps[0],
              value: `$${formatLargeNumber(result.result['Enterprise Value']).formatted}`,
              calculation: "API calculated Enterprise Value"
            };
            
            // Update equity value step
            newSteps[1] = {
              ...newSteps[1],
              value: `$${formatLargeNumber(newEquityValue).formatted}`,
              calculation: `Enterprise Value ($${formatLargeNumber(result.result['Enterprise Value']).formatted}) - Total Debt ($${formatLargeNumber(Number(varsToSubmit['Total debt']) || 0).formatted}) + Market Investments ($${formatLargeNumber(Number(varsToSubmit['Market investment']) || 0).formatted})`
            };
            
            // Update price per share step
            newSteps[2] = {
              ...newSteps[2],
              value: `$${newPricePerShare?.toFixed(2) || '0.00'}`,
              calculation: `Equity Value / Outstanding Shares × Shareholder Ratio (${varsToSubmit['Shareholder ratio']}%)`
            };
            
            return newSteps;
          });
        }
        
        if (result.result['Calculated upside']) {
          setUpside(result.result['Calculated upside'].toString());
        }
        
        return result;
      } catch (apiError: any) {
        console.error("API error, using mock valuation result:", apiError);
        
        // Generate mock valuation result
        const mockResult = generateMockValuationResult();
        setApiResult(mockResult);
        setUsedMockData(true);
        
        // Update the enterprise value and upside from mock result
        if (mockResult.result['Enterprise Value']) {
          setEnterpriseValue(mockResult.result['Enterprise Value']);
          
          // Calculate equity value based on the mock enterprise value
          const newEquityValue = calculateEquityValue(mockResult.result['Enterprise Value'], varsToSubmit);
          setEquityValue(newEquityValue);
          
          // Calculate price per share based on the new equity value
          const newPricePerShare = calculatePricePerShare(newEquityValue, varsToSubmit);
          setPricePerShare(newPricePerShare);
          
          // Update calculation steps
          setCalculationSteps(prev => {
            const newSteps = [...prev];
            newSteps[0] = {
              ...newSteps[0],
              value: `$${formatLargeNumber(mockResult.result['Enterprise Value']).formatted}`,
              calculation: "Mock calculated Enterprise Value"
            };
            
            // Update equity value step
            newSteps[1] = {
              ...newSteps[1],
              value: `$${formatLargeNumber(newEquityValue).formatted}`,
              calculation: `Enterprise Value ($${formatLargeNumber(mockResult.result['Enterprise Value']).formatted}) - Total Debt ($${formatLargeNumber(Number(varsToSubmit['Total debt']) || 0).formatted}) + Market Investments ($${formatLargeNumber(Number(varsToSubmit['Market investment']) || 0).formatted})`
            };
            
            // Update price per share step
            newSteps[2] = {
              ...newSteps[2],
              value: `$${newPricePerShare?.toFixed(2) || '0.00'}`,
              calculation: `Equity Value / Outstanding Shares × Shareholder Ratio (${varsToSubmit['Shareholder ratio']}%)`
            };
            
            return newSteps;
          });
        }
        
        if (mockResult.result['Calculated upside']) {
          setUpside(mockResult.result['Calculated upside'].toString());
        }
        
        // Set a warning but don't prevent the user from seeing results
        setApiError(`Using mock data: ${apiError.message || 'API unavailable'}`);
        
        return mockResult;
      }
    } catch (err: any) {
      console.error("Error submitting valuation:", err);
      setApiError(err instanceof Error ? err.message : "An unknown error occurred");
      
      // If we haven't already used mock data, use it as a final fallback
      if (!usedMockData) {
        const mockResult = generateMockValuationResult();
        setApiResult(mockResult);
        setUsedMockData(true);
        
        if (mockResult.result['Enterprise Value']) {
          setEnterpriseValue(mockResult.result['Enterprise Value']);
          
          // Calculate equity value based on the mock enterprise value
          const newEquityValue = calculateEquityValue(mockResult.result['Enterprise Value'], varsToSubmit);
          setEquityValue(newEquityValue);
          
          // Calculate price per share based on the new equity value
          const newPricePerShare = calculatePricePerShare(newEquityValue, varsToSubmit);
          setPricePerShare(newPricePerShare);
          
          setCalculationSteps(prev => {
            const newSteps = [...prev];
            newSteps[0] = {
              ...newSteps[0],
              value: `$${formatLargeNumber(mockResult.result['Enterprise Value']).formatted}`,
              calculation: "Mock calculated Enterprise Value (fallback)"
            };
            
            // Update equity value step
            newSteps[1] = {
              ...newSteps[1],
              value: `$${formatLargeNumber(newEquityValue).formatted}`,
              calculation: `Enterprise Value ($${formatLargeNumber(mockResult.result['Enterprise Value']).formatted}) - Total Debt ($${formatLargeNumber(Number(varsToSubmit['Total debt']) || 0).formatted}) + Market Investments ($${formatLargeNumber(Number(varsToSubmit['Market investment']) || 0).formatted})`
            };
            
            // Update price per share step
            newSteps[2] = {
              ...newSteps[2],
              value: `$${newPricePerShare?.toFixed(2) || '0.00'}`,
              calculation: `Equity Value / Outstanding Shares × Shareholder Ratio (${varsToSubmit['Shareholder ratio']}%)`
            };
            
            return newSteps;
          });
        }
        
        if (mockResult.result['Calculated upside']) {
          setUpside(mockResult.result['Calculated upside'].toString());
        }
        
        return mockResult;
      }
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate valuation when data changes
  useEffect(() => {
    if (!isLoading && headers.length > 0 && Object.keys(tableData).length > 0) {
      calculateValuationResults();
    }
  }, [tableData, valuationVars, isLoading, headers]);

  return {
    enterpriseValue,
    equityValue,
    pricePerShare,
    upside,
    calculationSteps,
    calculateValuationResults,
    submitValuation,
    isSubmitting,
    apiResult,
    apiError
  };
} 