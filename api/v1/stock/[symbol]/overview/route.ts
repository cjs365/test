import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;
  
  try {
    // In a production environment, this would call an actual API
    // For now, we'll return a placeholder response
    return NextResponse.json({
      status: 'success',
      ric: symbol,
      data: {
        name: `${symbol} Corporation`,
        description: `This is a placeholder description for ${symbol}.`,
        sector: 'Technology',
        industry: 'Software',
        price: 150.25,
        change: 2.5,
        changePercent: 1.7
      }
    });
  } catch (error) {
    console.error('Error fetching company overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company overview' },
      { status: 500 }
    );
  }
} 