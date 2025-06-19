import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/mock-data/portfolio/portfolioService';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  try {
    const { ticker } = params;
    
    const holdingsData = await PortfolioService.getPortfolioHoldings(ticker);
    
    if (!holdingsData) {
      return NextResponse.json(
        { success: false, error: 'Holdings data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: holdingsData
    });
  } catch (error) {
    console.error(`Error fetching holdings for portfolio ${params.ticker}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch holdings data' },
      { status: 500 }
    );
  }
} 