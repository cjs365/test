import { NextRequest, NextResponse } from 'next/server';
import { mockArticles } from '@/mock-data/methodology/methodologyData';
import { Article } from '@/mock-data/methodology/methodologyData';

// GET handler for article list (without content)
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const group_name = searchParams.get('group_name');
    const skip = parseInt(searchParams.get('skip') || '0');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Filter articles by group_name if provided
    let filteredArticles = mockArticles;
    if (group_name) {
      filteredArticles = mockArticles.filter((article: Article) => 
        article.group_name?.toLowerCase() === group_name.toLowerCase()
      );
    }
    
    // Apply pagination
    const paginatedArticles = filteredArticles.slice(skip, skip + limit);
    
    // Return only the list data (without content)
    const articlesList = paginatedArticles.map((article: Article) => ({
      id: article.id,
      title: article.title,
      group_name: article.group_name
    }));
    
    return NextResponse.json(articlesList);
  } catch (error) {
    console.error('Error in methodology API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 