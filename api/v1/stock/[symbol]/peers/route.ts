import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;
  
  try {
    // In a production environment, this would call an actual API
    // For now, we'll return placeholder data
    return NextResponse.json({
      status: 'success',
      ric: symbol,
      data: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 170.25, change: 1.2, marketCap: 2800 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', price: 330.50, change: 0.8, marketCap: 2500 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 125.30, change: -0.5, marketCap: 1600 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 135.80, change: 1.5, marketCap: 1400 },
        { symbol: 'META', name: 'Meta Platforms Inc.', price: 320.15, change: 2.1, marketCap: 830 }
      ]
    });
  } catch (error) {
    console.error('Error fetching peers data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch peers data' },
      { status: 500 }
    );
  }
} 