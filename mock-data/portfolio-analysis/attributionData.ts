/**
 * Mock data for portfolio attribution analysis
 */

// Attribution analysis mock data
export const attributionAnalysisData = {
  // Brinson attribution model data (sector-based)
  sectorAttribution: {
    // Overall portfolio vs benchmark
    overall: {
      totalReturn: 8.5,
      benchmarkReturn: 6.2,
      activeReturn: 2.3,
      allocationEffect: 0.8,
      selectionEffect: 1.5,
      interactionEffect: 0.0
    },
    // Sector-level breakdown
    sectors: [
      {
        sector: 'Technology',
        weight: 25.5,
        benchmarkWeight: 22.3,
        return: 12.8,
        benchmarkReturn: 10.5,
        allocationEffect: 0.4,
        selectionEffect: 0.6,
        interactionEffect: 0.1,
        activeReturn: 1.1
      },
      {
        sector: 'Healthcare',
        weight: 15.8,
        benchmarkWeight: 14.2,
        return: 6.5,
        benchmarkReturn: 5.8,
        allocationEffect: 0.1,
        selectionEffect: 0.2,
        interactionEffect: 0.0,
        activeReturn: 0.3
      },
      {
        sector: 'Financials',
        weight: 12.5,
        benchmarkWeight: 14.8,
        return: 7.2,
        benchmarkReturn: 6.5,
        allocationEffect: -0.2,
        selectionEffect: 0.1,
        interactionEffect: 0.0,
        activeReturn: -0.1
      },
      {
        sector: 'Consumer Discretionary',
        weight: 11.2,
        benchmarkWeight: 10.5,
        return: 9.8,
        benchmarkReturn: 7.2,
        allocationEffect: 0.1,
        selectionEffect: 0.3,
        interactionEffect: 0.0,
        activeReturn: 0.4
      },
      {
        sector: 'Communication Services',
        weight: 10.8,
        benchmarkWeight: 8.5,
        return: 8.5,
        benchmarkReturn: 6.2,
        allocationEffect: 0.2,
        selectionEffect: 0.2,
        interactionEffect: 0.1,
        activeReturn: 0.5
      },
      {
        sector: 'Consumer Staples',
        weight: 8.5,
        benchmarkWeight: 9.8,
        return: 4.2,
        benchmarkReturn: 3.8,
        allocationEffect: -0.1,
        selectionEffect: 0.0,
        interactionEffect: 0.0,
        activeReturn: -0.1
      },
      {
        sector: 'Industrials',
        weight: 7.2,
        benchmarkWeight: 8.5,
        return: 5.8,
        benchmarkReturn: 5.2,
        allocationEffect: -0.1,
        selectionEffect: 0.0,
        interactionEffect: 0.0,
        activeReturn: -0.1
      },
      {
        sector: 'Energy',
        weight: 4.2,
        benchmarkWeight: 5.5,
        return: 9.2,
        benchmarkReturn: 7.8,
        allocationEffect: -0.1,
        selectionEffect: 0.1,
        interactionEffect: 0.0,
        activeReturn: 0.0
      },
      {
        sector: 'Utilities',
        weight: 2.5,
        benchmarkWeight: 3.2,
        return: 3.2,
        benchmarkReturn: 3.5,
        allocationEffect: 0.0,
        selectionEffect: 0.0,
        interactionEffect: 0.0,
        activeReturn: 0.0
      },
      {
        sector: 'Real Estate',
        weight: 1.8,
        benchmarkWeight: 2.7,
        return: 4.8,
        benchmarkReturn: 4.2,
        allocationEffect: 0.0,
        selectionEffect: 0.0,
        interactionEffect: 0.0,
        activeReturn: 0.0
      }
    ]
  },
  
  // Factor-based attribution
  factorAttribution: {
    overall: {
      totalReturn: 8.5,
      benchmarkReturn: 6.2,
      activeReturn: 2.3,
      factorReturn: 1.9,
      specificReturn: 0.4
    },
    factors: [
      {
        factor: 'Market',
        exposure: 1.02,
        benchmarkExposure: 1.00,
        factorReturn: 5.8,
        attribution: 0.1
      },
      {
        factor: 'Size',
        exposure: -0.15,
        benchmarkExposure: 0.00,
        factorReturn: -1.2,
        attribution: 0.2
      },
      {
        factor: 'Value',
        exposure: 0.25,
        benchmarkExposure: 0.10,
        factorReturn: 2.1,
        attribution: 0.3
      },
      {
        factor: 'Momentum',
        exposure: 0.45,
        benchmarkExposure: 0.15,
        factorReturn: 3.2,
        attribution: 1.0
      },
      {
        factor: 'Quality',
        exposure: 0.38,
        benchmarkExposure: 0.25,
        factorReturn: 1.8,
        attribution: 0.2
      },
      {
        factor: 'Volatility',
        exposure: -0.22,
        benchmarkExposure: -0.05,
        factorReturn: -0.7,
        attribution: 0.1
      }
    ],
    topContributors: [
      { stock: 'AAPL', weight: 8.5, contribution: 0.85, factorAttribution: 0.62, specificAttribution: 0.23 },
      { stock: 'MSFT', weight: 7.2, contribution: 0.72, factorAttribution: 0.58, specificAttribution: 0.14 },
      { stock: 'NVDA', weight: 6.8, contribution: 0.68, factorAttribution: 0.52, specificAttribution: 0.16 },
      { stock: 'GOOGL', weight: 5.5, contribution: 0.40, factorAttribution: 0.32, specificAttribution: 0.08 },
      { stock: 'AMZN', weight: 4.8, contribution: 0.38, factorAttribution: 0.30, specificAttribution: 0.08 }
    ],
    bottomContributors: [
      { stock: 'PFE', weight: 2.2, contribution: -0.12, factorAttribution: -0.05, specificAttribution: -0.07 },
      { stock: 'INTC', weight: 1.5, contribution: -0.10, factorAttribution: -0.06, specificAttribution: -0.04 },
      { stock: 'VZ', weight: 1.8, contribution: -0.08, factorAttribution: -0.04, specificAttribution: -0.04 },
      { stock: 'MRK', weight: 2.0, contribution: -0.06, factorAttribution: -0.03, specificAttribution: -0.03 },
      { stock: 'KO', weight: 1.7, contribution: -0.05, factorAttribution: -0.02, specificAttribution: -0.03 }
    ]
  },
  
  // Attribution over time
  timeSeriesAttribution: {
    dates: ['2023-06-30', '2023-09-30', '2023-12-31', '2024-03-31'],
    allocation: [0.5, 0.7, 0.8, 0.8],
    selection: [0.8, 1.1, 1.3, 1.5],
    interaction: [0.1, 0.0, 0.1, 0.0],
    total: [1.4, 1.8, 2.2, 2.3]
  },
  
  // Risk decomposition
  riskAttribution: {
    totalRisk: 15.2,
    benchmarkRisk: 13.8,
    activeRisk: 4.5,
    factorRisk: 3.8,
    specificRisk: 0.7,
    factorBreakdown: [
      { factor: 'Market', contribution: 75.2 },
      { factor: 'Size', contribution: 2.5 },
      { factor: 'Value', contribution: 5.8 },
      { factor: 'Momentum', contribution: 8.2 },
      { factor: 'Quality', contribution: 4.5 },
      { factor: 'Volatility', contribution: 3.8 }
    ]
  }
}; 