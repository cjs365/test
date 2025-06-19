import { NextRequest, NextResponse } from 'next/server';
import { PortfolioAnalysisService } from '@/mock-data/portfolio-analysis/portfolioAnalysisService';

/**
 * GET /api/v1/portfolio-analysis/market-factors
 * 
 * Returns market-wide factor performance data
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API route handler for /api/v1/portfolio-analysis/market-factors called');
    const factorData = await PortfolioAnalysisService.getMarketFactorPerformance();
    
    return NextResponse.json({
      success: true,
      data: factorData
    });
  } catch (error: any) {
    console.error('Error fetching market factor data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market factor data' },
      { status: 500 }
    );
  }
} 