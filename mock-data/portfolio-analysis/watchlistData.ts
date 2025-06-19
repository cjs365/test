/**
 * Mock data for user watchlists and portfolios
 */

// Watchlist/portfolio mock data
export const userWatchlists = [
  {
    id: '1',
    name: 'Tech Growth',
    description: 'Technology growth companies with strong momentum',
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc.', weight: 15.5, sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', weight: 14.2, sector: 'Technology' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', weight: 12.8, sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 11.5, sector: 'Communication Services' },
      { symbol: 'META', name: 'Meta Platforms Inc.', weight: 10.2, sector: 'Communication Services' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', weight: 9.8, sector: 'Consumer Discretionary' },
      { symbol: 'TSLA', name: 'Tesla Inc.', weight: 8.5, sector: 'Consumer Discretionary' },
      { symbol: 'ADBE', name: 'Adobe Inc.', weight: 6.5, sector: 'Technology' },
      { symbol: 'CRM', name: 'Salesforce Inc.', weight: 5.8, sector: 'Technology' },
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', weight: 5.2, sector: 'Technology' }
    ],
    sectorBreakdown: [
      { sector: 'Technology', weight: 42.2 },
      { sector: 'Communication Services', weight: 21.7 },
      { sector: 'Consumer Discretionary', weight: 18.3 },
      { sector: 'Other', weight: 17.8 }
    ],
    factorExposures: {
      growth: 0.85,
      value: -0.42,
      momentum: 0.72,
      quality: 0.65,
      size: -0.15,
      volatility: 0.58
    },
    performance: {
      '1M': 3.8,
      '3M': 9.2,
      '6M': 15.7,
      '1Y': 28.5,
      'YTD': 12.8
    }
  },
  {
    id: '2',
    name: 'Dividend Income',
    description: 'High dividend yield stocks with stable income',
    stocks: [
      { symbol: 'JNJ', name: 'Johnson & Johnson', weight: 12.5, sector: 'Healthcare' },
      { symbol: 'PG', name: 'Procter & Gamble Co.', weight: 11.8, sector: 'Consumer Staples' },
      { symbol: 'KO', name: 'Coca-Cola Co.', weight: 10.5, sector: 'Consumer Staples' },
      { symbol: 'VZ', name: 'Verizon Communications Inc.', weight: 9.8, sector: 'Communication Services' },
      { symbol: 'PFE', name: 'Pfizer Inc.', weight: 9.2, sector: 'Healthcare' },
      { symbol: 'MRK', name: 'Merck & Co. Inc.', weight: 8.7, sector: 'Healthcare' },
      { symbol: 'XOM', name: 'Exxon Mobil Corporation', weight: 8.2, sector: 'Energy' },
      { symbol: 'CVX', name: 'Chevron Corporation', weight: 7.8, sector: 'Energy' },
      { symbol: 'IBM', name: 'International Business Machines Corp.', weight: 7.5, sector: 'Technology' },
      { symbol: 'MMM', name: '3M Company', weight: 7.2, sector: 'Industrials' },
      { symbol: 'MO', name: 'Altria Group Inc.', weight: 6.8, sector: 'Consumer Staples' }
    ],
    sectorBreakdown: [
      { sector: 'Healthcare', weight: 30.4 },
      { sector: 'Consumer Staples', weight: 29.1 },
      { sector: 'Energy', weight: 16.0 },
      { sector: 'Technology', weight: 7.5 },
      { sector: 'Industrials', weight: 7.2 },
      { sector: 'Communication Services', weight: 9.8 }
    ],
    factorExposures: {
      growth: -0.25,
      value: 0.68,
      momentum: -0.18,
      quality: 0.45,
      size: 0.12,
      volatility: -0.52
    },
    performance: {
      '1M': 1.2,
      '3M': 3.8,
      '6M': 5.2,
      '1Y': 11.5,
      'YTD': 4.2
    }
  },
  {
    id: '3',
    name: 'Balanced Portfolio',
    description: 'Diversified mix of growth and value stocks',
    stocks: [
      { symbol: 'AAPL', name: 'Apple Inc.', weight: 8.5, sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', weight: 8.2, sector: 'Technology' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', weight: 7.5, sector: 'Healthcare' },
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.', weight: 7.2, sector: 'Financials' },
      { symbol: 'PG', name: 'Procter & Gamble Co.', weight: 6.8, sector: 'Consumer Staples' },
      { symbol: 'V', name: 'Visa Inc.', weight: 6.5, sector: 'Financials' },
      { symbol: 'HD', name: 'Home Depot Inc.', weight: 6.2, sector: 'Consumer Discretionary' },
      { symbol: 'UNH', name: 'UnitedHealth Group Inc.', weight: 5.8, sector: 'Healthcare' },
      { symbol: 'DIS', name: 'The Walt Disney Company', weight: 5.5, sector: 'Communication Services' },
      { symbol: 'BA', name: 'Boeing Co.', weight: 5.2, sector: 'Industrials' },
      { symbol: 'CVX', name: 'Chevron Corporation', weight: 4.8, sector: 'Energy' },
      { symbol: 'MCD', name: 'McDonald\'s Corporation', weight: 4.5, sector: 'Consumer Discretionary' },
      { symbol: 'PEP', name: 'PepsiCo Inc.', weight: 4.2, sector: 'Consumer Staples' },
      { symbol: 'CSCO', name: 'Cisco Systems Inc.', weight: 3.8, sector: 'Technology' },
      { symbol: 'VZ', name: 'Verizon Communications Inc.', weight: 3.5, sector: 'Communication Services' },
      { symbol: 'INTC', name: 'Intel Corporation', weight: 3.2, sector: 'Technology' },
      { symbol: 'NEE', name: 'NextEra Energy Inc.', weight: 2.8, sector: 'Utilities' },
      { symbol: 'LMT', name: 'Lockheed Martin Corporation', weight: 2.5, sector: 'Industrials' },
      { symbol: 'AMT', name: 'American Tower Corporation', weight: 2.2, sector: 'Real Estate' },
      { symbol: 'GS', name: 'Goldman Sachs Group Inc.', weight: 1.8, sector: 'Financials' }
    ],
    sectorBreakdown: [
      { sector: 'Technology', weight: 23.7 },
      { sector: 'Healthcare', weight: 13.3 },
      { sector: 'Financials', weight: 15.5 },
      { sector: 'Consumer Staples', weight: 11.0 },
      { sector: 'Consumer Discretionary', weight: 10.7 },
      { sector: 'Communication Services', weight: 9.0 },
      { sector: 'Industrials', weight: 7.7 },
      { sector: 'Energy', weight: 4.8 },
      { sector: 'Utilities', weight: 2.8 },
      { sector: 'Real Estate', weight: 2.2 }
    ],
    factorExposures: {
      growth: 0.35,
      value: 0.28,
      momentum: 0.22,
      quality: 0.52,
      size: 0.05,
      volatility: -0.15
    },
    performance: {
      '1M': 2.2,
      '3M': 5.8,
      '6M': 9.5,
      '1Y': 18.7,
      'YTD': 7.5
    }
  }
]; 