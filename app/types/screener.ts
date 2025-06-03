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
  | 'Revenue Growth';

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