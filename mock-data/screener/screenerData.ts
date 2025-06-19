import { 
  MetricDefinition, 
  MetricCategory, 
  ColumnType, 
  Criterion, 
  Operator, 
  MetricType,
  ScreenerResult
} from '@/app/types/screener';

// Mock metrics data
export const metricsData: MetricDefinition[] = [
  {
    id: 'dividend-yield',
    name: 'Dividend Yield',
    category: 'Dividends',
    description: 'Annual dividends per share divided by price per share',
    unit: '%',
    formula: 'Annual Dividend / Share Price',
    isHigherBetter: true
  },
  {
    id: 'pe-ratio',
    name: 'P/E Ratio',
    category: 'Valuation',
    description: 'Price per share divided by earnings per share',
    formula: 'Share Price / EPS',
    isHigherBetter: false
  },
  {
    id: 'market-cap',
    name: 'Market Cap',
    category: 'Valuation',
    description: 'Total market value of a company\'s outstanding shares',
    unit: '$',
    formula: 'Share Price × Outstanding Shares',
    isHigherBetter: undefined
  },
  {
    id: 'beta',
    name: 'Beta',
    category: 'Risk',
    description: 'Measure of a stock\'s volatility in relation to the market',
    formula: 'Covariance(Stock, Market) / Variance(Market)',
    isHigherBetter: undefined
  },
  {
    id: 'price',
    name: 'Price',
    category: 'Valuation',
    description: 'Current trading price of the stock',
    unit: '$',
    isHigherBetter: undefined
  },
  {
    id: 'volume',
    name: 'Volume',
    category: 'Momentum',
    description: 'Number of shares traded in a specific period',
    isHigherBetter: undefined
  },
  {
    id: 'eps-growth',
    name: 'EPS Growth',
    category: 'Growth',
    description: 'Year-over-year growth in earnings per share',
    unit: '%',
    formula: '(Current EPS - Previous EPS) / Previous EPS',
    isHigherBetter: true
  },
  {
    id: 'revenue-growth',
    name: 'Revenue Growth',
    category: 'Growth',
    description: 'Year-over-year growth in revenue',
    unit: '%',
    formula: '(Current Revenue - Previous Revenue) / Previous Revenue',
    isHigherBetter: true
  },
  {
    id: 'dividend-cagr-5y',
    name: 'Dividend CAGR (5y)',
    category: 'Dividends',
    description: 'Compound annual growth rate of dividends over 5 years',
    unit: '%',
    formula: '(Ending Value / Beginning Value)^(1/5) - 1',
    isHigherBetter: true
  },
  {
    id: 'altman-z-score',
    name: 'Altman Z-Score',
    category: 'Financial Health',
    description: 'Predicts the probability of a company going bankrupt',
    formula: '1.2(WC/TA) + 1.4(RE/TA) + 3.3(EBIT/TA) + 0.6(MVE/TL) + 0.999(S/TA)',
    isHigherBetter: true
  },
  {
    id: 'asset-efficiency',
    name: 'Asset Efficiency',
    category: 'Profitability',
    description: 'Measures how efficiently a company uses its assets to generate revenue',
    formula: 'Revenue / Total Assets',
    isHigherBetter: true
  },
  {
    id: 'trading-price-std-dev',
    name: 'Trading Price Standard Deviation',
    category: 'Risk',
    description: 'Standard deviation of trading prices over a period',
    isHigherBetter: false
  },
  {
    id: 'beneish-m-score',
    name: 'Beneish M-Score',
    category: 'Financial Health',
    description: 'Model to detect earnings manipulation',
    formula: 'Complex formula using 8 financial ratios',
    isHigherBetter: false
  },
  {
    id: 'beta-5y',
    name: 'Beta (5 Year)',
    category: 'Risk',
    description: 'Beta calculated over a 5-year period',
    formula: 'Covariance(Stock, Market) / Variance(Market) over 5 years',
    isHigherBetter: undefined
  }
];

// Column categories for organization
export const columnCategories = [
  {
    category: 'Basic Info',
    columns: ['Symbol', 'Name'] as ColumnType[]
  },
  {
    category: 'Valuation',
    columns: ['P/E Ratio', 'Dividend Yield', 'Market Cap', 'Price'] as ColumnType[]
  },
  {
    category: 'Performance',
    columns: ['Beta', 'Volume'] as ColumnType[]
  },
  {
    category: 'Growth',
    columns: ['EPS Growth', 'Revenue Growth'] as ColumnType[]
  },
  {
    category: 'Risk',
    columns: ['Beta', 'Beta (5 Year)', 'Trading Price Standard Deviation'] as ColumnType[]
  },
  {
    category: 'Financial Health',
    columns: ['Altman Z-Score', 'Beneish M-Score'] as ColumnType[]
  }
];

