import { ValuationVariables } from '../types';

// Calculation functions for financial metrics
export const calculateTotalRevenue = (prevRevenue: number, growthRate: number) => {
  console.log(`calculateTotalRevenue: ${prevRevenue} * (1 + ${growthRate}/100)`);
  const result = prevRevenue * (1 + growthRate / 100);
  console.log(`calculateTotalRevenue result: ${result}`);
  return result;
};

export const calculateEconomicEarnings = (revenue: number, margin: number) => {
  console.log(`calculateEconomicEarnings: ${revenue} * (${margin}/100)`);
  const result = revenue * (margin / 100);
  console.log(`calculateEconomicEarnings result: ${result}`);
  return result;
};

export const calculateIC = (prevIC: number, growthRate: number) => {
  console.log(`calculateIC: ${prevIC} * (1 + ${growthRate}/100)`);
  const result = prevIC * (1 + growthRate / 100);
  console.log(`calculateIC result: ${result}`);
  return result;
};

export const calculateAROIC = (earnings: number, ic: number) => {
  console.log(`calculateAROIC: (${earnings} / ${ic}) * 100`);
  const result = (earnings / ic) * 100;
  console.log(`calculateAROIC result: ${result}`);
  return result;
};

export const calculateICChange = (currentIC: number, prevIC: number) => {
  console.log(`calculateICChange: ${currentIC} - ${prevIC}`);
  const result = currentIC - prevIC;
  console.log(`calculateICChange result: ${result}`);
  return result;
};

// Function overload signatures
export function calculateFCF(earnings: number, icChange: number): number;
export function calculateFCF(earnings: { [year: string]: number }, icChange: { [year: string]: number }): { [year: string]: number };

// Implementation that handles both cases
export function calculateFCF(
  earnings: number | { [year: string]: number }, 
  icChange: number | { [year: string]: number }
): number | { [year: string]: number } {
  // Check if inputs are objects
  if (typeof earnings === 'object' && typeof icChange === 'object') {
    console.log(`calculateFCF called with objects:`, { earnings, icChange });
    const result: { [year: string]: number } = {};
    
    // Process each year in the earnings object
    Object.keys(earnings).forEach(year => {
      if (icChange[year] !== undefined) {
        result[year] = earnings[year] - icChange[year];
        console.log(`calculateFCF year ${year}: ${earnings[year]} - ${icChange[year]} = ${result[year]}`);
      }
    });
    
    return result;
  }
  
  // If inputs are numbers, use the original implementation
  if (typeof earnings === 'number' && typeof icChange === 'number') {
    console.log(`calculateFCF: ${earnings} - ${icChange}`);
    const result = earnings - icChange;
    console.log(`calculateFCF result: ${result}`);
    return result;
  }
  
  // Handle mixed types by returning an empty object or 0
  console.log(`calculateFCF called with mixed types, returning default value`);
  return typeof earnings === 'object' ? {} : 0;
}

// Add calculation functions for valuation results
export const calculateEnterpriseValue = (vars: ValuationVariables, fcf: { [year: string]: number }, headers: string[]) => {
  console.log(`calculateEnterpriseValue called with:`, { vars, fcf, headers });
  const discountRate = vars['Discount rate'] / 100;
  let totalValue = 0;
  
  // Calculate present value of forecasted cash flows
  headers.slice(6).forEach((year, index) => {
    const cashFlow = fcf[year];
    const discountFactor = Math.pow(1 + discountRate, index + 1);
    const presentValue = cashFlow / discountFactor;
    console.log(`Year ${year}: cashFlow=${cashFlow}, discountFactor=${discountFactor}, presentValue=${presentValue}`);
    totalValue += presentValue;
  });

  // Add terminal value
  const terminalYear = headers[headers.length - 1];
  const terminalCashFlow = fcf[terminalYear];
  const terminalValue = (terminalCashFlow * (1 + 0.02)) / (discountRate - 0.02); // Assuming 2% perpetual growth
  const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, headers.length - 6);
  console.log(`Terminal value: year=${terminalYear}, cashFlow=${terminalCashFlow}, terminalValue=${terminalValue}, discounted=${discountedTerminalValue}`);
  totalValue += discountedTerminalValue;

  console.log(`calculateEnterpriseValue result: ${totalValue}`);
  return totalValue;
};

export const calculateEquityValue = (enterpriseValue: number, vars: ValuationVariables) => {
  console.log(`calculateEquityValue: ${enterpriseValue} - ${vars['Total debt']} + ${vars['Market investment']}`);
  const result = enterpriseValue - vars['Total debt'] + vars['Market investment'];
  console.log(`calculateEquityValue result: ${result}`);
  return result;
};

export const calculatePricePerShare = (equityValue: number, vars: ValuationVariables) => {
  const sharesOutstanding = vars['Current market cap (mn)'] / 185.20; // Using current price to back out shares
  console.log(`calculatePricePerShare: (${equityValue} / 1e6) / ${sharesOutstanding}`);
  const result = (equityValue / 1e6) / sharesOutstanding; // Convert to millions for per share calculation
  console.log(`calculatePricePerShare result: ${result}`);
  return result;
};

// Function overload signatures for growth rate calculation
export function calculateGrowthRate(currentValue: number, previousValue: number): number;
export function calculateGrowthRate(values: { [year: string]: number }, years: string[]): { [year: string]: number };

// Implementation that handles both cases
export function calculateGrowthRate(
  arg1: number | { [year: string]: number },
  arg2: number | string[]
): number | { [year: string]: number } {
  // Check if calculating growth rate for objects (data across years)
  if (typeof arg1 === 'object' && Array.isArray(arg2)) {
    console.log(`calculateGrowthRate called with object and years array`);
    const values = arg1;
    const years = arg2;
    const result: { [year: string]: number } = {};
    
    // Skip the first year as we need a previous value to calculate growth
    for (let i = 1; i < years.length; i++) {
      const currentYear = years[i];
      const previousYear = years[i-1];
      
      if (values[currentYear] !== undefined && values[previousYear] !== undefined) {
        const currentValue = values[currentYear];
        const previousValue = values[previousYear];
        
        // Calculate growth rate using the base implementation
        if (previousValue === 0) {
          result[currentYear] = 0;
        } else {
          result[currentYear] = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
        }
        
        console.log(`calculateGrowthRate year ${currentYear}: ((${currentValue} - ${previousValue}) / |${previousValue}|) * 100 = ${result[currentYear]}`);
      }
    }
    
    return result;
  }
  
  // If inputs are numbers, use the original implementation
  if (typeof arg1 === 'number' && typeof arg2 === 'number') {
    const currentValue = arg1;
    const previousValue = arg2;
    
    console.log(`calculateGrowthRate: ((${currentValue} - ${previousValue}) / |${previousValue}|) * 100`);
    if (previousValue === 0) {
      console.log(`calculateGrowthRate result: 0 (previous value is 0)`);
      return 0;
    }
    const result = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
    console.log(`calculateGrowthRate result: ${result}`);
    return result;
  }
  
  // Handle mixed types by returning an empty object or 0
  console.log(`calculateGrowthRate called with invalid argument types, returning default value`);
  return typeof arg1 === 'object' ? {} : 0;
} 