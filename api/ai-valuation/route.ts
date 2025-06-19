import { NextRequest, NextResponse } from 'next/server';
import { generateMockAIValuation, generateMockAIScenario, generateFactorAnalysis } from '@/mock-data/stock/stockData';

export async function GET(request: NextRequest) {
  try {
    // Check if this is a factor analysis request
    const isFactorAnalysis = request.nextUrl.searchParams.get('type') === 'factor-analysis';
    
    if (isFactorAnalysis) {
      // Generate mock factor analysis
      const analysis = generateFactorAnalysis();
      
      return NextResponse.json({
        status: 'success',
        analysis
      });
    }
    
    // Regular stock valuation flow
    const symbol = request.nextUrl.searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json(
        { status: 'error', message: 'Symbol is required' },
        { status: 400 }
      );
    }
    
    // Generate mock AI valuation text
    const valuation = generateMockAIValuation(symbol);
    
    // Generate mock scenario data for forecast years
    const currentYear = new Date().getFullYear();
    const headers = [];
    for (let i = 0; i < 5; i++) {
      headers.push((currentYear + i).toString());
    }
    const scenario = generateMockAIScenario(headers);
    
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