import { TableData, ValuationVariables, SensitivityData, SensitivityPoint } from '../types';
import { calculateFCF, calculateGrowthRate } from '../utils/calculations';

// Define API response interfaces
export interface ApiResponse {
  status: string;
  ric: string;
  data: TableData;
  headers: number[];
  valuation_parameters: ValuationVariables;
}

export interface ValuationResult {
  status: string;
  ric: string;
  result: {
    'Enterprise Value'?: number;
    'Calculated upside'?: number | string;
    [key: string]: any;
  }
}

export interface SensitivityResult {
  status: string;
  matrix: string; // The matrix is returned as a JSON string
}

// Base API URL
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Timeout for API requests in milliseconds
const API_TIMEOUT = 5000;

/**
 * Helper function to fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  return response;
}

/**
 * Fetch stock valuation data for a specific symbol
 */
export async function fetchStockValuationData(symbol: string): Promise<ApiResponse> {
  console.log(`[API] Fetching stock valuation data for ${symbol}`);
  
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/stock_valuation/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(`API returned error status: ${data.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.error('[API] Error fetching stock data:', error);
    
    // Handle specific error types
    if (error instanceof TypeError) {
      throw new Error('Network error: API server may be down');
    } else if (error.name === 'AbortError') {
      throw new Error('Request timeout: API server is not responding');
    }
    
    // Re-throw the original error
    throw error;
  }
}

/**
 * Send valuation data to the API for calculation
 */
export async function calculateStockValuation(
  symbol: string, 
  tableData: TableData, 
  valuationVars: ValuationVariables
): Promise<ValuationResult> {
  console.log(`[API] Sending valuation data for ${symbol}`);
  
  // Prepare the payload exactly as the API expects it
  const payload = {
    "valuation_data": {
      "total_revenue": tableData.total_revenue || {},
      "revenue_gr": tableData.revenue_gr || {},
      "economic_earnings": tableData.economic_earnings || {},
      "earnings_margin": tableData.earnings_margin || {},
      "aroic": tableData.aroic || {},
      "ic": tableData.ic || {},
      "ic_gr": tableData.ic_gr || {},
      "ic_chg": tableData.ic_change || tableData.ic_chg || {}
    },
    "valuation_parameters": {
      "Shareholder ratio": valuationVars["Shareholder ratio"],
      "Discount rate": valuationVars["Discount rate"],
      "Total debt": valuationVars["Total debt"],
      "Market investment": valuationVars["Market investment"] === 0 ? "" : valuationVars["Market investment"],
      "Current market cap (mn)": valuationVars["Current market cap (mn)"],
      "Interim conversion": valuationVars["Interim conversion"]
    }
  };
  
  // Log the full payload for debugging
  console.log('[API] Payload:', JSON.stringify(payload, null, 2));
  
  try {
    // Make the POST request
    const response = await fetchWithTimeout(`${API_BASE_URL}/stock_valuation/${symbol}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        // Try to parse error response as JSON
        const errorData = await response.json();
        console.error('[API] Error response:', errorData);
        
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Handle validation errors
            const validationErrors = errorData.detail.map((err: any) => 
              `${err.loc.join('.')}: ${err.msg}`
            ).join('; ');
            errorMessage += `: ${validationErrors}`;
          } else {
            errorMessage += `: ${errorData.detail}`;
          }
        }
      } catch (parseError) {
        // If can't parse as JSON, get text
        const errorText = await response.text();
        console.error(`[API] Error response (${response.status}):`, errorText);
        errorMessage += `: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('[API] Response:', JSON.stringify(data, null, 2));
    
    if (data.status !== 'success') {
      throw new Error(`API returned error status: ${data.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.error('[API] Error:', error);
    
    // Handle specific error types
    if (error instanceof TypeError) {
      throw new Error('Network error: API server may be down');
    } else if (error.name === 'AbortError') {
      throw new Error('Request timeout: API server is not responding');
    }
    
    throw error;
  }
}

/**
 * Fetch sensitivity analysis data from the API
 */
