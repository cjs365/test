import { 
  FinancialMetric, 
  generateMockIncomeStatement, 
  generateMockBalanceSheet, 
  generateMockCashFlow 
} from '@/mock-data/stock/companyReportData';

/**
 * Get financial data for a company
 * 
 * @param symbol The stock symbol
 * @param reportType The type of report to get (income, balance, cash_flow)
 * @returns Financial metrics for the specified report type
 */
export async function getFinancialReport(
  symbol: string,
  reportType: 'income' | 'balance' | 'cash_flow'
): Promise<FinancialMetric[]> {
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