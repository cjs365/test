'use client';

import { useState, useEffect, useRef } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Utility function to format large numbers with scale determination
const formatLargeNumber = (value: number, preferredUnit?: string) => {
  const absValue = Math.abs(value);
  let unit = preferredUnit;
  let scaledValue = value;

  if (!unit) {
    if (absValue >= 1e12) {
      unit = 'T';
      scaledValue = value / 1e12;
    } else if (absValue >= 1e9) {
      unit = 'B';
      scaledValue = value / 1e9;
    } else if (absValue >= 1e6) {
      unit = 'M';
      scaledValue = value / 1e6;
    } else {
      unit = '';
    }
  } else {
    // Scale based on preferred unit
    switch (unit) {
      case 'T':
        scaledValue = value / 1e12;
        break;
      case 'B':
        scaledValue = value / 1e9;
        break;
      case 'M':
        scaledValue = value / 1e6;
        break;
    }
  }

  return {
    value: scaledValue,
    unit,
    formatted: `${scaledValue.toFixed(1)}${unit}`
  };
};

// Function to determine the best unit for a dataset
const determineUnit = (values: number[]) => {
  const maxAbs = Math.max(...values.map(Math.abs));
  if (maxAbs >= 1e12) return 'T';
  if (maxAbs >= 1e9) return 'B';
  if (maxAbs >= 1e6) return 'M';
  return '';
};

