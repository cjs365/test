export type Operator = 
  | 'equal'
  | 'not_equal'
  | 'greater_than'
  | 'greater_than_equal'
  | 'less_than'
  | 'less_than_equal'
  | 'between';

export type MetricType = 
  | 'Dividend Yield'
  | 'P/E Ratio'
  | 'Market Cap'
  | 'Beta'
  | 'Price'
  | 'Volume'
  | 'EPS Growth'
  | 'Revenue Growth'
  | 'Dividend CAGR (5y)'
  | 'Altman Z-Score'
  | 'Asset Efficiency'
  | 'Trading Price Standard Deviation'
  | 'Beneish M-Score'
  | 'Beta (5 Year)';

export type ColumnType = MetricType | 'Symbol' | 'Name';

export type Criterion = {
  metric: MetricType;
  operator: Operator;
  value1: number;
  value2?: number; // For 'between' operator
};

export type ScreenerFilters = {
  country: string;
  sector?: string;
  criteria: Criterion[];
};

export type ScreenerResult = {
  symbol: string;
  name: string;
  metrics: {
    [key in MetricType]?: number;
  };
};

// New types for the metrics API
export type MetricCategory = 
  | 'Valuation'
  | 'Growth'
  | 'Dividends'
  | 'Risk'
  | 'Profitability'
  | 'Momentum'
  | 'Financial Health';

export interface MetricDefinition {
  id: string;
  name: MetricType;
  category: MetricCategory;
  description: string;
  unit?: string;
  formula?: string;
  isHigherBetter?: boolean;
}

export interface MetricCategoryGroup {
  category: MetricCategory;
  metrics: MetricDefinition[];
} 