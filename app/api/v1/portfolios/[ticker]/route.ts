import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/mock-data/portfolio/portfolioService';

/**
 * GET /api/v1/portfolios/[ticker]
 * 
 * Returns details for a specific portfolio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  try {
    const { ticker } = params;
    console.log(`API route handler for /api/v1/portfolios/${ticker} called`);
    
    const portfolio = await PortfolioService.getPortfolioByTicker(ticker);
    
    if (!portfolio) {
      return NextResponse.json(
        { success: false, error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error(`Error fetching portfolio ${params.ticker}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
} 