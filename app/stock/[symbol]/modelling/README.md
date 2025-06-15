# Stock Modelling Page

This module provides a comprehensive stock modelling and valuation interface. It allows users to analyze financial data, create valuation scenarios, and perform sensitivity analysis.

## Mock Data Implementation

The modelling page has been enhanced with mock data capabilities to ensure the frontend can be deployed and demonstrated without requiring a working backend API. Here's how it works:

### Mock Data Generation

Mock data is generated in the following scenarios:

1. **API Failures**: When API calls fail, the system automatically falls back to mock data
2. **Development/Demo Mode**: For development or demonstration purposes

### Mock Data Services

The mock data implementation is located in `services/mockData.ts` and includes:

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

1. Edit the functions in `services/mockData.ts`
2. The hooks in `hooks/` directory contain the logic for falling back to mock data when APIs fail 