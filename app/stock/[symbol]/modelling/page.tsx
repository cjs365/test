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

// Scenario management interface
interface Scenario {
  name: string;
  description?: string;
  data: TableData;
  valuationVars: ValuationVariables;
  createdAt: string;
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
    // Initialize with mock data and calculate IC change and FCF growth
    const initialData: TableData = {
      total_revenue: { ...mockData.data.total_revenue },
      revenue_gr: { ...mockData.data.revenue_gr },
      economic_earnings: { ...mockData.data.economic_earnings },
      earnings_margin: { ...mockData.data.earnings_margin },
      ic: { ...mockData.data.ic },
      ic_gr: { ...mockData.data.ic_gr },
      aroic: { ...mockData.data.aroic },
      fcf: { ...mockData.data.fcf },
      ic_change: {},  // Will be calculated
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
  const [valuationVars, setValuationVars] = useState<ValuationVariables>({ ...mockData.val1_display });
  const [aiValuation, setAiValuation] = useState<string | null>(null);
  const [isAiValuationExpanded, setIsAiValuationExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingDots, setLoadingDots] = useState('');
  const [aiScenario, setAiScenario] = useState<AIScenario | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sensitivityData, setSensitivityData] = useState<{
    growth: number[];
    margins: number[];
    matrix: number[][];
    chartData: Array<{ growth: number } & { [key: string]: number }>;
  } | null>(null);
  
  // Add enterprise value, equity value, and price per share state variables
  const [enterpriseValue, setEnterpriseValue] = useState<number | null>(null);
  const [equityValue, setEquityValue] = useState<number | null>(null);
  const [pricePerShare, setPricePerShare] = useState<number | null>(null);
  const [upside, setUpside] = useState<string>('0.0');
  
