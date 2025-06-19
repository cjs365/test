import { generateMockData, generateMockSensitivityData, generateMockValuationResult, generateMockAIValuation, generateMockAIScenario } from '@/mock-data/stock/stockData';
import { 
  FinancialMetric, 
  generateMockIncomeStatement, 
  generateMockBalanceSheet, 
  generateMockCashFlow 
} from '@/mock-data/stock/companyReportData';

// Financial data API
export async function getFinancialReport(symbol: string, reportType: 'income' | 'balance' | 'cash_flow'): Promise<FinancialMetric[]> {
  try {
    switch(reportType) {
      case 'income':
        return generateMockIncomeStatement(symbol);
      case 'balance':
        return generateMockBalanceSheet(symbol);
      case 'cash_flow':
        return generateMockCashFlow(symbol);
      default:
        return generateMockIncomeStatement(symbol);
    }
  } catch (error) {
    console.error(`Error fetching ${reportType} data:`, error);
    throw new Error(`Failed to fetch ${reportType} data`);
  }
}

// Stock valuation API
export async function getStockValuationData(symbol: string) {
  try {
    // Generate mock data for the requested symbol
    const mockData = generateMockData(symbol);
    
    return {
      status: 'success',
      ric: symbol,
      data: mockData.tableData,
      headers: mockData.headers.map(year => parseInt(year)),
      valuation_parameters: mockData.valuationVars
    };
  } catch (error) {
    console.error('Error fetching stock valuation data:', error);
    throw new Error('Failed to fetch stock valuation data');
  }
}

export async function calculateStockValuation(symbol: string, data: any) {
  try {
    // In a real implementation, you would use the provided data
    // to calculate the enterprise value
    const mockResult = generateMockValuationResult();
    return mockResult;
  } catch (error) {
    console.error('Error calculating stock valuation:', error);
    throw new Error('Failed to calculate stock valuation');
  }
}

// AI Valuation API
interface AIValuationResponse {
  success: boolean;
  message?: string;
  data?: {
    reasoning: string;
    scenario: any;
  };
}

export async function generateStockAIValuation(symbol: string): Promise<AIValuationResponse> {
  try {
    // In a production environment, this would call an actual API
    
    // Generate mock AI valuation text
    const valuation = generateMockAIValuation(symbol);
    
    // Generate mock AI scenario data with basic headers
    const currentYear = new Date().getFullYear();
    const mockHeaders = [];
    for (let i = 5; i > 0; i--) mockHeaders.push((currentYear - i).toString());
    mockHeaders.push(currentYear.toString());
    for (let i = 1; i <= 5; i++) mockHeaders.push((currentYear + i).toString());
    
    const scenario = generateMockAIScenario(mockHeaders);
    
    return {
      success: true,
      data: {
        reasoning: valuation,
        scenario: scenario
      }
    };
  } catch (error: any) {
    console.error('Error generating AI valuation:', error);
    return {
      success: false,
      message: error.message || 'An error occurred while generating AI valuation'
    };
  }
}

// Sensitivity API
export async function generateSensitivityAnalysis(symbol: string, data: any) {
  try {
    const sensitivityData = generateMockSensitivityData();
    return sensitivityData;
  } catch (error) {
    console.error('Error generating sensitivity data:', error);
    throw new Error('Failed to generate sensitivity data');
  }
} 