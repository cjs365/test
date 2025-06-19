/**
 * Mock data for similar stocks
 */

// Mock data for similar stocks based on factor exposure
export const similarStocks = [
  {
    ticker: 'TXN',
    name: 'Texas Instruments',
    similarity: '97%',
    sector: 'Tech',
    keyFactorMatch: 'High Quality, Risk',
    factorExposures: {
      'Quality': 0.8,
      'Valuation': -0.3,
      'Momentum': 0.4,
      'Risk': 0.7,
      'Growth': 0.1
    }
  },
  {
    ticker: 'ROP',
    name: 'Roper Technologies',
    similarity: '95%',
    sector: 'Industrials',
    keyFactorMatch: 'Quality, Momentum',
    factorExposures: {
      'Quality': 0.75,
      'Valuation': -0.5,
      'Momentum': 0.9,
      'Risk': 0.2,
      'Growth': 0.4
    }
  },
  {
    ticker: 'ADI',
    name: 'Analog Devices',
    similarity: '94%',
    sector: 'Tech',
    keyFactorMatch: 'Valuation, Risk',
    factorExposures: {
      'Quality': 0.4,
      'Valuation': 0.6,
      'Momentum': 0.3,
      'Risk': 0.8,
      'Growth': -0.2
    }
  }
]; 