import { NextRequest, NextResponse } from 'next/server';
import { PortfolioAnalysisService } from '@/mock-data/portfolio-analysis/portfolioAnalysisService';

/**
 * GET /api/v1/portfolio-analysis/watchlists/[id]/attribution
 * 
 * Returns attribution analysis data for a specific watchlist/portfolio
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API route handler for GET /api/v1/portfolio-analysis/watchlists/${id}/attribution called`);
    
    const attributionData = await PortfolioAnalysisService.getAttributionAnalysis(id);
    
    return NextResponse.json({
      success: true,
      data: attributionData
    });
  } catch (error: any) {
    console.error(`Error fetching attribution analysis for watchlist ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attribution analysis' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
} 