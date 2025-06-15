// Utility function to format numbers with thousand separators
export const formatWithCommas = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '0';
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0';
  }
  
  // Format with thousand separators
  return numValue.toLocaleString('en-US', { 
    minimumFractionDigits: numValue % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1 
  });
};

// Utility function to format large numbers with scale determination
export const formatLargeNumber = (value: number | string | null | undefined, preferredUnit?: string) => {
  // Handle non-numeric values
  if (value === null || value === undefined || value === '') {
    return {
      value: 0,
      unit: '',
      formatted: '0'
    };
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return {
      value: 0,
      unit: '',
      formatted: '0'
    };
  }

  const absValue = Math.abs(numValue);
  let unit = preferredUnit;
  let scaledValue = numValue;

  if (!unit) {
    if (absValue >= 1e12) {
      unit = 'T';
      scaledValue = numValue / 1e12;
    } else if (absValue >= 1e9) {
      unit = 'B';
      scaledValue = numValue / 1e9;
    } else if (absValue >= 1e6) {
      unit = 'M';
      scaledValue = numValue / 1e6;
    } else {
      unit = '';
    }
  } else {
    // Scale based on preferred unit
    switch (unit) {
      case 'T':
        scaledValue = numValue / 1e12;
        break;
      case 'B':
        scaledValue = numValue / 1e9;
        break;
      case 'M':
        scaledValue = numValue / 1e6;
        break;
    }
  }

  return {
    value: scaledValue,
    unit,
    formatted: `${formatWithCommas(scaledValue)}${unit}`
  };
};

// Function to determine the best unit for a dataset
export const determineUnit = (values: (number | undefined | null)[]) => {
  // Filter out non-numeric values
  const validValues = values.filter((val): val is number => 
    val !== undefined && val !== null && !isNaN(val));
  
  if (validValues.length === 0) return '';
  
  const maxAbs = Math.max(...validValues.map(Math.abs));
  if (maxAbs >= 1e12) return 'T';
  if (maxAbs >= 1e9) return 'B';
  if (maxAbs >= 1e6) return 'M';
  return '';
}; 