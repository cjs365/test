import { NextRequest, NextResponse } from 'next/server';
import { mockArticles } from '@/mock-data/methodology/methodologyData';
import { Article } from '@/mock-data/methodology/methodologyData';

// GET handler for a specific article
export async function GET(
  request: NextRequest,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = params.articleId;
    
    // Try to find the article by ID
    const article = mockArticles.find((article: Article) => article.id.toString() === articleId);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(article);
  } catch (error) {
    console.error(`Error fetching article ${params.articleId}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 