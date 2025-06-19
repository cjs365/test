import { NextRequest, NextResponse } from 'next/server';
import { modelPortfolios } from '@/mock-data/portfolio/portfolioData';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  try {
    const ticker = params.ticker;
    const portfolio = modelPortfolios.find(p => p.ticker === ticker);
    
    if (!portfolio) {
      return NextResponse.json(
        { status: 'error', message: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    // Extract performance data from the portfolio
    const performanceData = {
      performance: portfolio.performance
    };
    
    return NextResponse.json({
      status: 'success',
      data: performanceData
    });
  } catch (error) {
    console.error(`Error fetching performance data for portfolio ${params.ticker}:`, error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch portfolio performance' },
      { status: 500 }
    );
  }
} 