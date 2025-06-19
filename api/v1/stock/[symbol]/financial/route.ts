import { NextRequest, NextResponse } from 'next/server';
import { getFinancialReport } from './service';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol;
  const reportType = request.nextUrl.searchParams.get('report_type') || 'income';
  
  try {
    // Get data from service
    const data = await getFinancialReport(
      symbol, 
      reportType as 'income' | 'balance' | 'cash_flow'
    );
    
    // Return the data
    return NextResponse.json({
      status: 'success',
      ric: symbol,
      data
    });
  } catch (error) {
    console.error(`Error fetching ${reportType} data:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${reportType} data` },
      { status: 500 }
    );
  }
} 