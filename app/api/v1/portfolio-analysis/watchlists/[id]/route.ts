import { NextRequest, NextResponse } from 'next/server';
import { PortfolioAnalysisService } from '@/mock-data/portfolio-analysis/portfolioAnalysisService';

/**
 * GET /api/v1/portfolio-analysis/watchlists/[id]
 * 
 * Returns a specific watchlist/portfolio by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API route handler for GET /api/v1/portfolio-analysis/watchlists/${id} called`);
    
    const watchlist = await PortfolioAnalysisService.getWatchlistById(id);
    
    return NextResponse.json({
      success: true,
      data: watchlist
    });
  } catch (error: any) {
    console.error(`Error fetching watchlist ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch watchlist' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}

/**
 * PUT /api/v1/portfolio-analysis/watchlists/[id]
 * 
 * Updates a specific watchlist/portfolio
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API route handler for PUT /api/v1/portfolio-analysis/watchlists/${id} called`);
    
    const watchlistData = await request.json();
    if (!watchlistData) {
      return NextResponse.json(
        { success: false, error: 'No watchlist data provided' },
        { status: 400 }
      );
    }
    
    const updatedWatchlist = await PortfolioAnalysisService.updateWatchlist(id, watchlistData);
    
    return NextResponse.json({
      success: true,
      data: updatedWatchlist
    });
  } catch (error: any) {
    console.error(`Error updating watchlist ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update watchlist' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
}

/**
 * DELETE /api/v1/portfolio-analysis/watchlists/[id]
 * 
 * Deletes a specific watchlist/portfolio
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log(`API route handler for DELETE /api/v1/portfolio-analysis/watchlists/${id} called`);
    
    const result = await PortfolioAnalysisService.deleteWatchlist(id);
    
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error(`Error deleting watchlist ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete watchlist' },
      { status: error.message.includes('not found') ? 404 : 500 }
    );
  }
} 