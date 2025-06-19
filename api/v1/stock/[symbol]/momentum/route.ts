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
      data: {
        momentum_score: 75,
        strength_indicators: [
          { name: 'Price vs 50-day MA', value: 15.2, score: 85 },
          { name: 'Price vs 200-day MA', value: 23.5, score: 90 },
          { name: 'RSI (14-day)', value: 65.3, score: 70 },
          { name: 'MACD', value: 2.8, score: 65 },
          { name: 'Volume Trend', value: 1.3, score: 60 }
        ],
        historical_momentum: [
          { date: '2023-01-01', value: 65 },
          { date: '2023-02-01', value: 68 },
          { date: '2023-03-01', value: 72 },
          { date: '2023-04-01', value: 70 },
          { date: '2023-05-01', value: 73 },
          { date: '2023-06-01', value: 75 }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching momentum data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch momentum data' },
      { status: 500 }
    );
  }
} 