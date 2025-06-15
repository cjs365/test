import { AIScenario } from '../types';

// AI valuation generation from real API endpoint
export async function generateAIValuation(symbol: string): Promise<{
  success: boolean;
  data: {
    reasoning: string;
    scenario: AIScenario;
  };
  message: string;
}> {
  console.log(`[API] Generating AI valuation for ${symbol}`);
  
  try {
    // Call the real API endpoint
    const response = await fetch(`http://127.0.0.1:8000/api/v1/ai_valuation/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse the response
    const apiResponse = await response.json();
    
    // Convert string values to numbers in the scenario data
    const scenario: AIScenario = {
      revenue_gr: {},
      earnings_margin: {},
      ic_gr: {}
    };
    
    // Process revenue_gr
    Object.entries(apiResponse.data.scenario.revenue_gr).forEach(([year, value]) => {
      scenario.revenue_gr[year] = parseFloat(value as string);
    });
    
    // Process earnings_margin
    Object.entries(apiResponse.data.scenario.earnings_margin).forEach(([year, value]) => {
      scenario.earnings_margin[year] = parseFloat(value as string);
    });
    
    // Process ic_gr
    Object.entries(apiResponse.data.scenario.ic_gr).forEach(([year, value]) => {
      scenario.ic_gr[year] = parseFloat(value as string);
    });
    
    return {
      success: apiResponse.status === 'success',
      data: {
        reasoning: apiResponse.data.reasoning,
        scenario
      },
      message: apiResponse.status === 'success' 
        ? `AI valuation for ${symbol} generated successfully`
        : 'Failed to generate AI valuation'
    };
  } catch (error) {
    console.error('Error calling AI valuation API:', error);
    return {
      success: false,
      data: {
        reasoning: '',
        scenario: {
          revenue_gr: {},
          earnings_margin: {},
          ic_gr: {}
        }
      },
      message: `Failed to generate AI valuation: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
} 