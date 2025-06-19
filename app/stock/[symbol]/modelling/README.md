# Stock Valuation Module

This module provides a comprehensive stock valuation tool that allows users to:
1. View financial data for a specific stock
2. Edit assumptions and forecast data
3. Calculate intrinsic value using DCF (Discounted Cash Flow) methodology
4. Perform sensitivity analysis
5. Generate AI-powered valuation insights

## Directory Structure

```
modelling/
  ├── components/            - UI components for the valuation tool
  │   ├── AIValuation.tsx    - AI-powered valuation insights component
  │   ├── DataTable.tsx      - Editable financial data table
  │   ├── ScenarioManager.tsx - Manager for different valuation scenarios
  │   ├── SensitivityAnalysis.tsx - Sensitivity analysis visualization
  │   ├── ValuationResults.tsx - Results display component
  │   └── charts/            - Chart components for data visualization
  │       ├── FCFChart.tsx   - Free Cash Flow chart
  │       └── MetricsChart.tsx - Financial metrics charts
  ├── hooks/                 - Custom React hooks
  │   ├── useAIValuation.ts  - Hook for AI valuation functionality
  │   ├── useStockValuation.ts - Hook for fetching/processing stock data
  │   └── useValuationCalculator.ts - Hook for valuation calculations
  ├── types.ts               - TypeScript interfaces and types
  └── utils/                 - Utility functions
      ├── calculations.ts    - Financial calculation functions
      └── formatters.ts      - Data formatting utilities
```

## External Dependencies

The module relies on the following centralized services:

```
mock-data/stock/
  ├── stockData.ts           - Mock data generation for stocks
  ├── stockService.ts        - API services for stock data
  └── aiService.ts           - AI valuation services
```

```
api/
  ├── ai-valuation/          - AI valuation API endpoints
  └── v1/
      └── stock-valuation/   - Stock valuation API endpoints
```

## Data Flow

1. The `useStockValuation` hook fetches data from the API or falls back to mock data
2. The `useValuationCalculator` hook processes this data to calculate valuation metrics
3. The `useAIValuation` hook fetches AI-generated insights and scenarios
4. Components render the data and provide user interaction

## API Endpoints

### Stock Valuation API

- `GET /api/v1/stock-valuation/[symbol]` - Get financial data for a stock
- `POST /api/v1/stock-valuation/[symbol]` - Calculate valuation based on provided data
- `POST /api/v1/stock/sensitivity` - Generate sensitivity analysis data

### AI Valuation API

- `GET /api/ai-valuation?symbol=[symbol]` - Generate AI-powered valuation insights

## Key Features

1. **Interactive Data Table**: Users can edit financial data and see real-time updates to valuation
2. **Multiple Valuation Methods**: Supports DCF valuation with configurable parameters
3. **Scenario Management**: Users can create and compare different valuation scenarios
4. **Sensitivity Analysis**: Visualize how changes in key assumptions affect valuation
5. **AI Insights**: Get AI-generated valuation insights and scenario recommendations

## Usage Example

```tsx
import React from 'react';
import { useStockValuation } from './hooks/useStockValuation';
import { useValuationCalculator } from './hooks/useValuationCalculator';
import DataTable from './components/DataTable';
import ValuationResults from './components/ValuationResults';

const StockValuation = ({ symbol }) => {
  const { tableData, headers, valuationVars, isLoading } = useStockValuation(symbol);
  const { 
    enterpriseValue, 
    equityValue, 
    calculationSteps,
    handleDataChange 
  } = useValuationCalculator(tableData, valuationVars, headers);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <DataTable 
        data={tableData} 
        headers={headers} 
        onDataChange={handleDataChange} 
      />
      <ValuationResults 
        enterpriseValue={enterpriseValue}
        equityValue={equityValue}
        calculationSteps={calculationSteps}
      />
    </div>
  );
};

export default StockValuation;
```

## API and Mock Data Structure

The modelling page has been enhanced with a centralized API and mock data structure:

### API Endpoints

API endpoints have been centralized and organized in the following structure:
- `/api/v1/stock/financial` - Financial data API endpoint
- `/api/v1/stock-valuation/[symbol]` - Stock valuation API endpoint
- `/api/v1/stock-valuation/[symbol]/calculate` - Valuation calculation endpoint
- `/api/ai-valuation` - AI-powered valuation analysis endpoint

### Mock Data Organization

Mock data has been organized in the following structure:
- `/mock-data/stock/financialData.ts` - Financial data mock implementation
- `/mock-data/stock/stockData.ts` - Stock data and valuation mock implementation
- `/mock-data/portfolio/portfolioData.ts` - Portfolio data mock implementation
- `/mock-data/portfolio/portfolioService.ts` - Portfolio service mock implementation
- `/mock-data/screener/screenerData.ts` - Screener data mock implementation

### Mock Data Generation

Mock data is generated in the following scenarios:

1. **API Failures**: When API calls fail, the system automatically falls back to mock data
2. **Development/Demo Mode**: For development or demonstration purposes

### Mock Data Services

The mock data implementation is located in `mock-data/stock/stockData.ts` and includes:

- `generateMockData(symbol)`: Creates realistic financial data for a stock
- `generateMockAIValuation(symbol)`: Generates AI analysis text
- `generateMockAIScenario(headers)`: Creates AI-suggested scenario data
- `generateMockSensitivityData()`: Provides sensitivity analysis data
- `generateMockValuationResult()`: Returns mock valuation calculation results

### User Experience Improvements

The UI has been enhanced to provide a better experience when using mock data:

- **Mock Data Indicator**: A blue info message appears at the top of the page when mock data is being used
- **Error Handling**: API error messages are hidden and replaced with informative messages about mock data usage
- **Seamless Fallback**: All features continue to work with mock data, providing a realistic user experience

### Company-Specific Mock Data

The mock data is tailored to specific companies when possible:
- Apple (AAPL)
- Microsoft (MSFT)
- Google (GOOGL)
- Amazon (AMZN)
- Default values for other symbols

## Deployment Instructions

To deploy the frontend for external viewing:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Vercel Deployment**:
   You can also deploy directly to Vercel:
   ```bash
   npx vercel
   ```

## Usage Notes

- No backend configuration is required since the application will use mock data when API calls fail
- The mock data provides a realistic experience of the application's functionality
- All interactive features work as expected with the mock data
- You can access the modelling page at `/stock/{symbol}/modelling` (e.g., `/stock/AAPL/modelling`)

## Features Available with Mock Data

- Financial data table with editable forecast values
- AI valuation generation
- Scenario saving and loading (stored in browser localStorage)
- Sensitivity analysis matrix generation
- Valuation calculations
- Interactive charts

## Development

If you need to modify the mock data behavior:

1. Edit the functions in the appropriate mock data files in `/mock-data/` directory
2. The hooks in `hooks/` directory contain the logic for falling back to mock data when APIs fail 

## Utility Functions

The project includes several utility functions for calculations:

- `calculateFCF()`: Calculates Free Cash Flow (supports both numbers and objects)
- `calculateGrowthRate()`: Calculates growth rates (supports both numbers and objects)
- `calculateEnterpriseValue()`: Calculates Enterprise Value
- `calculateEquityValue()`: Calculates Equity Value
- `calculatePricePerShare()`: Calculates Price per Share 