  // Add state for scenario management
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareMessage, setShareMessage] = useState<string>('');

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
    setIsGenerating(true);
    // Here you would typically send the data to your backend
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsGenerating(false);
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
  const calculateValuationResults = () => {
    try {
      // Calculate enterprise value
      const newEnterpriseValue = calculateEnterpriseValue(valuationVars, tableData.fcf, mockData.headers);
      
      // Calculate equity value (only if enterprise value is available)
      const newEquityValue = calculateEquityValue(newEnterpriseValue, valuationVars);
      
      // Calculate price per share (only if equity value is available)
      const newPricePerShare = calculatePricePerShare(newEquityValue, valuationVars);
      
      // Calculate upside/downside
      const currentPrice = 185.20; // This should come from your data
      const newUpside = ((newPricePerShare - currentPrice) / currentPrice * 100).toFixed(1);
      
      // Update state with calculated values
      setEnterpriseValue(newEnterpriseValue);
      setEquityValue(newEquityValue);
      setPricePerShare(newPricePerShare);
      setUpside(newUpside);
    } catch (error) {
      console.error('Error calculating valuation results:', error);
    }
  };

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

  // Function to recalculate all derived values after loading a scenario
  const recalculateValues = () => {
    // Create a copy of the current table data
    const updatedData = { ...tableData };
    
    // Ensure all required properties exist
    if (!updatedData.ic_change) updatedData.ic_change = {};
    if (!updatedData.fcf_gr) updatedData.fcf_gr = {};
    
    // Recalculate all derived values for all years
    mockData.headers.forEach((year, index) => {
      if (index > 0) { // Skip first year as it needs previous year data
        const prevYear = mockData.headers[index - 1];
        
        // Recalculate revenue if it's a forecast year
        if (index > 5) {
          updatedData.total_revenue[year] = calculateTotalRevenue(
            updatedData.total_revenue[prevYear],
            updatedData.revenue_gr[year]
          );
          
          // Recalculate earnings
          updatedData.economic_earnings[year] = calculateEconomicEarnings(
            updatedData.total_revenue[year],
            updatedData.earnings_margin[year]
          );
          
          // Recalculate IC
          updatedData.ic[year] = calculateIC(
            updatedData.ic[prevYear],
            updatedData.ic_gr[year]
          );
        }
        
        // Calculate IC Change (for all years)
        updatedData.ic_change[year] = calculateICChange(
          updatedData.ic[year],
          updatedData.ic[prevYear]
        );
        
        // Calculate AROIC (for all years)
        updatedData.aroic[year] = calculateAROIC(
          updatedData.economic_earnings[year],
          updatedData.ic[year]
        );
        
        // Calculate FCF (for all years)
        updatedData.fcf[year] = calculateFCF(
          updatedData.economic_earnings[year],
          updatedData.ic_change[year]
        );
        
        // Calculate FCF growth rate (for all years)
        updatedData.fcf_gr[year] = calculateGrowthRate(
          updatedData.fcf[year],
          updatedData.fcf[prevYear]
        );
      } else {
        // First year has no change or growth rate
        updatedData.ic_change[year] = 0;
        updatedData.fcf_gr[year] = 0;
      }
    });
    
    // Update the table data state
    setTableData(updatedData);
    
    // Recalculate valuation
    calculateValuationResults();
  };
  
  // Load saved scenarios from localStorage on component mount
  useEffect(() => {
    const savedScenarios = localStorage.getItem(`scenarios_${params.symbol}`);
    if (savedScenarios) {
      setScenarios(JSON.parse(savedScenarios));
    }
  }, [params.symbol]);

  // Save scenario function
  const handleSaveScenario = () => {
    if (!scenarioName.trim()) return;
    
    const newScenario: Scenario = {
      name: scenarioName,
      description: scenarioDescription,
      data: tableData,
      valuationVars: valuationVars,
      createdAt: new Date().toISOString()
    };
    
    const updatedScenarios = [...scenarios, newScenario];
    setScenarios(updatedScenarios);
    localStorage.setItem(`scenarios_${params.symbol}`, JSON.stringify(updatedScenarios));
    
    // Reset and close modal
    setScenarioName('');
    setScenarioDescription('');
    setShowSaveModal(false);
  };

  // Load scenario function
  const handleLoadScenario = (scenario: Scenario) => {
    // Ensure the loaded data has all required properties
    const loadedData = { ...scenario.data };
    
    // Initialize any missing properties
    if (!loadedData.ic_change) loadedData.ic_change = {};
    if (!loadedData.fcf_gr) loadedData.fcf_gr = {};
    
    // Set the data and variables
    setTableData(loadedData);
    setValuationVars(scenario.valuationVars);
    setShowLoadModal(false);
    
    // Recalculate derived values
    recalculateValues();
  };

  // Delete scenario function
  const handleDeleteScenario = (index: number) => {
    const updatedScenarios = [...scenarios];
    updatedScenarios.splice(index, 1);
    setScenarios(updatedScenarios);
    localStorage.setItem(`scenarios_${params.symbol}`, JSON.stringify(updatedScenarios));
  };

  // Share scenario function
  const handleShareScenario = (scenario: Scenario) => {
    // Create a shareable object with scenario data
    const shareableData = {
      symbol: params.symbol,
      scenario: scenario
    };
    
    // Convert to base64 for URL sharing
    const encodedData = btoa(JSON.stringify(shareableData));
    const link = `${window.location.origin}/stock/${params.symbol}/modelling?scenario=${encodedData}`;
    
    setShareLink(link);
    setShareMessage(`Check out my ${params.symbol} valuation scenario!`);
    setShowShareModal(true);
  };

  // Copy share link to clipboard
  const copyToClipboard = () => {
    const textToCopy = `${shareMessage}\n\n${shareLink}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  // Check for shared scenario in URL on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedScenario = urlParams.get('scenario');
      
      if (sharedScenario) {
        try {
          const decodedData = JSON.parse(atob(sharedScenario));
          if (decodedData.symbol === params.symbol && decodedData.scenario) {
            // Ensure the loaded data has all required properties
            const loadedData = { ...decodedData.scenario.data };
            
            // Initialize any missing properties
            if (!loadedData.ic_change) loadedData.ic_change = {};
            if (!loadedData.fcf_gr) loadedData.fcf_gr = {};
            
            // Set the data and variables
            setTableData(loadedData);
            setValuationVars(decodedData.scenario.valuationVars);
            
            // Recalculate derived values
            recalculateValues();
          }
        } catch (error) {
          console.error('Error loading shared scenario:', error);
        }
      }
    }
  }, [params.symbol]);

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
                  {/* Add scenario management buttons */}
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={() => setShowLoadModal(true)}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Load
                  </button>
                  <button
                    onClick={() => {
                      // Create a shareable object with current scenario data
                      const currentScenario: Scenario = {
                        name: "Current Scenario",
                        data: tableData,
                        valuationVars: valuationVars,
                        createdAt: new Date().toISOString()
                      };
                      handleShareScenario(currentScenario);
                    }}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
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
                              // Safely access the value with fallbacks
                              const valueObj = tableData[key] || {};
                              const value = valueObj[year] || 0;
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
                onClick={() => setIsAiValuationExpanded(!isAiValuationExpanded)}
                className="w-full p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <h4 className="text-sm font-medium text-gray-900">Variables</h4>
                <svg
                  className={`w-5 h-5 transform transition-transform ${isAiValuationExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isAiValuationExpanded && (
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
                disabled={isGenerating}
                className="inline-flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isGenerating ? 'Submitting...' : 'Submit'}
              </button>
            </div>

            {/* Valuation Results */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Valuation Results</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Enterprise Value</span>
                  <span className="text-sm font-medium">{enterpriseValue ? formatLargeNumber(enterpriseValue).formatted : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Equity Value</span>
                  <span className="text-sm font-medium">{equityValue ? formatLargeNumber(equityValue).formatted : 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price per Share</span>
                  <span className="text-sm font-medium">{pricePerShare ? `$${pricePerShare.toFixed(2)}` : 'N/A'}</span>
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

      {/* Save Scenario Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Scenario</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="scenarioName" className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name *
                </label>
                <input
                  type="text"
                  id="scenarioName"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter scenario name"
                />
              </div>
              <div>
                <label htmlFor="scenarioDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="scenarioDescription"
                  value={scenarioDescription}
                  onChange={(e) => setScenarioDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter scenario description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveScenario}
                  disabled={!scenarioName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Scenario Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Load Scenario</h3>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {scenarios.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved scenarios found.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scenarios.map((scenario, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{scenario.name}</div>
                            {scenario.description && (
                              <div className="text-xs text-gray-500">{scenario.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(scenario.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleLoadScenario(scenario)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleShareScenario(scenario)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Share
                          </button>
                          <button
                            onClick={() => handleDeleteScenario(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Scenario Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Share Scenario</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Custom Message Input */}
              <div>
                <label htmlFor="shareMessage" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Message
                </label>
                <textarea
                  id="shareMessage"
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a custom message about your scenario"
                  rows={2}
                />
              </div>
              
              <p className="text-sm text-gray-600">
                Share this link with others to let them view your scenario:
              </p>
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  {copySuccess ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              {copySuccess && (
                <p className="text-sm text-green-600">Link copied to clipboard!</p>
              )}
              
              {/* Social Media Sharing Options */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Share directly to:</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareMessage)}`, '_blank')}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`, '_blank')}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0A66C2] text-white hover:bg-opacity-90"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}&quote=${encodeURIComponent(shareMessage)}`, '_blank')}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:bg-opacity-90"
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(`mailto:?subject=${encodeURIComponent(`${params.symbol} Valuation Scenario`)}&body=${encodeURIComponent(`${shareMessage}\n\n${shareLink}`)}`, '_blank')}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500 text-white hover:bg-opacity-90"
                    aria-label="Share via Email"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* QR Code Option */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`;
                    window.open(qrCodeUrl, '_blank');
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 11h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v2h-3v-2zm-5 2h2v2h-2v-2zm2 4h2v2h-2v-2zm2-4h2v4h-2v-4z" />
                  </svg>
                  Generate QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StockLayout>
  );
} 