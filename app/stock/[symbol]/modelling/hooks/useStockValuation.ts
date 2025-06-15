import { useState, useEffect } from 'react';
import { fetchStockValuationData, processStockValuationData } from '../services/api';
import { generateMockData } from '../services/mockData';
import { TableData, ValuationVariables } from '../types';

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
      const apiData = await fetchStockValuationData(symbol);
      const processedData = processStockValuationData(apiData);
      
      setHeaders(processedData.headers);
      setTableData(processedData.tableData);
      setValuationVars(processedData.valuationVars);
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