// Custom tooltip formatter with more context
const CustomTooltip = ({ active, payload, label, preferredUnit }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isForecast = payload[0].payload.isForecast;
    const formatted = formatLargeNumber(value, preferredUnit);
    return (
      <div className="bg-white border border-gray-200 shadow-sm p-3 text-xs">
        <p className="font-medium text-gray-900">{label} {isForecast && '(Forecast)'}</p>
        <div className="mt-1 space-y-1">
          <p className="text-gray-700">
            {payload[0].name}: <span className="font-medium">{formatted.formatted}</span>
          </p>
          {isForecast && (
            <p className="text-blue-600 text-[10px]">Forecasted value</p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Legend for historical vs forecast
const CustomLegend = () => {
  return (
    <div className="flex items-center justify-end space-x-4 text-[10px] text-gray-600 mb-2">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-[#0A4174] mr-1"></div>
        <span>Historical</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-[#93C5FD] mr-1"></div>
        <span>Forecast</span>
      </div>
    </div>
  );
};

type Year = string;

interface TableData {
  [key: string]: {
    [year: string]: number;
  };
}

interface MetricConfig {
  key: string;
  label: string;
  format: 'number' | 'percent';
  editable?: boolean;
  italic?: boolean;
}

interface ValuationVariables {
  'Shareholder ratio': number;
  'Discount rate': number;
  'Total debt': number;
  'Market investment': number;
  'Current market cap (mn)': number;
  'Interim conversion': number;
}

interface AIScenario {
  revenue_gr: { [year: string]: number };
  earnings_margin: { [year: string]: number };
  ic_gr: { [year: string]: number };
}

interface MockData {
  headers: Year[];
  data: TableData;
  val1_display: ValuationVariables;
}

// Mock data based on the provided values
const mockData: MockData = {
  headers: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'],
  data: {
    total_revenue: {
      '2019': 26017, '2020': 27451, '2021': 36581, '2022': 39432, '2023': 38328,
      '2024': 39103, '2025': 40528, '2026': 42980, '2027': 45581, '2028': 48340, '2029': 51265
    },
    revenue_gr: {
      '2019': -2.0, '2020': 5.5, '2021': 33.3, '2022': 7.8, '2023': -2.8,
      '2024': 2.0, '2025': 3.6, '2026': 6.1, '2027': 6.1, '2028': 6.1, '2029': 6.1
    },
    economic_earnings: {
      '2019': 61552, '2020': 66597, '2021': 10367, '2022': 11479, '2023': 11159,
      '2024': 11728, '2025': 11864, '2026': 12467, '2027': 13221, '2028': 14021, '2029': 14870
    },
    earnings_margin: {
      '2019': 23.7, '2020': 24.3, '2021': 28.3, '2022': 29.1, '2023': 29.1,
      '2024': 30.0, '2025': 29.3, '2026': 29.0, '2027': 29.0, '2028': 29.0, '2029': 29.0
    },
    ic: {
      '2019': 18534, '2020': 16958, '2021': 15782, '2022': 13623, '2023': 16566,
      '2024': 16629, '2025': 18622, '2026': 20402, '2027': 22353, '2028': 24489, '2029': 26830
    },
    ic_gr: {
      '2019': 35.8, '2020': -8.5, '2021': -6.9, '2022': -13.7, '2023': 21.6,
      '2024': 0.4, '2025': 12.0, '2026': 9.6, '2027': 9.6, '2028': 9.6, '2029': 9.6
    },
    aroic: {
      '2019': 33.2, '2020': 39.3, '2021': 65.7, '2022': 84.3, '2023': 67.4,
      '2024': 70.5, '2025': 63.7, '2026': 61.1, '2027': 59.2, '2028': 57.3, '2029': 55.4
    },
    fcf: {
      '2019': -12376, '2020': 82352, '2021': 11543, '2022': 13638, '2023': 82156,
      '2024': 11664, '2025': 98719, '2026': 10687, '2027': 11271, '2028': 11885, '2029': 12529
    }
  },
  val1_display: {
    'Shareholder ratio': 100.0,
    'Discount rate': 8,
    'Total debt': 115868,
    'Market investment': 91479,
    'Current market cap (mn)': 2990301,
    'Interim conversion': 0.33
  }
};

// Add calculation functions
const calculateTotalRevenue = (prevRevenue: number, growthRate: number) => {
  return prevRevenue * (1 + growthRate / 100);
};

const calculateEconomicEarnings = (revenue: number, margin: number) => {
  return revenue * (margin / 100);
};

const calculateIC = (prevIC: number, growthRate: number) => {
  return prevIC * (1 + growthRate / 100);
};

const calculateAROIC = (earnings: number, ic: number) => {
  return (earnings / ic) * 100;
};

const calculateICChange = (currentIC: number, prevIC: number) => {
  return currentIC - prevIC;
};

const calculateFCF = (earnings: number, icChange: number) => {
  return earnings - icChange;
};

// Add calculation functions for valuation results
const calculateEnterpriseValue = (vars: ValuationVariables, fcf: { [year: string]: number }, headers: Year[]) => {
  const discountRate = vars['Discount rate'] / 100;
  let totalValue = 0;
  
  // Calculate present value of forecasted cash flows
  headers.slice(6).forEach((year, index) => {
    const cashFlow = fcf[year];
    totalValue += cashFlow / Math.pow(1 + discountRate, index + 1);
  });

  // Add terminal value
  const terminalYear = headers[headers.length - 1];
  const terminalCashFlow = fcf[terminalYear];
  const terminalValue = (terminalCashFlow * (1 + 0.02)) / (discountRate - 0.02); // Assuming 2% perpetual growth
  totalValue += terminalValue / Math.pow(1 + discountRate, headers.length - 6);

  return totalValue;
};

const calculateEquityValue = (enterpriseValue: number, vars: ValuationVariables) => {
  return enterpriseValue - vars['Total debt'] + vars['Market investment'];
};

const calculatePricePerShare = (equityValue: number, vars: ValuationVariables) => {
  const sharesOutstanding = vars['Current market cap (mn)'] / 185.20; // Using current price to back out shares
  return (equityValue / 1e6) / sharesOutstanding; // Convert to millions for per share calculation
};

// Add function to calculate growth rate
const calculateGrowthRate = (currentValue: number, previousValue: number) => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

export default function ModellingPage({ params }: { params: { symbol: string } }) {
  const [tableData, setTableData] = useState<TableData>(() => {
    // Initialize with mock data and calculate IC change
    const initialData: TableData = {
      total_revenue: { ...mockData.data.total_revenue },
      revenue_gr: { ...mockData.data.revenue_gr },
      economic_earnings: { ...mockData.data.economic_earnings },
      earnings_margin: { ...mockData.data.earnings_margin },
      ic: { ...mockData.data.ic },
      ic_gr: { ...mockData.data.ic_gr },
      ic_change: {},  // Will be calculated
      aroic: { ...mockData.data.aroic },
      fcf: { ...mockData.data.fcf },
      fcf_gr: {}  // New FCF growth rate field
    };

    // Calculate initial IC change values
    mockData.headers.forEach((year, index) => {
      if (index > 0) {
        const prevYear = mockData.headers[index - 1];
        initialData.ic_change[year] = calculateICChange(
          initialData.ic[year],
          initialData.ic[prevYear]
        );
        // Calculate initial FCF growth rate
        initialData.fcf_gr[year] = calculateGrowthRate(
          initialData.fcf[year],
          initialData.fcf[prevYear]
        );
      } else {
        initialData.ic_change[year] = 0; // First year has no change
        initialData.fcf_gr[year] = 0; // First year has no growth rate
      }
    });

    return initialData;
  });

  const [valuationVars, setValuationVars] = useState<ValuationVariables>(mockData.val1_display);
  const [aiValuation, setAiValuation] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingDots, setLoadingDots] = useState('');
  const [isVariablesExpanded, setIsVariablesExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiValuationExpanded, setIsAiValuationExpanded] = useState(true);
  const [aiScenario, setAiScenario] = useState<AIScenario | null>(null);

  // Add ref for scroll container
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to right on mount
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = tableContainerRef.current.scrollWidth;
    }
  }, []);

  // Add loading dots animation effect
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots('');
    }
  }, [isGenerating]);

  // Add handler for valuation variables
  const handleValuationVarChange = (key: keyof ValuationVariables, value: string) => {
    // Allow any input, including empty string and partial numbers
    setValuationVars(prev => ({
      ...prev,
      [key]: value === '' || isNaN(Number(value)) ? 0 : Number(value)
    }));
  };

  const handleInputChange = (metric: string, year: string, value: string) => {
    const yearIndex = mockData.headers.indexOf(year);
    
    // Only allow changes for last 5 years and specific metrics
    if (yearIndex < 6 || !['revenue_gr', 'earnings_margin', 'ic_gr'].includes(metric)) {
      return;
    }

    setTableData(prev => {
      const newData = { ...prev };
      const numValue = value === '' || isNaN(Number(value)) ? 0 : Number(value);
      newData[metric][year] = numValue;

      // Get the previous year for calculations
      const prevYear = mockData.headers[yearIndex - 1];

      // Recalculate dependent values
      if (metric === 'revenue_gr') {
        newData.total_revenue[year] = calculateTotalRevenue(
          newData.total_revenue[prevYear],
          numValue
        );
        // Update earnings when revenue changes
        newData.economic_earnings[year] = calculateEconomicEarnings(
          newData.total_revenue[year],
          newData.earnings_margin[year]
        );
      } else if (metric === 'earnings_margin') {
        newData.economic_earnings[year] = calculateEconomicEarnings(
          newData.total_revenue[year],
          numValue
        );
      } else if (metric === 'ic_gr') {
        newData.ic[year] = calculateIC(
          newData.ic[prevYear],
          numValue
        );
      }

      // Always update IC Change, AROIC, and FCF as they depend on other metrics
      newData.ic_change[year] = calculateICChange(
        newData.ic[year],
        newData.ic[prevYear]
      );

      newData.aroic[year] = calculateAROIC(
        newData.economic_earnings[year],
        newData.ic[year]
      );

      newData.fcf[year] = calculateFCF(
        newData.economic_earnings[year],
        newData.ic_change[year]
      );

      // Calculate FCF growth rate
      newData.fcf_gr[year] = calculateGrowthRate(
        newData.fcf[year],
        newData.fcf[prevYear]
      );

      return newData;
    });
  };

  const handleGenerateValuation = async () => {
    setIsGenerating(true);
    const loadingSteps = [
      'Searching for news',
      'Collecting market data',
      'Analyzing financials',
      'Reasoning about valuation',
      'Compiling final data'
    ];

    for (const step of loadingSteps) {
      setLoadingMessage(step);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Simulating AI response for now
    setTimeout(() => {
      // Generate scenario data for forecast years (2024-2029)
      const scenario: AIScenario = {
        revenue_gr: {
          '2024': 3.0, '2025': 4.2, '2026': 5.5, '2027': 5.8, '2028': 6.0, '2029': 6.1
        },
        earnings_margin: {
          '2024': 30.5, '2025': 30.8, '2026': 31.0, '2027': 31.2, '2028': 31.3, '2029': 31.5
        },
        ic_gr: {
          '2024': 2.5, '2025': 3.8, '2026': 4.2, '2027': 4.5, '2028': 4.8, '2029': 5.0
        }
      };
      setAiScenario(scenario);

      setAiValuation(`## Valuation Analysis for ${params.symbol}

### Key Findings
- Current market price appears to be **overvalued** by 15%
- Fair value estimate: $165.20 per share
- Key growth drivers indicate moderate expansion potential

### Growth Assumptions
- Revenue CAGR: 6.1% (2024-2029)
  • 2024: 3.0% - Post-pandemic normalization
  • 2025-2026: 4.2-5.5% - Market recovery
  • 2027-2029: 5.8-6.1% - Mature growth phase
- Margin improvement: 30.5% to 31.5%
  • Gradual expansion from operational efficiency
  • Cost optimization initiatives
- IC Growth: 2.5% to 5.0%
  • Initial conservative investment
  • Increasing capex with market opportunity

### Risk Factors
- Market saturation in key segments
- Competitive pressure on margins
- Regulatory challenges in key markets

### Recommendation
HOLD with a 12-month price target of $165.20`);
      setLoadingMessage('');
      setIsGenerating(false);
    }, 2000);
  };

  const handleApplyAIScenario = () => {
    if (!aiScenario) return;

    setTableData(prev => {
      const newData = { ...prev };
      
      // Apply AI scenario values for forecast years
      mockData.headers.forEach((year, index) => {
        if (index >= 6) {
          // Update the primary metrics
          newData.revenue_gr[year] = aiScenario.revenue_gr[year];
          newData.earnings_margin[year] = aiScenario.earnings_margin[year];
          newData.ic_gr[year] = aiScenario.ic_gr[year];
          
          // Recalculate dependent values
          const prevYear = mockData.headers[index - 1];
          
          // Calculate Total Revenue
          newData.total_revenue[year] = calculateTotalRevenue(
            newData.total_revenue[prevYear],
            newData.revenue_gr[year]
          );

          // Calculate Economic Earnings
          newData.economic_earnings[year] = calculateEconomicEarnings(
            newData.total_revenue[year],
            newData.earnings_margin[year]
          );

          // Calculate IC
          newData.ic[year] = calculateIC(
            newData.ic[prevYear],
            newData.ic_gr[year]
          );

          // Calculate IC Change
          newData.ic_change[year] = calculateICChange(
            newData.ic[year],
            newData.ic[prevYear]
          );

          // Calculate AROIC
          newData.aroic[year] = calculateAROIC(
            newData.economic_earnings[year],
            newData.ic[year]
          );

          // Calculate FCF
          newData.fcf[year] = calculateFCF(
            newData.economic_earnings[year],
            newData.ic_change[year]
          );
        }
      });

      return newData;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Here you would typically send the data to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsSubmitting(false);
  };

  // Add handler for resetting to default values
  const handleReset = () => {
    setTableData(prev => {
      const newData = { ...prev };
      
      // Reset only the editable forecast values (2024-2029)
      mockData.headers.forEach((year, index) => {
        if (index >= 6) {
          newData.revenue_gr[year] = mockData.data.revenue_gr[year];
          newData.earnings_margin[year] = mockData.data.earnings_margin[year];
          newData.ic_gr[year] = mockData.data.ic_gr[year];
          
          // Recalculate dependent values
          const prevYear = mockData.headers[index - 1];
          
          // Calculate Total Revenue
          newData.total_revenue[year] = calculateTotalRevenue(
            newData.total_revenue[prevYear],
            newData.revenue_gr[year]
          );

          // Calculate Economic Earnings
          newData.economic_earnings[year] = calculateEconomicEarnings(
            newData.total_revenue[year],
            newData.earnings_margin[year]
          );

          // Calculate IC
          newData.ic[year] = calculateIC(
            newData.ic[prevYear],
            newData.ic_gr[year]
          );

          // Calculate IC Change
          newData.ic_change[year] = calculateICChange(
            newData.ic[year],
            newData.ic[prevYear]
          );

          // Calculate AROIC
          newData.aroic[year] = calculateAROIC(
            newData.economic_earnings[year],
            newData.ic[year]
          );

          // Calculate FCF
          newData.fcf[year] = calculateFCF(
            newData.economic_earnings[year],
            newData.ic_change[year]
          );
        }
      });

      return newData;
    });

    // Reset valuation variables
    setValuationVars(mockData.val1_display);
  };

  // Calculate valuation results
  const enterpriseValue = calculateEnterpriseValue(valuationVars, tableData.fcf, mockData.headers);
  const equityValue = calculateEquityValue(enterpriseValue, valuationVars);
  const pricePerShare = calculatePricePerShare(equityValue, valuationVars);
  
  // Calculate upside/downside
  const currentPrice = 185.20; // This should come from your data
  const upside = ((pricePerShare - currentPrice) / currentPrice * 100).toFixed(1);

  // Add sensitivity analysis state
  const [sensitivityData, setSensitivityData] = useState<{
    growth: number[];
    margins: number[];
    matrix: number[][];
    chartData: Array<{ growth: number } & { [key: string]: number }>;
  } | null>(null);

  // Add sensitivity matrix generation function
  const generateSensitivityMatrix = () => {
    // Generate range of growth rates (-2% to +10% in 2% steps)
    const growth = Array.from({ length: 7 }, (_, i) => -2 + (i * 2));
    
    // Generate range of margins (-2% to +2% from current in 1% steps)
    const currentMargin = tableData.earnings_margin['2024'];
    const margins = Array.from({ length: 5 }, (_, i) => currentMargin - 2 + i);
    
    // Generate matrix of upside values
    const matrix = growth.map(g => 
      margins.map(m => {
        // Calculate upside using the same valuation logic
        const revenueMultiple = 5;
        const baseValue = tableData.total_revenue['2024'];
        const growthFactor = 1 + (g / 100);
        const marginFactor = m / 100;
        const projectedValue = baseValue * growthFactor * marginFactor * revenueMultiple;
        const currentValue = baseValue * (currentMargin / 100) * revenueMultiple;
        return ((projectedValue / currentValue) - 1) * 100;
      })
    );

    // Generate chart data
    const chartData = growth.map((g, i) => ({
      growth: g,
      ...Object.fromEntries(margins.map((m, j) => [`margin${j}`, matrix[i][j]]))
    }));

    setSensitivityData({ growth, margins, matrix, chartData });
  };

  return (
    <StockLayout symbol={params.symbol} companyName="Apple Inc.">
      <div className="bg-white min-h-screen">
        <div className="grid grid-cols-12 gap-0">
          {/* Left Column - Assumptions and Variables */}
          <div className="col-span-8 border-r">
            {/* Valuation Assumptions */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium text-gray-900">Valuation Assumptions</h3>
                <div className="flex items-center space-x-2">
                  {aiValuation && (
                    <button
                      onClick={() => setIsAiValuationExpanded(!isAiValuationExpanded)}
                      className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                    >
                      <svg
                        className={`w-5 h-5 transform transition-transform ${isAiValuationExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {isAiValuationExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  )}
                  <div className="flex flex-col items-end relative">
                    {loadingMessage && (
                      <div className="absolute bottom-full mb-2 text-sm text-gray-600 whitespace-nowrap">
                        {loadingMessage}{loadingDots}
                      </div>
                    )}
                    <button
                      onClick={handleGenerateValuation}
                      disabled={isGenerating}
                      className="inline-flex items-center px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <span className="flex items-center space-x-2">
                        <span>Generate AI Valuation</span>
                        {isGenerating && (
                          <svg className="animate-spin h-4 w-4 ml-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {aiValuation && isAiValuationExpanded && (
                <div className="mb-6 prose prose-sm max-w-none">
                  <div className="rounded-lg bg-gray-50 p-4">
                    {/* AI Scenario Data Table */}
                    {aiScenario && (
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold mb-2">AI Scenario Assumptions</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Metric</th>
                                {mockData.headers.slice(6).map(year => (
                                  <th key={year} className="px-2 py-1 text-left text-xs font-medium text-gray-500">{year}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              <tr>
                                <td className="px-2 py-1 text-xs font-medium">Revenue Gr (%)</td>
                                {mockData.headers.slice(6).map(year => (
                                  <td key={year} className="px-2 py-1 text-xs text-blue-600">{aiScenario.revenue_gr[year].toFixed(1)}</td>
                                ))}
                              </tr>
                              <tr>
                                <td className="px-2 py-1 text-xs font-medium">Earnings Margin (%)</td>
                                {mockData.headers.slice(6).map(year => (
                                  <td key={year} className="px-2 py-1 text-xs text-blue-600">{aiScenario.earnings_margin[year].toFixed(1)}</td>
                                ))}
                              </tr>
                              <tr>
                                <td className="px-2 py-1 text-xs font-medium">IC Growth (%)</td>
                                {mockData.headers.slice(6).map(year => (
                                  <td key={year} className="px-2 py-1 text-xs text-blue-600">{aiScenario.ic_gr[year].toFixed(1)}</td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <button
                            onClick={handleReset}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            Reset to Default
                          </button>
                          <button
                            onClick={handleApplyAIScenario}
                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                          >
                            Apply Scenario
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Existing AI Valuation Content */}
                    {aiValuation.split('\n').map((line, index) => (
                      <div key={index} className="markdown-line">
                        {line.startsWith('###') ? (
                          <h3 className="text-sm font-semibold mt-3 mb-2">{line.replace('### ', '')}</h3>
                        ) : line.startsWith('##') ? (
                          <h2 className="text-base font-semibold mb-3">{line.replace('## ', '')}</h2>
                        ) : line.startsWith('-') ? (
                          <p className="text-sm text-gray-600 ml-4 my-1">• {line.replace('- ', '')}</p>
                        ) : line.startsWith('  •') ? (
                          <p className="text-sm text-gray-600 ml-8 my-1">{line}</p>
                        ) : (
                          <p className="text-sm text-gray-600 my-1">{line}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative">
                <div 
                  ref={tableContainerRef}
                  className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  <div className="min-w-max">
                    <table className="w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 sticky left-0 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                            Metric
                          </th>
                          {mockData.headers.map(year => (
                            <th key={year} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                              {year}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { key: 'total_revenue', label: 'Revenue', format: 'number' },
                          { key: 'revenue_gr', label: 'Revenue Gr', format: 'percent', editable: true, italic: true },
                          { key: 'economic_earnings', label: 'Earnings', format: 'number' },
                          { key: 'earnings_margin', label: 'Earnings Margin', format: 'percent', editable: true, italic: true },
                          { key: 'ic', label: 'IC', format: 'number' },
                          { key: 'ic_gr', label: 'IC Growth', format: 'percent', editable: true, italic: true },
                          { key: 'ic_change', label: 'IC Change', format: 'number' },
                          { key: 'aroic', label: 'AROIC', format: 'percent' },
                          { key: 'fcf', label: 'FCF', format: 'number' },
                          { key: 'fcf_gr', label: 'FCF Growth', format: 'percent', italic: true }
                        ].map(({ key, label, format, editable, italic }) => (
                          <tr key={key} className="hover:bg-gray-50">
                            <td className={`px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${italic ? 'italic' : ''}`}>
                              {label}
                            </td>
                            {mockData.headers.map((year, yearIndex) => {
                              const value = tableData[key][year];
                              const isEditable = editable && yearIndex >= 6;
                              const formattedValue = format === 'percent' ? 
                                value.toFixed(1) : 
                                formatLargeNumber(value).formatted;

                              return (
                                <td key={year} className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {isEditable ? (
                                    <input
                                      type="text"
                                      inputMode="decimal"
                                      defaultValue={value.toFixed(1)}
                                      className="w-full px-1 py-0.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-yellow-50"
                                      onChange={(e) => handleInputChange(key, year, e.target.value)}
                                    />
                                  ) : (
                                    <span className={yearIndex >= 6 ? 'text-blue-600' : ''}>
                                      {formattedValue}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Variables Section with Collapse/Expand */}
            <div className="border-b">
              <button
                onClick={() => setIsVariablesExpanded(!isVariablesExpanded)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <h4 className="text-sm font-medium text-gray-900">Variables</h4>
                <svg
                  className={`w-5 h-5 transform transition-transform ${isVariablesExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isVariablesExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(valuationVars).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700">{key}</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          defaultValue={value.toString()}
                          className="mt-1 block w-full border border-gray-300 rounded-sm shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          onChange={(e) => handleValuationVarChange(key as keyof ValuationVariables, e.target.value)}
                          placeholder="Enter value"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="px-6 py-4 border-b flex justify-end space-x-3">
              <button
                onClick={handleReset}
                className="inline-flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {/* Valuation Results */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Valuation Results</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Enterprise Value</span>
                  <span className="text-sm font-medium">{formatLargeNumber(enterpriseValue).formatted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Equity Value</span>
                  <span className="text-sm font-medium">{formatLargeNumber(equityValue).formatted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price per Share</span>
                  <span className="text-sm font-medium">${pricePerShare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Upside/Downside</span>
                  <span className={`text-sm font-medium ${Number(upside) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {upside}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Charts */}
          <div className="col-span-4 p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Key Metrics</h3>
                <CustomLegend />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Revenue Growth (%)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={mockData.headers.map((year, index) => ({
                          year,
                          value: tableData.revenue_gr[year],
                          isForecast: index >= 6
                        }))}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 10 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => value.toFixed(1)}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(229, 231, 235, 0.2)' }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Revenue Growth"
                          radius={[2, 2, 0, 0]}
                        >
                          {mockData.headers.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index >= 6 ? '#93C5FD' : '#0A4174'}
                              className="transition-opacity duration-200 hover:opacity-80"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Earnings Margin (%)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={mockData.headers.map((year, index) => ({
                          year,
                          value: tableData.earnings_margin[year],
                          isForecast: index >= 6
                        }))}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 10 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => value.toFixed(1)}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(229, 231, 235, 0.2)' }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Earnings Margin"
                          radius={[2, 2, 0, 0]}
                        >
                          {mockData.headers.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index >= 6 ? '#93C5FD' : '#0A4174'}
                              className="transition-opacity duration-200 hover:opacity-80"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">IC Growth (%)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={mockData.headers.map((year, index) => ({
                          year,
                          value: tableData.ic_gr[year],
                          isForecast: index >= 6
                        }))}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 10 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => value.toFixed(1)}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(229, 231, 235, 0.2)' }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="IC Growth"
                          radius={[2, 2, 0, 0]}
                        >
                          {mockData.headers.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index >= 6 ? '#93C5FD' : '#0A4174'}
                              className="transition-opacity duration-200 hover:opacity-80"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">AROIC (%)</h4>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={mockData.headers.map((year, index) => ({
                          year,
                          value: tableData.aroic[year],
                          isForecast: index >= 6
                        }))}
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="year" 
                          tick={{ fontSize: 10 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => value.toFixed(1)}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(229, 231, 235, 0.2)' }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="AROIC"
                          radius={[2, 2, 0, 0]}
                        >
                          {mockData.headers.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index >= 6 ? '#93C5FD' : '#0A4174'}
                              className="transition-opacity duration-200 hover:opacity-80"
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Full-width FCF Chart */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Free Cash Flow</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={mockData.headers.map((year, index) => ({
                        year,
                        value: tableData.fcf[year],
                        isForecast: index >= 6
                      }))}
                      margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 10 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => formatLargeNumber(value).formatted}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                      />
                      <Tooltip 
                        content={<CustomTooltip preferredUnit={determineUnit(Object.values(tableData.fcf))} />}
                        cursor={{ fill: 'rgba(229, 231, 235, 0.2)' }}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Free Cash Flow"
                        radius={[2, 2, 0, 0]}
                      >
                        {mockData.headers.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index >= 6 ? '#93C5FD' : '#0A4174'}
                            className="transition-opacity duration-200 hover:opacity-80"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sensitivity Analysis */}
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Sensitivity Analysis</h3>
                  <button
                    onClick={generateSensitivityMatrix}
                    className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    Generate Matrix
                  </button>
                  </div>
                
                {sensitivityData && (
                  <>
                    {/* Sensitivity Matrix */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead>
                          <tr>
                            <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50">Revenue Gr (%)</th>
                            {sensitivityData.margins.map(margin => (
                              <th key={margin} className="px-2 py-2 text-center text-xs font-medium text-gray-500 bg-gray-50">
                                {margin.toFixed(1)}%
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sensitivityData.growth.map((growth, i) => (
                            <tr key={growth}>
                              <td className="px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50">{growth.toFixed(1)}%</td>
                              {sensitivityData.margins.map(margin => {
                                const upside = sensitivityData.matrix[i][sensitivityData.margins.indexOf(margin)];
                                return (
                                  <td 
                                    key={margin}
                                    className={`px-2 py-2 text-xs text-center ${
                                      upside >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}
                                  >
                                    {upside.toFixed(1)}%
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                  </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 