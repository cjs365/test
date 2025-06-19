import { TableData, ValuationVariables } from '@/app/stock/[symbol]/modelling/types';

/**
 * Generate mock financial data for a stock
 * This will be used when the API fails to load
 */
export function generateMockData(symbol: string): {
  headers: string[];
  tableData: TableData;
  valuationVars: ValuationVariables;
} {
  // Generate headers for the last 10 years
  const currentYear = new Date().getFullYear();
  const headers: string[] = [];
  
  // Historical years (5 years)
  for (let i = 5; i > 0; i--) {
    headers.push((currentYear - i).toString());
  }
  
  // Current year
  headers.push(currentYear.toString());
  
  // Forecast years (5 years)
  for (let i = 1; i <= 5; i++) {
    headers.push((currentYear + i).toString());
  }
  
  // Generate mock table data
  const tableData: TableData = {
    // Historical and current revenue
    total_revenue: {},
    
    // Revenue growth rates
    revenue_gr: {},
    
    // Earnings margin
    earnings_margin: {},
    
    // Economic earnings
    economic_earnings: {},
    
    // Invested capital
    ic: {},
    
    // Invested capital growth rates
    ic_gr: {},
    
    // Invested capital change
    ic_change: {},
    
    // AROIC (Annual Return on Invested Capital)
    aroic: {},
    
    // Free cash flow
    fcf: {},
    
    // Free cash flow growth rates
    fcf_gr: {}
  };
  
  // Base values that will be used to generate realistic looking data
  const baseRevenue = symbol === 'AAPL' ? 365000 : // Apple
                     symbol === 'MSFT' ? 198000 : // Microsoft
                     symbol === 'GOOGL' ? 282000 : // Google
                     symbol === 'AMZN' ? 485000 : // Amazon
                     100000; // Default
  
  const baseMargin = symbol === 'AAPL' ? 25 : // Apple
                    symbol === 'MSFT' ? 35 : // Microsoft
                    symbol === 'GOOGL' ? 28 : // Google
                    symbol === 'AMZN' ? 10 : // Amazon
                    20; // Default
  
  const baseIC = baseRevenue * 0.7; // Invested capital is typically around 70% of revenue for tech companies
  
  // Fill in historical and current data
  for (let i = 0; i < 6; i++) {
    const year = headers[i];
    const yearIndex = i;
    
    // Revenue grows by 5-15% each year historically
    const revenueGrowth = 5 + Math.random() * 10;
    const revenueFactor = Math.pow(1 + revenueGrowth / 100, yearIndex);
    tableData.total_revenue[year] = Math.round(baseRevenue * revenueFactor);
    
    // Revenue growth rates
    tableData.revenue_gr[year] = revenueGrowth;
    
    // Earnings margin fluctuates around the base margin
    tableData.earnings_margin[year] = baseMargin + (Math.random() * 6 - 3);
    
    // Economic earnings
    tableData.economic_earnings[year] = Math.round(tableData.total_revenue[year] * tableData.earnings_margin[year] / 100);
    
    // Invested capital grows similar to revenue
    const icGrowth = 3 + Math.random() * 8;
    const icFactor = Math.pow(1 + icGrowth / 100, yearIndex);
    tableData.ic[year] = Math.round(baseIC * icFactor);
    
    // IC growth rates
    tableData.ic_gr[year] = icGrowth;
    
    // Calculate IC change if we have a previous year
    if (i > 0) {
      const prevYear = headers[i - 1];
      tableData.ic_change[year] = tableData.ic[year] - tableData.ic[prevYear];
    } else {
      // For the first year, assume a similar change as the next year
      tableData.ic_change[year] = Math.round(baseIC * 0.05); // Assume 5% growth for the first year
    }
    
    // AROIC (Annual Return on Invested Capital)
    tableData.aroic[year] = (tableData.economic_earnings[year] / tableData.ic[year]) * 100;
    
    // Free cash flow = Economic earnings - IC change
    tableData.fcf[year] = tableData.economic_earnings[year] - tableData.ic_change[year];
    
    // FCF growth rates (skip the first year as we need two years of FCF to calculate growth)
    if (i > 0) {
      const prevYear = headers[i - 1];
      const fcfGrowth = ((tableData.fcf[year] - tableData.fcf[prevYear]) / Math.abs(tableData.fcf[prevYear])) * 100;
      tableData.fcf_gr[year] = fcfGrowth;
    } else {
      tableData.fcf_gr[year] = 0; // No growth rate for the first year
    }
  }
  
  // Fill in forecast data
  for (let i = 6; i < headers.length; i++) {
    const year = headers[i];
    const prevYear = headers[i - 1];
    
    // Forecast revenue growth rates (gradually declining to a stable growth rate)
    const forecastIndex = i - 6;
    const revenueGrowth = Math.max(2, 8 - forecastIndex); // Start at 8%, decline to 2%
    tableData.revenue_gr[year] = revenueGrowth;
    
    // Calculate forecast revenue based on growth rate
    tableData.total_revenue[year] = Math.round(
      tableData.total_revenue[prevYear] * (1 + tableData.revenue_gr[year] / 100)
    );
    
    // Forecast margins stabilize
    tableData.earnings_margin[year] = baseMargin + (Math.random() * 2 - 1); // Small random fluctuation
    
    // Calculate forecast earnings
    tableData.economic_earnings[year] = Math.round(
      tableData.total_revenue[year] * (tableData.earnings_margin[year] / 100)
    );
    
    // Forecast IC growth rates (gradually declining)
    const icGrowth = Math.max(1, 5 - forecastIndex * 0.5); // Start at 5%, decline to 1%
    tableData.ic_gr[year] = icGrowth;
    
    // Calculate forecast IC
    tableData.ic[year] = Math.round(
      tableData.ic[prevYear] * (1 + tableData.ic_gr[year] / 100)
    );
    
    // Calculate forecast IC change
    tableData.ic_change[year] = tableData.ic[year] - tableData.ic[prevYear];
    
    // Calculate forecast AROIC
    tableData.aroic[year] = (tableData.economic_earnings[year] / tableData.ic[year]) * 100;
    
    // Calculate forecast FCF
    tableData.fcf[year] = tableData.economic_earnings[year] - tableData.ic_change[year];
    
    // Calculate forecast FCF growth
    tableData.fcf_gr[year] = ((tableData.fcf[year] - tableData.fcf[prevYear]) / Math.abs(tableData.fcf[prevYear])) * 100;
  }
  
  // Generate mock valuation variables
  const valuationVars: ValuationVariables = {
    'Shareholder ratio': 100.0,
    'Discount rate': 8.0,
    'Total debt': Math.round(tableData.total_revenue[headers[5]] * 0.2), // 20% of current revenue
    'Market investment': Math.round(tableData.total_revenue[headers[5]] * 0.05), // 5% of current revenue
    'Current market cap (mn)': Math.round(tableData.total_revenue[headers[5]] * 4 / 1000), // 4x revenue in millions
    'Interim conversion': 0.33
  };
  
  return {
    headers,
    tableData,
    valuationVars
  };
}