// Mock saved screens
export const savedScreens = [
  {
    id: 1,
    name: 'High Dividend Stocks',
    description: 'US stocks with dividend yield > 4% and P/E < 20',
    criteria: [
      { metric: 'Dividend Yield' as MetricType, operator: 'greater_than' as Operator, value1: 4 },
      { metric: 'P/E Ratio' as MetricType, operator: 'less_than' as Operator, value1: 20 },
    ] as Criterion[],
    country: 'US',
    sector: null,
  },
  {
    id: 2,
    name: 'Growth Tech Companies',
    description: 'Technology sector with high revenue growth',
    criteria: [
      { metric: 'Revenue Growth' as MetricType, operator: 'greater_than' as Operator, value1: 20 },
      { metric: 'Market Cap' as MetricType, operator: 'greater_than' as Operator, value1: 1000 },
    ] as Criterion[],
    country: 'US',
    sector: 'technology',
  },
  {
    id: 3,
    name: 'Complex Quality Screen',
    description: 'Multi-factor screen for quality stocks',
    criteria: [
      { metric: 'P/E Ratio' as MetricType, operator: 'less_than' as Operator, value1: 25 },
      { metric: 'Dividend Yield' as MetricType, operator: 'greater_than' as Operator, value1: 2 },
      { metric: 'Revenue Growth' as MetricType, operator: 'greater_than' as Operator, value1: 10 },
      { metric: 'Beta' as MetricType, operator: 'less_than' as Operator, value1: 1.2 },
      { metric: 'Market Cap' as MetricType, operator: 'greater_than' as Operator, value1: 500 },
    ] as Criterion[],
    country: 'US',
    sector: null,
  },
];

// Initial column configurations
export const initialColumnConfigs = [
  {
    id: 1,
    name: 'Default View',
    columns: ['Symbol', 'Name', 'Dividend Yield', 'P/E Ratio', 'Market Cap', 'Beta'] as ColumnType[],
  },
  {
    id: 2,
    name: 'Growth Metrics',
    columns: ['Symbol', 'Name', 'Revenue Growth', 'EPS Growth', 'Price', 'Volume'] as ColumnType[],
  },
  {
    id: 3,
    name: 'Value Metrics',
    columns: ['Symbol', 'Name', 'P/E Ratio', 'Dividend Yield', 'Market Cap', 'Beta'] as ColumnType[],
  },
];

// Mock stock results
export const mockResults: ScreenerResult[] = [
  {
    symbol: 'TEN',
    name: 'Tsakos Energy Navigation Ltd.',
    metrics: {
      'Dividend Yield': 10.0,
      'P/E Ratio': 3.7,
      'Market Cap': 543.5,
      'Beta': -0.15,
    },
  },
  {
    symbol: 'KREF',
    name: 'KKR Real Estate Finance Trust Inc.',
    metrics: {
      'Dividend Yield': 9.8,
      'P/E Ratio': 8.2,
      'Market Cap': 789.3,
      'Beta': 0.45,
    },
  },
  {
    symbol: 'NLY',
    name: 'Annaly Capital Management Inc.',
    metrics: {
      'Dividend Yield': 8.9,
      'P/E Ratio': 12.4,
      'Market Cap': 1243.8,
      'Beta': 0.78,
    },
  },
];

// Helper functions for the screener service
export const getMetricsCategorized = async () => {
  // Group metrics by category
  const categoriesMap = new Map<MetricCategory, MetricDefinition[]>();
  
  metricsData.forEach(metric => {
    if (!categoriesMap.has(metric.category)) {
      categoriesMap.set(metric.category, []);
    }
    categoriesMap.get(metric.category)?.push(metric);
  });
  
  // Convert map to array of category groups
  const categorized = Array.from(categoriesMap.entries()).map(([category, metrics]) => ({
    category,
    metrics
  }));
  
  return categorized;
};

export const searchMetrics = async (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  
  return metricsData.filter(metric => 
    metric.name.toLowerCase().includes(term) || 
    metric.description?.toLowerCase().includes(term) ||
    metric.category.toLowerCase().includes(term)
  );
};

export const getAllMetrics = async () => {
  return metricsData;
};

export const getColumnCategories = async () => {
  return columnCategories;
};

export const searchColumns = async (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  const allColumns = columnCategories.flatMap(category => 
    category.columns.map(column => ({
      column,
      category: category.category
    }))
  );
  
  const filteredColumns = allColumns.filter(item => 
    item.column.toLowerCase().includes(term) || 
    item.category.toLowerCase().includes(term)
  );
  
  // Return just the column names to match the expected type
  return filteredColumns.map(item => item.column);
}; 