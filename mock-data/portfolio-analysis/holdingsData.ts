/**
 * Mock data for portfolio holdings
 */

// Mock data for top 10 holdings
export const topHoldings = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc',
    weight: '7.2%',
    active: '+2.1%',
    factors: [
      { name: 'Quality', color: 'blue' },
      { name: 'Momentum', color: 'green' }
    ]
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft',
    weight: '6.8%',
    active: '+1.5%',
    factors: [
      { name: 'Momentum', color: 'green' },
      { name: 'Valuation', color: 'purple' }
    ]
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA',
    weight: '4.2%',
    active: '+2.7%',
    factors: [
      { name: 'Momentum', color: 'green' },
      { name: 'Risk', color: 'amber' }
    ]
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet',
    weight: '3.7%',
    active: '+0.8%',
    factors: [
      { name: 'Quality', color: 'blue' },
      { name: 'Valuation', color: 'orange' }
    ]
  }
]; 