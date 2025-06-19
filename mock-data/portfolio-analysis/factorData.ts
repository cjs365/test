/**
 * Mock data for market factor performance
 */

// Market factor performance data
export const marketFactorPerformance = {
  // Factor performance over different time periods
  factorReturns: {
    '1M': [
      { factor: 'Value', return: 2.1, benchmark: 1.5 },
      { factor: 'Momentum', return: 0.9, benchmark: 0.8 },
      { factor: 'Size', return: -1.2, benchmark: -0.5 },
      { factor: 'Quality', return: 1.8, benchmark: 1.4 },
      { factor: 'Volatility', return: -0.7, benchmark: -0.3 },
      { factor: 'Growth', return: 3.2, benchmark: 2.1 },
      { factor: 'Dividend', return: 0.5, benchmark: 1.1 },
      { factor: 'Profitability', return: 1.6, benchmark: 1.3 },
    ],
    '3M': [
      { factor: 'Value', return: 5.4, benchmark: 4.2 },
      { factor: 'Momentum', return: 3.2, benchmark: 3.5 },
      { factor: 'Size', return: -2.8, benchmark: -1.6 },
      { factor: 'Quality', return: 4.7, benchmark: 3.9 },
      { factor: 'Volatility', return: -1.9, benchmark: -0.8 },
      { factor: 'Growth', return: 8.5, benchmark: 6.3 },
      { factor: 'Dividend', return: 2.1, benchmark: 3.2 },
      { factor: 'Profitability', return: 4.1, benchmark: 3.5 },
    ],
    '6M': [
      { factor: 'Value', return: 8.9, benchmark: 7.5 },
      { factor: 'Momentum', return: 7.1, benchmark: 6.8 },
      { factor: 'Size', return: -3.5, benchmark: -2.1 },
      { factor: 'Quality', return: 9.2, benchmark: 7.6 },
      { factor: 'Volatility', return: -3.8, benchmark: -1.5 },
      { factor: 'Growth', return: 15.2, benchmark: 12.7 },
      { factor: 'Dividend', return: 4.8, benchmark: 6.3 },
      { factor: 'Profitability', return: 8.7, benchmark: 7.2 },
    ],
    '1Y': [
      { factor: 'Value', return: 12.3, benchmark: 10.8 },
      { factor: 'Momentum', return: 15.6, benchmark: 13.2 },
      { factor: 'Size', return: -5.2, benchmark: -3.8 },
      { factor: 'Quality', return: 18.5, benchmark: 15.3 },
      { factor: 'Volatility', return: -8.4, benchmark: -4.2 },
      { factor: 'Growth', return: 22.7, benchmark: 18.4 },
      { factor: 'Dividend', return: 9.5, benchmark: 11.2 },
      { factor: 'Profitability', return: 16.3, benchmark: 14.7 },
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
      'Value': [1.2, 0.8, -0.5, 1.5, 2.3, 0.7, 1.1, 2.8, 1.5, -0.3, 0.9, 1.8, 2.1],
      'Momentum': [2.1, 1.7, 2.3, 1.9, 0.5, -0.7, 1.4, 2.6, 2.8, 1.5, -0.6, 0.2, 0.9],
      'Size': [-0.8, -1.2, -0.9, -0.5, -1.1, -1.8, -0.7, -0.3, -0.9, -1.5, -1.7, -1.4, -1.2],
      'Quality': [1.5, 1.8, 1.2, 1.1, 0.9, 1.3, 1.7, 2.1, 1.9, 1.6, 1.2, 1.5, 1.8],
      'Volatility': [-1.2, -0.9, -1.5, -0.8, -0.6, -1.1, -1.3, -0.5, -0.8, -1.2, -1.5, -0.9, -0.7],
      'Growth': [2.8, 2.3, 1.9, 2.5, 3.1, 2.7, 2.2, 3.5, 3.8, 2.9, 2.5, 3.1, 3.2],
      'Dividend': [0.9, 1.2, 0.8, 0.5, 0.3, 0.7, 1.1, 0.9, 0.6, 0.2, 0.5, 0.8, 0.5],
      'Profitability': [1.3, 1.5, 1.1, 1.2, 1.4, 1.6, 1.3, 1.8, 1.7, 1.2, 1.1, 1.4, 1.6],
    }
  },
  
  // Sector factor performance heatmap data
  sectorFactorHeatmap: [
    { sector: 'Technology', value: 4.5, momentum: 5.2, size: -1.2, quality: 4.8, volatility: -3.2, growth: 6.1 },
    { sector: 'Financials', value: 3.8, momentum: 2.1, size: -0.8, quality: 3.5, volatility: -2.1, growth: 2.8 },
    { sector: 'Healthcare', value: 2.5, momentum: 3.1, size: -1.5, quality: 4.2, volatility: -1.8, growth: 3.7 },
    { sector: 'Consumer Discretionary', value: 1.9, momentum: 4.5, size: -2.1, quality: 2.8, volatility: -3.5, growth: 4.2 },
    { sector: 'Energy', value: 5.2, momentum: 1.8, size: -0.5, quality: 2.1, volatility: -2.8, growth: 1.5 },
    { sector: 'Industrials', value: 3.2, momentum: 2.5, size: -1.1, quality: 3.1, volatility: -1.9, growth: 2.7 },
    { sector: 'Consumer Staples', value: 1.5, momentum: 1.2, size: -0.9, quality: 3.8, volatility: -1.2, growth: 1.8 },
    { sector: 'Materials', value: 2.8, momentum: 2.2, size: -1.3, quality: 2.5, volatility: -2.2, growth: 2.1 },
    { sector: 'Utilities', value: 1.2, momentum: 0.8, size: -0.7, quality: 2.9, volatility: -0.9, growth: 1.1 },
    { sector: 'Real Estate', value: 2.1, momentum: 1.5, size: -1.8, quality: 2.2, volatility: -1.5, growth: 1.7 },
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
      { factor1: 'Value', factor2: 'Growth', correlation: -0.65 },
      { factor1: 'Value', factor2: 'Momentum', correlation: 0.25 },
      { factor1: 'Value', factor2: 'Quality', correlation: 0.18 },
      { factor1: 'Growth', factor2: 'Momentum', correlation: 0.72 },
      { factor1: 'Growth', factor2: 'Quality', correlation: 0.55 },
      { factor1: 'Momentum', factor2: 'Quality', correlation: 0.48 },
      { factor1: 'Volatility', factor2: 'Quality', correlation: -0.58 },
      { factor1: 'Size', factor2: 'Value', correlation: 0.35 },
    ]
  }
}; 