/**
 * Mock data for AI valuation
 */
export function generateMockAIValuation(symbol: string): string {
  return `## ${symbol} Valuation Analysis

### Company Overview
${getCompanyDescription(symbol)}

### Industry Outlook
The ${getIndustry(symbol)} industry is projected to grow at a CAGR of ${(5 + Math.random() * 5).toFixed(1)}% over the next five years, driven by ${getIndustryDrivers(symbol)}.

### Growth Assumptions
- Revenue Growth: We project a gradual deceleration from ${(8 + Math.random() * 4).toFixed(1)}% to ${(2 + Math.random() * 2).toFixed(1)}% over the forecast period
- Margin Expansion: We expect margins to ${Math.random() > 0.5 ? 'expand' : 'stabilize'} as the company ${Math.random() > 0.5 ? 'leverages economies of scale' : 'invests in future growth initiatives'}
- Capital Efficiency: AROIC should remain strong at ${(15 + Math.random() * 10).toFixed(1)}% on average

### Valuation Summary
Based on our DCF model, we estimate the fair value of ${symbol} at $${(Math.random() * 100 + 100).toFixed(2)} per share, suggesting a ${(Math.random() > 0.5 ? '+' : '-') + (Math.random() * 20).toFixed(1)}% potential from current levels.

### Risk Factors
- ${getRiskFactors(symbol)}
- Competitive pressures may intensify
- Regulatory changes could impact growth trajectory`;
}

