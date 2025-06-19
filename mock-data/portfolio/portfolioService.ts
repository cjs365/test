import {
  modelPortfolios,
  portfolioHoldingsData,
  portfolioFactors,
  portfolioCategories,
  portfolioRiskLevels,
  sp500Benchmark
} from './portfolioData';

// Types
export interface Portfolio {
  id: string;
  ticker: string;
  name: string;
  market: string;
  description: string;
  category: string;
  riskLevel: string;
  performance: {
    ytd: string;
    oneYear: string;
    threeYear: string;
    fiveYear: string;
  };
  chartData: Array<{ year: number; value: number }>;
  holdings: string[];
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  sector: string;
  weight: number;
  shares: number;
  price: number;
  marketValue: number;
  change: string;
}

export interface HoldingsData {
  dates: string[];
  holdings: Record<string, PortfolioHolding[]>;
}

export interface FactorData {
  name: string;
  score: number;
  benchmark: number;
}

export interface PortfolioFactors {
  factors: FactorData[];
}

export class PortfolioService {
  /**
   * Get all portfolios with basic information
   */
  static async getAllPortfolios(): Promise<Portfolio[]> {
    try {
      // Add the S&P 500 benchmark to the model portfolios
      const portfolios = [...modelPortfolios, sp500Benchmark];
      return portfolios;
    } catch (error) {
      console.error('Error getting all portfolios:', error);
      return [];
    }
  }
  
  /**
   * Get portfolio categories
   */
  static async getPortfolioCategories(): Promise<string[]> {
    return portfolioCategories;
  }
  
  /**
   * Get portfolio risk levels
   */
  static async getPortfolioRiskLevels(): Promise<string[]> {
    return portfolioRiskLevels;
  }
  
  /**
   * Get a portfolio by ticker
   */
  static async getPortfolioByTicker(ticker: string): Promise<Portfolio | null> {
    try {
      // Find the portfolio with the matching ticker (case insensitive)
      const portfolio = [...modelPortfolios, sp500Benchmark]
        .find(p => p.ticker.toLowerCase() === ticker.toLowerCase());
      
      return portfolio || null;
    } catch (error) {
      console.error(`Error getting portfolio ${ticker}:`, error);
      return null;
    }
  }
  
  /**
   * Get portfolio holdings data by ticker
   */
  static async getPortfolioHoldings(ticker: string): Promise<HoldingsData | null> {
    try {
      // Convert ticker to lowercase for case-insensitive comparison
      const lowerTicker = ticker.toLowerCase();
      
      // Find the matching holdings data
      if (lowerTicker === 'tech') {
        return portfolioHoldingsData.tech;
      } else if (lowerTicker === 'divg') {
        return portfolioHoldingsData.divg;
      } else if (lowerTicker === 'sustn') {
        return portfolioHoldingsData.sustn;
      } else if (lowerTicker === 'spy') {
        // Return empty data for S&P 500 benchmark
        return {
          dates: ['2023-12-31', '2023-09-30', '2023-06-30'],
          holdings: {
            '2023-12-31': [],
            '2023-09-30': [],
            '2023-06-30': [],
          }
        };
      }
      
      console.log(`No holdings data found for portfolio ticker ${ticker}`);
      return null;
    } catch (error) {
      console.error(`Error getting holdings for portfolio ${ticker}:`, error);
      return null;
    }
  }
  
  /**
   * Get portfolio factor data by ticker
   */
  static async getPortfolioFactors(ticker: string): Promise<PortfolioFactors | null> {
    try {
      // Convert ticker to lowercase for case-insensitive comparison
      const lowerTicker = ticker.toLowerCase();
      
      // Find the matching factor data
      if (lowerTicker === 'tech' && portfolioFactors.TECH) {
        return portfolioFactors.TECH;
      } else if (lowerTicker === 'divg' && portfolioFactors.DIVG) {
        return portfolioFactors.DIVG;
      } else if (lowerTicker === 'sustn' && portfolioFactors.SUSTN) {
        return portfolioFactors.SUSTN;
      } else if (lowerTicker === 'spy') {
        // Return benchmark data for S&P 500
        return {
          factors: [
            { name: 'Growth', score: 65, benchmark: 65 },
            { name: 'Value', score: 58, benchmark: 58 },
            { name: 'Quality', score: 62, benchmark: 62 },
            { name: 'Momentum', score: 55, benchmark: 55 },
            { name: 'Volatility', score: 50, benchmark: 50 }
          ]
        };
      }
      
      console.log(`No factor data found for portfolio ticker ${ticker}`);
      return null;
    } catch (error) {
      console.error(`Error getting factors for portfolio ${ticker}:`, error);
      return null;
    }
  }
} 