import { NextRequest, NextResponse } from 'next/server';
import { mockResults } from '@/mock-data/screener/screenerData';
import { Criterion, Operator } from '@/app/types/screener';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.criteria || !Array.isArray(body.criteria)) {
      return NextResponse.json(
        { status: 'error', message: 'Missing criteria' },
        { status: 400 }
      );
    }
    
    const { criteria, country, sector } = body;
    
    // In a real implementation, this would query a database with the criteria
    // For now, we'll just return the mock results
    
    // Filter results based on criteria
    let filteredResults = [...mockResults];
    
    // Apply each criterion
    criteria.forEach((criterion: Criterion) => {
      filteredResults = filteredResults.filter(result => {
        const metricValue = result.metrics[criterion.metric];
        
        // Skip if metric doesn't exist for this stock
        if (metricValue === undefined) return true;
        
        switch (criterion.operator) {
          case 'greater_than':
            return metricValue > criterion.value1;
          case 'less_than':
            return metricValue < criterion.value1;
          case 'between':
            return criterion.value2 !== undefined && 
              metricValue >= criterion.value1 && 
              metricValue <= criterion.value2;
          case 'equals' as Operator:
            return metricValue === criterion.value1;
          default:
            return true;
        }
      });
    });
    
    return NextResponse.json({
      status: 'success',
      results: filteredResults
    });
  } catch (error) {
    console.error('Error fetching screener results:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch screener results' },
      { status: 500 }
    );
  }
} 