/**
 * Mock data for scenario analysis
 */

// Mock data for predefined scenarios
export const predefinedScenarios = ['COVID Crash', 'GFC', 'Fed Rate Shock', 'Oil Spike', 'USD Rally'];

// Mock data for scenario P&L table
export const scenarioPnLData = [
  {
    scenario: 'COVID Crash',
    return: '-18.7%',
    varShift: '+85%',
    factors: [
      { name: 'Momentum', color: 'green' },
      { name: 'Risk', color: 'amber' }
    ]
  },
  {
    scenario: 'GFC',
    return: '-24.3%',
    varShift: '+120%',
    factors: [
      { name: 'Beta', color: 'purple' },
      { name: 'Credit Spread', color: 'sky' }
    ]
  },
  {
    scenario: 'Fed Rate Shock',
    return: '-8.5%',
    varShift: '+45%',
    factors: [
      { name: 'Interest Rates', color: 'indigo' },
      { name: 'USD', color: 'cyan' }
    ]
  },
  {
    scenario: 'Oil Spike',
    return: '-5.2%',
    varShift: '+30%',
    factors: [
      { name: 'Energy', color: 'yellow' },
      { name: 'Inflation', color: 'red' }
    ]
  }
];

// Mock data for factor attribution analysis
export const factorAttributionData = [
  { name: 'Quality', allocation: 45, selection: -20, interaction: 8 },
  { name: 'Valuation', allocation: -32, selection: 15, interaction: -5 },
  { name: 'Momentum', allocation: 58, selection: 62, interaction: 10 },
  { name: 'Risk', allocation: -18, selection: -12, interaction: -4 },
  { name: 'Growth', allocation: 12, selection: 35, interaction: 5 },
  { name: 'Risk', allocation: 25, selection: -38, interaction: -7 }
];

// Mock data for factor exposure
export const factorExposureData = [
  { name: 'Quality', exposure: 0.6 },
  { name: 'Valuation', exposure: -0.4 },
  { name: 'Momentum', exposure: 0.85 },
  { name: 'Risk', exposure: -0.25 },
  { name: 'Growth', exposure: 0.15 },
  { name: 'Risk', exposure: 0.3 }
];

// Mock data for portfolio factor profile
export const factorProfileData = {
  'Valuation': 'Medium-High',
  'Growth': 'Low',
  'Quality': 'High',
  'Momentum': 'High',
  'Risk': 'Low'
}; 