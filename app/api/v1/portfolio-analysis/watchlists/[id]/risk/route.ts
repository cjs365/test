import { NextRequest, NextResponse } from 'next/server';
import { PortfolioAnalysisService } from '@/mock-data/portfolio-analysis/portfolioAnalysisService';

/**
 * GET /api/v1/portfolio-analysis/watchlists/[id]/risk
 * 
 * Returns risk analytics data for a specific watchlist/portfolio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API route handler for GET /api/v1/portfolio-analysis/watchlists/${id}/risk called`);
    
    const riskData = await PortfolioAnalysisService.getPortfolioRiskAnalytics(id);
    
    return NextResponse.json({
      success: true,
      data: riskData
    });
  } catch (error: any) {
    console.error(`Error fetching risk analytics for watchlist ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch risk analytics' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
} 