export type Year = string;

export interface TableData {
  [key: string]: {
    [year: string]: number;
  };
}

export interface MetricConfig {
  key: string;
  label: string;
  format: 'number' | 'percent';
  editable?: boolean;
  italic?: boolean;
}

export interface ValuationVariables {
  'Shareholder ratio': number;
  'Discount rate': number;
  'Total debt': number;
  'Market investment': number;
  'Current market cap (mn)': number;
  'Interim conversion': number;
}

export interface AIScenario {
  revenue_gr: { [year: string]: number };
  earnings_margin: { [year: string]: number };
  ic_gr: { [year: string]: number };
}

export interface MockData {
  headers: Year[];
  data: TableData;
  val1_display: ValuationVariables;
}

// Scenario management interface
export interface Scenario {
  name: string;
  description?: string;
  data: TableData;
  valuationVars: ValuationVariables;
  createdAt: string;
}

export interface CalculationStep {
  label: string;
  value: string;
  calculation: string;
}

export interface SensitivityData {
  growth: number[];
  margins: number[];
  matrix: number[][];
  chartData: Array<{ growth: number } & { [key: string]: number }>;
}

export interface SensitivityPoint {
  revenue_gr: number;
  ic_gr: number;
  potential_upside: number;
}