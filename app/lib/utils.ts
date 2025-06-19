import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a hex color to an RGBA color with specified opacity
 */
export function hexToRgba(hex: string, alpha: number): string {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  let r = parseInt(hex.length === 3 ? hex.substring(0, 1).repeat(2) : hex.substring(0, 2), 16);
  let g = parseInt(hex.length === 3 ? hex.substring(1, 2).repeat(2) : hex.substring(2, 4), 16);
  let b = parseInt(hex.length === 3 ? hex.substring(2, 3).repeat(2) : hex.substring(4, 6), 16);
  
  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns a highlighted background color based on the input color with reduced opacity
 */
export function getHighlightedBgColor(color: string, opacity: number = 0.2): string {
  // For hex colors
  if (color.startsWith('#')) {
    return hexToRgba(color, opacity);
  }
  
  // For named colors (common ones)
  const namedColors: Record<string, string> = {
    red: '#f44336',
    blue: '#2196f3',
    green: '#4caf50',
    orange: '#ff9800',
    purple: '#9c27b0',
    yellow: '#ffeb3b',
    grey: '#9e9e9e',
    black: '#000000'
  };
  
  if (color in namedColors) {
    return hexToRgba(namedColors[color], opacity);
  }
  
  // For rgb/rgba colors
  if (color.startsWith('rgb')) {
    // If already rgba, just modify opacity
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/, `${opacity})`);
    }
    // Convert rgb to rgba
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  // Default fallback
  return `rgba(0, 0, 0, ${opacity})`;
}

/**
 * Smart formatting for tooltip values with type detection
 * @param value - The value to format
 * @param dataName - The name of the data series (optional)
 * @param options - Formatting options
 * @returns Formatted value as string
 */
export function formatTooltipValue(
  value: any, 
  dataName?: string, 
  options: {
    formatType?: 'auto' | 'number' | 'percent' | 'currency' | 'short';
    decimals?: number;
    unit?: string;
    prefix?: string;
    forceSign?: boolean;
  } = {}
): string {
  if (value === null || value === undefined) return 'N/A';
  
  const {
    formatType = 'auto',
    decimals = 1,
    unit = '',
    prefix = '',
    forceSign = false,
  } = options;

  // Use data name to guess format if set to auto
  const nameLower = (dataName || '').toLowerCase();
  let type = formatType;
  
  if (type === 'auto') {
    if (nameLower.includes('percent') || 
        nameLower.includes('growth') || 
        nameLower.includes('margin') || 
        nameLower.includes('rate') ||
        nameLower.includes('%')) {
      type = 'percent';
    } else if (nameLower.includes('price') || 
              nameLower.includes('cost') || 
              nameLower.includes('revenue') || 
              nameLower.includes('income')) {
      type = 'currency';
    } else if (typeof value === 'number' && Math.abs(value) >= 1000) {
      type = 'short';
    } else {
      type = 'number';
    }
  }
  
  // Convert to number if needed
  const numberValue = typeof value === 'number' ? value : parseFloat(value);
  
  // Handle NaN
  if (isNaN(numberValue)) return String(value);
  
  // Format based on type
  const sign = forceSign && numberValue > 0 ? '+' : '';
  
  switch (type) {
    case 'percent':
      return `${sign}${numberValue.toFixed(decimals)}%`;
      
    case 'currency':
      return `${prefix}${numberValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${unit ? ` ${unit}` : ''}`;
      
    case 'short':
      const absValue = Math.abs(numberValue);
      if (absValue >= 1e9) {
        return `${sign}${(numberValue / 1e9).toFixed(decimals)}B${unit ? ` ${unit}` : ''}`;
      } else if (absValue >= 1e6) {
        return `${sign}${(numberValue / 1e6).toFixed(decimals)}M${unit ? ` ${unit}` : ''}`;
      } else if (absValue >= 1e3) {
        return `${sign}${(numberValue / 1e3).toFixed(decimals)}K${unit ? ` ${unit}` : ''}`;
      }
      // Fall through to default formatting
      
    default:
      return `${sign}${numberValue.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${unit ? ` ${unit}` : ''}`;
  }
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