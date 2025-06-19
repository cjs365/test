export interface FinancialMetric {
  name: string;
  values?: { [year: string]: number };
  isSubItem?: boolean;
  isBold?: boolean;
  [year: string]: any; // To accommodate the API response format
}

interface ApiResponse {
  ric: string;
  data: FinancialMetric[];
}

export type ReportType = 'income' | 'balance' | 'cash_flow';

// Function to fetch financial data from the API
export const fetchFinancialData = async (
  symbol: string,
  reportType: ReportType
): Promise<FinancialMetric[]> => {
  try {
    const response = await fetch(
      `/api/v1/stock/${symbol}/financial?report_type=${reportType}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${reportType} data: ${response.statusText}`);
    }
    
    const data: ApiResponse = await response.json();
    
    // Transform the API response to match our expected format
    return data.data.map(item => {
      const values: { [year: string]: number } = {};
      
      // Extract years from the item and add to values object
      Object.keys(item).forEach(key => {
        if (key !== 'name' && !isNaN(parseInt(key))) {
          values[key] = item[key];
        }
      });
      
      // Process name to extract boldness indicator
      let displayName = item.name;
      let isBold = false;
      
      // Check if the name ends with 0 or 1 to determine boldness
      if (displayName.length > 0) {
        const lastChar = displayName.charAt(displayName.length - 1);
        if (lastChar === '1' || lastChar === '0') {
          // Remove the last character from the name
          displayName = displayName.substring(0, displayName.length - 1);
          // Set bold if the last character is '1'
          isBold = lastChar === '1';
        }
      }
      
      return {
        name: displayName,
        values,
        isBold
      };
    });
  } catch (error) {
    console.error(`Error fetching ${reportType} data:`, error);
    return getFinancialData(); // Return fallback mock data in case of error
  }
};

// Fallback mock data in case the API is not available
export const getFinancialData = (): FinancialMetric[] => {
  return [
    {
      name: 'Gross Profit',
      values: {
        '2020': 104956,
        '2021': 152836,
        '2022': 170782,
        '2023': 169148,
        '2024': 180683,
      },
      isBold: true
    },
    {
      name: 'Operating Income/Expenses',
      values: {
        '2020': -38668,
        '2021': -43887,
        '2022': -51345,
        '2023': -54847,
        '2024': -57467,
      }
    },
    {
      name: 'Total Operating Profit/Loss',
      values: {
        '2020': 66288,
        '2021': 108949,
        '2022': 119437,
        '2023': 114301,
        '2024': 123216,
      },
      isBold: true
    },
    {
      name: 'Non-Operating Income/Expense, Total',
      values: {
        '2020': 803,
        '2021': 258,
        '2022': -334,
        '2023': -565,
        '2024': 269,
      }
    },
    {
      name: 'Pretax Income',
      values: {
        '2020': 67091,
        '2021': 109207,
        '2022': 119103,
        '2023': 113736,
        '2024': 123485,
      },
      isBold: true
    },
    {
      name: 'Provision for Income Tax',
      values: {
        '2020': -9680,
        '2021': -14527,
        '2022': -19300,
        '2023': -16741,
        '2024': -29749,
      }
    },
    {
      name: 'Net Income before Extraordinary Items',
      values: {
        '2020': 57411,
        '2021': 94680,
        '2022': 99803,
        '2023': 96995,
        '2024': 93736,
      },
      isBold: true
    },
    {
      name: 'Net Income Available to Common Stockholders',
      values: {
        '2020': 57411,
        '2021': 94680,
        '2022': 99803,
        '2023': 96995,
        '2024': 93736,
      },
      isBold: true
    },
    {
      name: 'Basic Weighted Average Shares Outstanding',
      values: {
        '2020': 17352.12,
        '2021': 16701.27,
        '2022': 16215.96,
        '2023': 15744.23,
        '2024': 15343.78,
      }
    },
    {
      name: 'Diluted Weighted Average Shares Outstanding',
      values: {
        '2020': 17528.21,
        '2021': 16864.92,
        '2022': 16325.82,
        '2023': 15812.55,
        '2024': 15408.10,
      }
    },
    {
      name: 'Total Dividend Per Share',
      values: {
        '2020': 0.795,
        '2021': 0.850,
        '2022': 0.900,
        '2023': 0.940,
        '2024': 0.980,
      }
    },
  ];
}

export const getYearsFromData = (data: FinancialMetric[]): string[] => {
  if (data.length === 0) return [];
  
  // Extract years from the first item's values
  const firstItem = data[0];
  if (!firstItem.values) return [];
  
  return Object.keys(firstItem.values).sort();
};

export const getForecastYearsFromData = (data: FinancialMetric[]): string[] => {
  if (data.length === 0) return [];
  
  const years = getYearsFromData(data);
  // Assume the last two years are forecast years
  return years.slice(-2);
};

// Legacy exports for backward compatibility
export const years = ['2020', '2021', '2022', '2023', '2024'];
export const forecastYears = ['2023', '2024']; 