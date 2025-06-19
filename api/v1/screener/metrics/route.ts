import { NextRequest, NextResponse } from 'next/server';
import { metricsData as metrics, columnCategories } from '@/mock-data/screener/screenerData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const groupByCategory = searchParams.get('groupByCategory') === 'true';
    
    if (groupByCategory) {
      // Group metrics by category
      // Get unique categories from metrics
      const categories = Array.from(new Set(metrics.map(m => m.category)));
      
      const categorizedMetrics = categories.map(cat => {
        return {
          category: cat,
          metrics: metrics.filter(metric => metric.category === cat)
        };
      });
      
      return NextResponse.json({
        status: 'success',
        categories: categorizedMetrics
      });
    }
    
    let filteredMetrics = [...metrics];
    
    // Filter by category if provided
    if (category) {
      filteredMetrics = filteredMetrics.filter(
        metric => metric.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMetrics = filteredMetrics.filter(
        metric => 
          metric.name.toLowerCase().includes(searchLower) || 
          metric.description.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({
      status: 'success',
      metrics: filteredMetrics
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
} 