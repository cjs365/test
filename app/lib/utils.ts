import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Unit = '.0' | '.00' | 'K' | 'M' | 'B';

// Function to add thousands separators
const addThousandsSeparators = (num: number): string => {
  const parts = num.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

// Function to format number with specified decimal places
const formatDecimal = (num: number, decimals: number): string => {
  return addThousandsSeparators(Number(num.toFixed(decimals)));
};

// Convert number to target unit (assuming input is in millions)
const convertToUnit = (value: number, targetUnit: Unit): number => {
  switch (targetUnit) {
    case 'B':
      return value / 1000; // Convert millions to billions
    case 'K':
      return value * 1000; // Convert millions to thousands
    case '.0':
    case '.00':
    case 'M':
      return value; // Keep as millions
    default:
      return value;
  }
};

// Main formatting function
export const formatNumber = (value: number, unit: Unit): string => {
  const convertedValue = convertToUnit(value, unit);
  
  switch (unit) {
    case '.0':
      return formatDecimal(convertedValue, 1);
    case '.00':
      return formatDecimal(convertedValue, 2);
    case 'K':
    case 'M':
    case 'B':
      return formatDecimal(convertedValue, 0);
    default:
      return formatDecimal(convertedValue, 0);
  }
};

// Legacy function maintained for backward compatibility
export const formatLargeNumber = (value: number) => {
  return {
    value,
    unit: 'M',
    formatted: value.toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    })
  };
}; 