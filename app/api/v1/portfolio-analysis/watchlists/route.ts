import { NextRequest, NextResponse } from 'next/server';
import { PortfolioAnalysisService } from '@/mock-data/portfolio-analysis/portfolioAnalysisService';

/**
 * GET /api/v1/portfolio-analysis/watchlists
 * 
 * Returns all user watchlists/portfolios
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API route handler for GET /api/v1/portfolio-analysis/watchlists called');
    const watchlists = await PortfolioAnalysisService.getUserWatchlists();
    
    return NextResponse.json({
      success: true,
      data: watchlists
    });
  } catch (error: any) {
    console.error('Error fetching user watchlists:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user watchlists' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/portfolio-analysis/watchlists
 * 
 * Creates a new watchlist/portfolio
 */
export async function POST(request: NextRequest) {
  try {
    console.log('API route handler for POST /api/v1/portfolio-analysis/watchlists called');
    
    const watchlistData = await request.json();
    if (!watchlistData) {
      return NextResponse.json(
        { success: false, error: 'No watchlist data provided' },
        { status: 400 }
      );
    }
    
    const newWatchlist = await PortfolioAnalysisService.createWatchlist(watchlistData);
    
    return NextResponse.json({
      success: true,
      data: newWatchlist
    });
  } catch (error: any) {
    console.error('Error creating watchlist:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create watchlist' },
      { status: 500 }
    );
  }
} 