import { NextResponse } from 'next/server';
import { generateMockAIValuation, generateMockAIScenario } from '@/app/stock/[symbol]/modelling/services/mockData';

export async function GET(request: Request) {
  // Get the symbol from the URL query parameters
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  if (!symbol) {
    return NextResponse.json(
      { status: 'error', message: 'Symbol is required' },
      { status: 400 }
    );
  }
  
  try {
    // Generate mock AI valuation text
    const valuation = generateMockAIValuation(symbol);
    
    // Generate mock AI scenario data
    // Create a set of mock headers for the years
    const currentYear = new Date().getFullYear();
    const mockHeaders = [];
    for (let i = 5; i > 0; i--) mockHeaders.push((currentYear - i).toString());
    mockHeaders.push(currentYear.toString());
    for (let i = 1; i <= 5; i++) mockHeaders.push((currentYear + i).toString());
    
    const scenario = generateMockAIScenario(mockHeaders);
    
    // Return the mock data
    return NextResponse.json({
      status: 'success',
      symbol,
      valuation,
      scenario
    });
  } catch (error) {
    console.error('Error generating AI valuation:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to generate AI valuation' },
      { status: 500 }
    );
  }
} 