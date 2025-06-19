import { NextRequest, NextResponse } from 'next/server';
import { columnCategories } from '@/mock-data/screener/screenerData';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const groupByCategory = searchParams.get('groupByCategory') === 'true';
    
    // If grouping by category is requested, return the categorized columns
    if (groupByCategory) {
      return NextResponse.json({
        status: 'success',
        categories: columnCategories
      });
    }
    
    // Flatten all columns from all categories
    const allColumns = columnCategories.flatMap(category => 
      category.columns.map(column => ({
        id: typeof column === 'string' ? column.toLowerCase().replace(/\s+/g, '-') : column,
        name: column,
        category: category.category
      }))
    );
    
    // Filter by search term if provided
    let filteredColumns = allColumns;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredColumns = allColumns.filter(
        column => column.name.toString().toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({
      status: 'success',
      columns: filteredColumns
    });
  } catch (error) {
    console.error('Error fetching columns:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch columns' },
      { status: 500 }
    );
  }
} 