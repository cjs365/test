/**
 * Mock data for market factor performance
 */

// Market factor performance data
export const marketFactorPerformance = {
  // Factor performance over different time periods
  factorReturns: {
    '1M': [
      { factor: 'Valuation', return: 2.1, benchmark: 1.5 },
      { factor: 'Momentum', return: 0.9, benchmark: 0.8 },
      { factor: 'Risk', return: -1.2, benchmark: -0.5 },
      { factor: 'Quality', return: 1.8, benchmark: 1.4 },
      { factor: 'Growth', return: 3.2, benchmark: 2.1 },
    ],
    '3M': [
      { factor: 'Valuation', return: 5.4, benchmark: 4.2 },
      { factor: 'Momentum', return: 3.2, benchmark: 3.5 },
      { factor: 'Risk', return: -2.8, benchmark: -1.6 },
      { factor: 'Quality', return: 4.7, benchmark: 3.9 },
      { factor: 'Growth', return: 8.5, benchmark: 6.3 },
    ],
    '6M': [
      { factor: 'Valuation', return: 8.9, benchmark: 7.5 },
      { factor: 'Momentum', return: 7.1, benchmark: 6.8 },
      { factor: 'Risk', return: -3.5, benchmark: -2.1 },
      { factor: 'Quality', return: 9.2, benchmark: 7.6 },
      { factor: 'Growth', return: 15.2, benchmark: 12.7 },
    ],
    '1Y': [
      { factor: 'Valuation', return: 12.3, benchmark: 10.8 },
      { factor: 'Momentum', return: 15.6, benchmark: 13.2 },
      { factor: 'Risk', return: -5.2, benchmark: -3.8 },
      { factor: 'Quality', return: 18.5, benchmark: 15.3 },
      { factor: 'Growth', return: 22.7, benchmark: 18.4 },
    ],
  },
  
  // Factor performance trend over time (monthly data points)
  factorTrends: {
    dates: [
      '2023-05-01', '2023-06-01', '2023-07-01', '2023-08-01', '2023-09-01',
      '2023-10-01', '2023-11-01', '2023-12-01', '2024-01-01', '2024-02-01',
      '2024-03-01', '2024-04-01', '2024-05-01',
    ],
    data: {
      'Valuation': [1.2, 0.8, -0.5, 1.5, 2.3, 0.7, 1.1, 2.8, 1.5, -0.3, 0.9, 1.8, 2.1],
      'Momentum': [2.1, 1.7, 2.3, 1.9, 0.5, -0.7, 1.4, 2.6, 2.8, 1.5, -0.6, 0.2, 0.9],
      'Risk': [-0.8, -1.2, -0.9, -0.5, -1.1, -1.8, -0.7, -0.3, -0.9, -1.5, -1.7, -1.4, -1.2],
      'Quality': [1.5, 1.8, 1.2, 1.1, 0.9, 1.3, 1.7, 2.1, 1.9, 1.6, 1.2, 1.5, 1.8],
      'Growth': [2.8, 2.3, 1.9, 2.5, 3.1, 2.7, 2.2, 3.5, 3.8, 2.9, 2.5, 3.1, 3.2],
    }
  },
  
  // Sector factor performance heatmap data
  sectorFactorHeatmap: [
    { sector: 'Technology', valuation: 4.5, momentum: 5.2, risk: -1.2, quality: 4.8, risk2: -3.2, growth: 6.1 },
    { sector: 'Financials', valuation: 3.8, momentum: 2.1, risk: -0.8, quality: 3.5, risk2: -2.1, growth: 2.8 },
    { sector: 'Healthcare', valuation: 2.5, momentum: 3.1, risk: -1.5, quality: 4.2, risk2: -1.8, growth: 3.7 },
    { sector: 'Consumer Discretionary', valuation: 1.9, momentum: 4.5, risk: -2.1, quality: 2.8, risk2: -3.5, growth: 4.2 },
    { sector: 'Energy', valuation: 5.2, momentum: 1.8, risk: -0.5, quality: 2.1, risk2: -2.8, growth: 1.5 },
    { sector: 'Industrials', valuation: 3.2, momentum: 2.5, risk: -1.1, quality: 3.1, risk2: -1.9, growth: 2.7 },
    { sector: 'Consumer Staples', valuation: 1.5, momentum: 1.2, risk: -0.9, quality: 3.8, risk2: -1.2, growth: 1.8 },
    { sector: 'Materials', valuation: 2.8, momentum: 2.2, risk: -1.3, quality: 2.5, risk2: -2.2, growth: 2.1 },
    { sector: 'Utilities', valuation: 1.2, momentum: 0.8, risk: -0.7, quality: 2.9, risk2: -0.9, growth: 1.1 },
    { sector: 'Real Estate', valuation: 2.1, momentum: 1.5, risk: -1.8, quality: 2.2, risk2: -1.5, growth: 1.7 },
  ],
  
  // Market volatility and correlation data
  marketStats: {
    volatility: {
      current: 18.5,
      average: 15.2,
      max: 28.7,
      min: 9.8
    },
    correlations: [
      { factor1: 'Valuation', factor2: 'Growth', correlation: -0.65 },
      { factor1: 'Valuation', factor2: 'Momentum', correlation: 0.25 },
      { factor1: 'Valuation', factor2: 'Quality', correlation: 0.18 },
      { factor1: 'Growth', factor2: 'Momentum', correlation: 0.72 },
      { factor1: 'Growth', factor2: 'Quality', correlation: 0.55 },
      { factor1: 'Momentum', factor2: 'Quality', correlation: 0.48 },
      { factor1: 'Risk', factor2: 'Quality', correlation: -0.58 },
      { factor1: 'Risk', factor2: 'Valuation', correlation: 0.35 },
    ]
  }
}; 