import { TableData, ValuationVariables } from '@/app/stock/[symbol]/modelling/types';
import { generateMockData, generateMockSensitivityData, generateMockValuationResult } from './stockData';

// Mock function to simulate fetching stock valuation data from API
export async function fetchStockValuationData(symbol: string): Promise<any> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock data
  const mockData = generateMockData(symbol);
  
  // Return in a format that mimics API response
  return {
    status: 'success',
    data: {
      headers: mockData.headers,
      tableData: mockData.tableData,
      valuationVars: mockData.valuationVars
    }
  };
}

// Process the API response data
export function processStockValuationData(apiResponse: any): {
  headers: string[];
  tableData: TableData;
  valuationVars: ValuationVariables;
} {
  // If the API response is in the expected format, extract the data
  if (apiResponse && apiResponse.status === 'success' && apiResponse.data) {
    return {
      headers: apiResponse.data.headers,
      tableData: apiResponse.data.tableData,
      valuationVars: apiResponse.data.valuationVars
    };
  }
  
  // If the API response is not in the expected format, throw an error
  throw new Error('Invalid API response format');
}

// Mock function to simulate fetching sensitivity data from API
export interface SensitivityResult {
  status: string;
  matrix: string;
}

export async function fetchSensitivityData(
  symbol: string, 
  tableData: TableData, 
  valuationVars: ValuationVariables
): Promise<SensitivityResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock sensitivity data
  return generateMockSensitivityData();
}

// Define the ValuationResult interface
export interface ValuationResult {
  status: string;
  ric: string;
  result: {
    'Enterprise Value': number;
    'Calculated upside': number;
  }
}

// Mock function to calculate stock valuation
export async function calculateStockValuation(
  symbol: string,
  tableData: TableData,
  valuationVars: ValuationVariables
): Promise<ValuationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate mock valuation result
  return generateMockValuationResult();
}

// Mock function to simulate submitting valuation results to API
export async function submitValuationResults(
  symbol: string,
  enterpriseValue: number,
  equityValue: number,
  pricePerShare: number,
  upside: number
): Promise<ValuationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock response
  return {
    status: 'success',
    ric: symbol,
    result: {
      'Enterprise Value': enterpriseValue,
      'Calculated upside': upside
    }
  };
} 