import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/mock-data/portfolio/portfolioService';

/**
 * GET /api/v1/portfolios/[ticker]/factors
 * 
 * Returns factor data for a specific portfolio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  try {
    const { ticker } = params;
    console.log(`API route handler for /api/v1/portfolios/${ticker}/factors called`);
    
    const factorData = await PortfolioService.getPortfolioFactors(ticker);
    
    if (!factorData) {
      return NextResponse.json(
        { success: false, error: 'Factor data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: factorData
    });
  } catch (error) {
    console.error(`Error fetching factors for portfolio ${params.ticker}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch factor data' },
      { status: 500 }
    );
  }
} 