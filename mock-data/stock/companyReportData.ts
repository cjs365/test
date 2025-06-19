// Define the financial metric type
export interface FinancialMetric {
  name: string;
  values?: { [year: string]: number };
  isSubItem?: boolean;
  isBold?: boolean;
  [year: string]: any;
}

// Generate mock income statement data
export const generateMockIncomeStatement = (symbol: string): FinancialMetric[] => {
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
    }
  ];
};

// Generate mock balance sheet data
export const generateMockBalanceSheet = (symbol: string): FinancialMetric[] => {
  return [
    {
      name: 'Cash and Short Term Investments',
      values: {
        '2020': 94051,
        '2021': 103800,
        '2022': 92959,
        '2023': 90364,
        '2024': 96684,
      },
      isBold: true
    },
    {
      name: 'Total Receivables, Net',
      values: {
        '2020': 26278,
        '2021': 35380,
        '2022': 36288,
        '2023': 37007,
        '2024': 38743,
      }
    },
    {
      name: 'Total Current Assets',
      values: {
        '2020': 143713,
        '2021': 162819,
        '2022': 153982,
        '2023': 152860,
        '2024': 160932,
      },
      isBold: true
    },
    {
      name: 'Property/Plant/Equipment, Total - Gross',
      values: {
        '2020': 103526,
        '2021': 126551,
        '2022': 146360,
        '2023': 164207,
        '2024': 179374,
      }
    },
    {
      name: 'Property/Plant/Equipment, Total - Net',
      values: {
        '2020': 36766,
        '2021': 39440,
        '2022': 42117,
        '2023': 43715,
        '2024': 45274,
      },
      isBold: true
    },
    {
      name: 'Total Assets',
      values: {
        '2020': 323888,
        '2021': 351002,
        '2022': 352755,
        '2023': 355640,
        '2024': 379825,
      },
      isBold: true
    }
  ];
};

// Generate mock cash flow data
export const generateMockCashFlow = (symbol: string): FinancialMetric[] => {
  return [
    {
      name: 'Net Income/Starting Line',
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
      name: 'Depreciation/Depletion',
      values: {
        '2020': 11056,
        '2021': 11284,
        '2022': 12026,
        '2023': 12624,
        '2024': 13287,
      }
    },
    {
      name: 'Cash from Operating Activities',
      values: {
        '2020': 80674,
        '2021': 104038,
        '2022': 122151,
        '2023': 113836,
        '2024': 120420,
      },
      isBold: true
    },
    {
      name: 'Capital Expenditures',
      values: {
        '2020': -7309,
        '2021': -11085,
        '2022': -10708,
        '2023': -10281,
        '2024': -11463,
      }
    },
    {
      name: 'Cash from Investing Activities',
      values: {
        '2020': -4289,
        '2021': -14545,
        '2022': -22008,
        '2023': -20515,
        '2024': -22842,
      },
      isBold: true
    },
    {
      name: 'Dividends Paid - Common',
      values: {
        '2020': -14081,
        '2021': -14467,
        '2022': -14841,
        '2023': -15102,
        '2024': -15390,
      }
    },
    {
      name: 'Cash from Financing Activities',
      values: {
        '2020': -86820,
        '2021': -93353,
        '2022': -110749,
        '2023': -95966,
        '2024': -91258,
      },
      isBold: true
    },
    {
      name: 'Free Cash Flow',
      values: {
        '2020': 73365,
        '2021': 92953,
        '2022': 111443,
        '2023': 103555,
        '2024': 108957,
      },
      isBold: true
    }
  ];
}; 