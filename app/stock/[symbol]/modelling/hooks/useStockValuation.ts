import { useState, useEffect } from 'react';
import { generateMockData } from '@/mock-data/stock/stockData';
import { TableData, ValuationVariables } from '../types';

interface ApiResponse {
  status: string;
  ric: string;
  data: TableData;
  headers: number[];
  valuation_parameters: ValuationVariables;
}

interface UseStockValuationResult {
  headers: string[];
  tableData: TableData;
  valuationVars: ValuationVariables;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and process stock valuation data
 */
export function useStockValuation(symbol: string): UseStockValuationResult {
  const [headers, setHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<TableData>({});
  const [valuationVars, setValuationVars] = useState<ValuationVariables>({
    'Shareholder ratio': 100.0,
    'Discount rate': 8,
    'Total debt': 0,
    'Market investment': 0,
    'Current market cap (mn)': 0,
    'Interim conversion': 0.33
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Function to fetch data that can be called manually
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch real data from API
      const response = await fetch(`/api/v1/stock/${symbol}/modelling`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const apiData: ApiResponse = await response.json();
      
      if (apiData.status !== 'success') {
        throw new Error('API returned error status');
      }
      
      // Convert numeric headers to strings
      const stringHeaders = apiData.headers.map(year => year.toString());
      
      setHeaders(stringHeaders);
      setTableData(apiData.data);
      setValuationVars(apiData.valuation_parameters);
      setUseMockData(false);
    } catch (err: any) {
      // Log the error but don't fail - use mock data instead
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching data, falling back to mock data:', errorMessage);
      setError(`API Error: ${errorMessage}`);
      
      // Always generate and use mock data when API fails
      console.log('Generating mock data for', symbol);
      const mockData = generateMockData(symbol);
      
      setHeaders(mockData.headers);
      setTableData(mockData.tableData);
      setValuationVars(mockData.valuationVars);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount or when symbol changes
  useEffect(() => {
    fetchData();
  }, [symbol]);

  return {
    headers,
    tableData,
    valuationVars,
    isLoading,
    error,
    refetch: fetchData
  };
} 