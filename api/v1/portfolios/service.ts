// Portfolio API service
import axios from 'axios';

// Portfolio service methods
export const portfolioService = {
  // Get all portfolios
  getAllPortfolios: async () => {
    try {
      console.log('Calling /api/v1/portfolios from client service');
      const response = await fetch('/api/v1/portfolios');
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolios: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response from /api/v1/portfolios:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      throw error;
    }
  },

  // Get a portfolio by ticker
  getPortfolio: async (ticker: string) => {
    try {
      console.log(`Calling /api/v1/portfolios/${ticker} from client service`);
      const response = await fetch(`/api/v1/portfolios/${ticker}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio ${ticker}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from /api/v1/portfolios/${ticker}:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching portfolio ${ticker}:`, error);
      throw error;
    }
  },

  // Get portfolio holdings
  getPortfolioHoldings: async (ticker: string) => {
    try {
      console.log(`Calling /api/v1/portfolios/${ticker}/holdings from client service`);
      const response = await fetch(`/api/v1/portfolios/${ticker}/holdings`);
      if (!response.ok) {
        throw new Error(`Failed to fetch holdings for portfolio ${ticker}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from /api/v1/portfolios/${ticker}/holdings:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching holdings for portfolio ${ticker}:`, error);
      throw error;
    }
  },

  // Get portfolio factor data
  getPortfolioFactors: async (ticker: string) => {
    try {
      console.log(`Calling /api/v1/portfolios/${ticker}/factors from client service`);
      const response = await fetch(`/api/v1/portfolios/${ticker}/factors`);
      if (!response.ok) {
        throw new Error(`Failed to fetch factors for portfolio ${ticker}: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log(`Response from /api/v1/portfolios/${ticker}/factors:`, data);
      return data.data;
    } catch (error) {
      console.error(`Error fetching factors for portfolio ${ticker}:`, error);
      throw error;
    }
  }
}; 