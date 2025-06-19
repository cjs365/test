/**
 * Mock data for portfolio selection and metrics
 */

// Mock data for portfolio selector
export const portfolios = [
  { id: '1', name: 'Technology Leaders' },
  { id: '2', name: 'Dividend Kings' },
  { id: '3', name: 'Green Energy' },
  { id: '4', name: 'Financial Sector' },
];

// Mock data for benchmarks
export const benchmarks = [
  { id: '1', name: 'S&P 500' },
  { id: '2', name: 'Russell 2000' },
  { id: '3', name: 'NASDAQ Composite' },
  { id: '4', name: 'MSCI World Index' },
];

// Mock data for time periods
export const timePeriods = [
  { value: '1m', label: '1 Month' },
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: 'ytd', label: 'Year to Date' },
  { value: '1y', label: '1 Year' },
  { value: '3y', label: '3 Years' },
  { value: '5y', label: '5 Years' },
];

// Mock currency options
export const currencyOptions = [
  { value: 'base', label: 'Base Currency' },
  { value: 'hedged', label: 'Hedged' },
];

// Mock data for key metrics with sparklines
export const keyMetrics = [
  {
    id: '1',
    name: 'Total Return',
    value: '21.4%',
    sparkline: [
      { value: 5 },
      { value: 10 },
      { value: 8 },
      { value: 15 },
      { value: 12 },
      { value: 18 },
      { value: 21.4 },
    ],
    color: 'green',
  },
  {
    id: '2',
    name: 'Excess Return',
    value: '+3.7%',
    sparkline: [
      { value: 0.5 },
      { value: 1.2 },
      { value: 2.1 },
      { value: 1.8 },
      { value: 2.5 },
      { value: 3.2 },
      { value: 3.7 },
    ],
    color: 'green',
  },
  {
    id: '3',
    name: 'Volatility',
    value: '16.8%',
    sparkline: [
      { value: 22 },
      { value: 19 },
      { value: 20 },
      { value: 18 },
      { value: 17.5 },
      { value: 17 },
      { value: 16.8 },
    ],
    color: 'amber',
  },
  {
    id: '4',
    name: 'Tracking Error',
    value: '3.2%',
    sparkline: [
      { value: 2.1 },
      { value: 2.3 },
      { value: 2.5 },
      { value: 2.8 },
      { value: 3.0 },
      { value: 3.1 },
      { value: 3.2 },
    ],
    color: 'amber',
  },
  {
    id: '5',
    name: 'Sharpe Ratio',
    value: '1.25',
    sparkline: [
      { value: 0.85 },
      { value: 0.9 },
      { value: 1.05 },
      { value: 1.12 },
      { value: 1.18 },
      { value: 1.22 },
      { value: 1.25 },
    ],
    color: 'green',
  },
  {
    id: '6',
    name: 'Max Drawdown',
    value: '-8.7%',
    sparkline: [
      { value: -12 },
      { value: -10.5 },
      { value: -11 },
      { value: -9.5 },
      { value: -9.2 },
      { value: -8.9 },
      { value: -8.7 },
    ],
    color: 'green',
  },
  {
    id: '7',
    name: 'VaR (95%)',
    value: '2.4%',
    sparkline: [
      { value: 3.1 },
      { value: 2.9 },
      { value: 2.8 },
      { value: 2.7 },
      { value: 2.6 },
      { value: 2.5 },
      { value: 2.4 },
    ],
    color: 'green',
  },
]; 