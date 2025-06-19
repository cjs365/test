import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/mock-data/portfolio/portfolioService';

/**
 * GET /api/v1/portfolios
 * 
 * Returns a list of all available portfolios
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API route handler for /api/v1/portfolios called');
    const portfolios = await PortfolioService.getAllPortfolios();
    
    // Get categories and risk levels for filtering
    const categories = await PortfolioService.getPortfolioCategories();
    const riskLevels = await PortfolioService.getPortfolioRiskLevels();
    
    return NextResponse.json({
      success: true,
      data: {
        portfolios,
        categories,
        riskLevels
      }
    });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
} 