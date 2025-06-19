import { NextRequest, NextResponse } from 'next/server';
import { savedScreens } from '@/mock-data/screener/screenerData';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'success',
      screens: savedScreens
    });
  } catch (error) {
    console.error('Error fetching saved screens:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch saved screens' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.criteria || !Array.isArray(body.criteria)) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would save to a database
    // For now, we'll just return a mock response with a generated ID
    const newScreen = {
      id: savedScreens.length + 1,
      name: body.name,
      description: body.description || '',
      criteria: body.criteria,
      country: body.country || 'US',
      sector: body.sector || null
    };
    
    return NextResponse.json({
      status: 'success',
      screen: newScreen
    });
  } catch (error) {
    console.error('Error saving screen:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to save screen' },
      { status: 500 }
    );
  }
} 