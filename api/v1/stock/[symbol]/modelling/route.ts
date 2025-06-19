import { NextRequest, NextResponse } from 'next/server';
import { generateMockData, generateMockValuationResult } from '@/mock-data/stock/stockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;
  
  try {
    // Generate mock data for the requested symbol
    const mockData = generateMockData(symbol);
    
    // Return the data in the format expected by the client
    return NextResponse.json({
      status: 'success',
      ric: symbol,
      data: mockData.tableData,
      headers: mockData.headers.map(year => parseInt(year)),
      valuation_parameters: mockData.valuationVars
    });
  } catch (error) {
    console.error('Error fetching stock valuation data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock valuation data' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;
  
  try {
    // Parse the request body
    const body = await request.json();
    
    // In a real implementation, you would process the valuation data here
    // For now, we just return mock results
    const mockResult = generateMockValuationResult();
    
    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('Error calculating stock valuation:', error);
    return NextResponse.json(
      { error: 'Failed to calculate stock valuation' },
      { status: 500 }
    );
  }
} 