/**
 * Mock data for AI scenario
 */
export function generateMockAIScenario(headers: string[]): {
  revenue_gr: { [year: string]: number };
  earnings_margin: { [year: string]: number };
  ic_gr: { [year: string]: number };
} {
  // Get only forecast years (last 5 years)
  const forecastYears = headers.slice(-5);
  
  const revenue_gr: { [year: string]: number } = {};
  const earnings_margin: { [year: string]: number } = {};
  const ic_gr: { [year: string]: number } = {};
  
  // Generate mock forecast data
  forecastYears.forEach((year, index) => {
    // Revenue growth gradually decreases
    revenue_gr[year] = Math.max(2, 8 - index);
    
    // Earnings margin gradually increases
    earnings_margin[year] = 20 + index * 0.5;
    
    // IC growth gradually decreases
    ic_gr[year] = Math.max(1, 5 - index * 0.5);
  });
  
  return {
    revenue_gr,
    earnings_margin,
    ic_gr
  };
}

/**
 * Generate mock sensitivity data
 */
export function generateMockSensitivityData(): {
  status: string;
  matrix: string;
} {
  // Create a range of growth rates from 0% to 10% in 2% increments
  const growthRates = [0, 2, 4, 6, 8, 10];
  
  // Create a range of IC growth rates from 0% to 5% in 1% increments
  const icGrowthRates = [0, 1, 2, 3, 4, 5];
  
  // Create a matrix of sensitivity points
  const sensitivityPoints: Record<string, { revenue_gr: number; ic_gr: number; potential_upside: number }> = {};
  
  // Fill the matrix with mock data
  let counter = 0;
  growthRates.forEach(growth => {
    icGrowthRates.forEach(icGrowth => {
      // Generate a potential upside that generally increases with growth and decreases with IC growth
      // This creates a realistic sensitivity pattern
      const baseUpside = growth * 3 - icGrowth * 2;
      const randomFactor = (Math.random() * 10) - 5; // Random factor between -5 and +5
      const potentialUpside = baseUpside + randomFactor;
      
      sensitivityPoints[`point_${counter}`] = {
        revenue_gr: growth,
        ic_gr: icGrowth,
        potential_upside: Math.round(potentialUpside)
      };
      
      counter++;
    });
  });
  
  return {
    status: 'success',
    matrix: JSON.stringify(sensitivityPoints)
  };
}

/**
 * Mock valuation calculation result
 */
export function generateMockValuationResult(): {
  status: string;
  ric: string;
  result: {
    'Enterprise Value': number;
    'Calculated upside': number;
  }
} {
  return {
    status: 'success',
    ric: 'MOCK',
    result: {
      'Enterprise Value': Math.round(1000000 + Math.random() * 1000000), // Random EV between 1M and 2M
      'Calculated upside': Math.round((Math.random() * 40) - 20) // Random upside between -20% and +20%
    }
  };
}

/**
 * Mock data for factor analysis
 */