export async function fetchSensitivityData(
  symbol: string, 
  tableData: TableData, 
  valuationVars: ValuationVariables
): Promise<SensitivityResult> {
  console.log(`[API] Fetching sensitivity data for ${symbol}`);
  
  // Prepare the payload - same structure as calculateStockValuation
  const payload = {
    "valuation_data": {
      "total_revenue": tableData.total_revenue || {},
      "revenue_gr": tableData.revenue_gr || {},
      "economic_earnings": tableData.economic_earnings || {},
      "earnings_margin": tableData.earnings_margin || {},
      "aroic": tableData.aroic || {},
      "ic": tableData.ic || {},
      "ic_gr": tableData.ic_gr || {},
      "ic_chg": tableData.ic_change || tableData.ic_chg || {}
    },
    "valuation_parameters": {
      "Shareholder ratio": valuationVars["Shareholder ratio"],
      "Discount rate": valuationVars["Discount rate"],
      "Total debt": valuationVars["Total debt"],
      "Market investment": valuationVars["Market investment"] === 0 ? "" : valuationVars["Market investment"],
      "Current market cap (mn)": valuationVars["Current market cap (mn)"],
      "Interim conversion": valuationVars["Interim conversion"]
    }
  };
  
  // Log the full payload for debugging
  console.log('[API] Sensitivity Payload:', JSON.stringify(payload, null, 2));
  
  try {
    // Make the POST request
    const response = await fetchWithTimeout(`${API_BASE_URL}/stock_sensitivity/${symbol}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        // Try to parse error response as JSON
        const errorData = await response.json();
        console.error('[API] Error response:', errorData);
        
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Handle validation errors
            const validationErrors = errorData.detail.map((err: any) => 
              `${err.loc.join('.')}: ${err.msg}`
            ).join('; ');
            errorMessage += `: ${validationErrors}`;
          } else {
            errorMessage += `: ${errorData.detail}`;
          }
        }
      } catch (parseError) {
        // If can't parse as JSON, get text
        const errorText = await response.text();
        console.error(`[API] Error response (${response.status}):`, errorText);
        errorMessage += `: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('[API] Sensitivity Response:', JSON.stringify(data, null, 2));
    
    if (data.status !== 'success') {
      throw new Error(`API returned error status: ${data.status}`);
    }
    
    // Validate that the matrix field exists and is a string
    if (typeof data.matrix !== 'string') {
      console.error('[API] Invalid matrix format:', data.matrix);
      throw new Error('API returned invalid matrix format');
    }
    
    return data;
  } catch (error: any) {
    console.error('[API] Sensitivity Error:', error);
    
    // Handle specific error types
    if (error instanceof TypeError) {
      throw new Error('Network error: API server may be down');
    } else if (error.name === 'AbortError') {
      throw new Error('Request timeout: API server is not responding');
    }
    
    throw error;
  }
}

/**
 * Process raw API data into the format needed by the application
 */
export function processStockValuationData(apiData: ApiResponse): {
  headers: string[];
  tableData: TableData;
  valuationVars: ValuationVariables;
} {
  // Convert headers to strings
  const stringHeaders = apiData.headers.map(h => h.toString());
  
  // Create a copy of the table data
  const tableData = { ...apiData.data };
  
  // Process the data (calculate derived values, etc.)
  processTableData(tableData, stringHeaders);
  
  // Process valuation variables
  const valuationVars: ValuationVariables = {
    'Shareholder ratio': Number(apiData.valuation_parameters['Shareholder ratio'] || 100),
    'Discount rate': Number(apiData.valuation_parameters['Discount rate'] || 8),
    'Total debt': Number(apiData.valuation_parameters['Total debt'] || 0),
    'Market investment': Number(apiData.valuation_parameters['Market investment'] || 0),
    'Current market cap (mn)': Number(apiData.valuation_parameters['Current market cap (mn)'] || 0),
    'Interim conversion': Number(apiData.valuation_parameters['Interim conversion'] || 0.33)
  };
  
  return {
    headers: stringHeaders,
    tableData,
    valuationVars
  };
}

/**
 * Process table data to calculate derived values
 */
function processTableData(tableData: TableData, headers: string[]): void {
  // Calculate FCF and FCF growth rate
  const fcf: { [year: string]: number } = {};
  const fcf_gr: { [year: string]: number } = {};
  
  headers.forEach((year, index) => {
    try {
      const earningsValue = tableData.economic_earnings && tableData.economic_earnings[year] 
        ? Number(tableData.economic_earnings[year]) 
        : 0;
          
      const icChangeValue = tableData.ic_chg && tableData.ic_chg[year] 
        ? Number(tableData.ic_chg[year]) 
        : 0;
      
      // Calculate FCF (earnings - IC change)
      fcf[year] = calculateFCF(earningsValue, icChangeValue);
      
      // Calculate FCF growth rate
      if (index > 0) {
        const prevYear = headers[index - 1];
        fcf_gr[year] = calculateGrowthRate(fcf[year], fcf[prevYear]);
      } else {
        fcf_gr[year] = 0; // First year has no growth rate
      }
    } catch (err) {
      console.error(`Error calculating values for year ${year}:`, err);
    }
  });

  // Add FCF data to table data
  tableData.fcf = fcf;
  tableData.fcf_gr = fcf_gr;
  
  // Rename ic_chg to ic_change if it exists
  if (tableData.ic_chg) {
    tableData.ic_change = tableData.ic_chg;
    delete tableData.ic_chg;
  }
}

// Add more API functions as needed
// export async function fetchMarketData() { ... }
// export async function fetchMacroData() { ... } 