export function generateFactorAnalysis(): string {
  return `## Current Market Factor Analysis

### Market Overview
The current market environment shows a rotation between growth and value factors, with momentum gaining traction in recent weeks. Quality factors have demonstrated resilience amid market volatility.

### Factor Performance Insights
- **Value**: ${Math.random() > 0.5 ? 'Outperforming' : 'Underperforming'} as interest rates ${Math.random() > 0.5 ? 'rise' : 'stabilize'}. Companies with strong balance sheets and reasonable valuations are attracting investors seeking stability in an uncertain economic environment.
- **Growth**: Has ${Math.random() > 0.5 ? 'recovered' : 'faced headwinds'} as concerns about inflation and interest rates ${Math.random() > 0.5 ? 'subside' : 'persist'}. Technology and consumer discretionary sectors remain the primary drivers.
- **Quality**: Continues to be a defensive factor with lower volatility and more consistent returns. Companies with stable earnings and strong cash flows are favored in the current environment.
- **Momentum**: ${Math.random() > 0.5 ? 'Accelerating' : 'Decelerating'} as market trends ${Math.random() > 0.5 ? 'strengthen' : 'rotate'}. Recent winners continue to attract capital, though factor crowding remains a risk.
- **Size**: Small caps have ${Math.random() > 0.5 ? 'outperformed' : 'underperformed'} large caps, reflecting ${Math.random() > 0.5 ? 'improving risk appetite' : 'a flight to quality'}.
- **Volatility**: Low volatility strategies have ${Math.random() > 0.5 ? 'provided downside protection' : 'lagged in the risk-on environment'}, highlighting the importance of dynamic factor allocation.

### Strategy Implications
Investors may benefit from a ${Math.random() > 0.5 ? 'balanced' : 'tactical'} approach to factor allocation in the current environment. Consider ${Math.random() > 0.5 ? 'increasing exposure to value and quality' : 'maintaining a diversified factor exposure'} while monitoring momentum signals for potential market shifts.

### Outlook
We expect factor performance to remain ${Math.random() > 0.5 ? 'volatile' : 'relatively stable'} in the near term as the market digests economic data and central bank policies. Key catalysts to watch include inflation trends, earnings reports, and changes in monetary policy.`;
}

// Helper functions for company-specific mock data
function getCompanyDescription(symbol: string): string {
  switch(symbol.toUpperCase()) {
    case 'AAPL':
      return 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and wearables, home, and accessories.';
    case 'MSFT':
      return 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide. The company operates through three segments: Productivity and Business Processes, Intelligent Cloud, and More Personal Computing.';
    case 'GOOGL':
      return 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America. It operates through Google Services, Google Cloud, and Other Bets segments.';
    case 'AMZN':
      return 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions through online and physical stores in North America and internationally. It operates through e-commerce, AWS, and subscription services.';
    default:
      return 'This company operates in multiple segments across various markets, providing products and services to both consumers and businesses.';
  }
}

function getIndustry(symbol: string): string {
  switch(symbol.toUpperCase()) {
    case 'AAPL': return 'consumer electronics';
    case 'MSFT': return 'software and cloud computing';
    case 'GOOGL': return 'internet services and digital advertising';
    case 'AMZN': return 'e-commerce and cloud computing';
    default: return 'technology';
  }
}

function getIndustryDrivers(symbol: string): string {
  switch(symbol.toUpperCase()) {
    case 'AAPL': 
      return 'increasing smartphone penetration in emerging markets and growing wearables adoption';
    case 'MSFT': 
      return 'digital transformation initiatives and increasing cloud adoption across enterprises';
    case 'GOOGL': 
      return 'continued shift of advertising budgets to digital platforms and growing demand for AI solutions';
    case 'AMZN': 
      return 'e-commerce penetration growth and enterprise cloud migration';
    default: 
      return 'digital transformation and technological innovation';
  }
}

function getRiskFactors(symbol: string): string {
  switch(symbol.toUpperCase()) {
    case 'AAPL': 
      return 'Supply chain disruptions and elongating replacement cycles';
    case 'MSFT': 
      return 'Increasing competition in the cloud space and cybersecurity threats';
    case 'GOOGL': 
      return 'Regulatory scrutiny and privacy concerns affecting the advertising business';
    case 'AMZN': 
      return 'Margin pressure in retail and increasing competition in cloud services';
    default: 
      return 'Macroeconomic headwinds and changing consumer preferences';
  }
} 