// Combined client-side API service for methodology articles
import axios from 'axios';
import { methodologyArticles, Article as MockArticle, mockArticles } from '@/mock-data/methodology/methodologyData';
import { AIScenario } from '@/app/stock/[symbol]/modelling/types';

// Define the Article interface to match FastAPI model
export interface Article {
  id: number;
  title: string;
  content: string;
  group_name: string;
}

// Define the ArticleListItem interface for the list API
export interface ArticleListItem {
  id: number;
  title: string;
  group_name: string;
}

// Base API URL - prioritize the external API
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to get flattened mock articles list
const getFlattenedMockArticles = (): MockArticle[] => {
  // First try to use the mock articles array if available
  if (mockArticles && mockArticles.length > 0) {
    return mockArticles;
  }
  
  // Otherwise flatten the methodologyArticles array to get all articles
  return methodologyArticles.reduce((allArticles: MockArticle[], section) => {
    return [
      ...allArticles,
      ...section.articles.map(article => ({
        ...article,
        group_name: section.title
      }))
    ];
  }, []);
};

// Helper function to safely convert ID to number
const safeParseInt = (id: number | string): number | null => {
  if (typeof id === 'number') return id;
  
  const parsed = parseInt(id);
  return isNaN(parsed) ? null : parsed;
};

// Unified methodology API client that prioritizes external API and falls back to mock data
export const methodologyApi = {
  // Get article list (without content) with optional filtering
  getArticlesList: async (group_name?: string, skip: number = 0, limit: number = 100): Promise<ArticleListItem[]> => {
    try {
      // First try the external API - use /v1/articles endpoint
      let url = `${API_BASE_URL}/v1/articles?skip=${skip}&limit=${limit}`;
      if (group_name) {
        url += `&group_name=${encodeURIComponent(group_name)}`;
      }
      
      const response = await axios.get(url, { timeout: 2000 }); // 2 second timeout
      return response.data;
    } catch (externalError) {
      console.log('External API not available, trying internal API...');
      
      try {
        // Then try the internal API
        let url = `/api/v1/methodology?skip=${skip}&limit=${limit}`;
        if (group_name) {
          url += `&group_name=${encodeURIComponent(group_name)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch article list: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (internalError) {
        console.error('All APIs failed, using mock data:', internalError);
        
        // Finally fall back to mock data
        const mockArticlesList = getFlattenedMockArticles();
        
        // Filter by group_name if provided
        let filteredArticles = mockArticlesList;
        if (group_name) {
          filteredArticles = mockArticlesList.filter(article => 
            article.group_name?.toLowerCase() === group_name.toLowerCase()
          );
        }
        
        // Apply pagination
        const paginatedArticles = filteredArticles.slice(skip, skip + limit);
        
        // Return mock data in the correct format
        return paginatedArticles.map(article => ({
          id: typeof article.id === 'string' ? parseInt(article.id) : article.id,
          title: article.title,
          group_name: article.group_name || 'Uncategorized'
        }));
      }
    }
  },

  // Get a specific article by ID
  getArticle: async (id: number | string): Promise<Article> => {
    try {
      // Ensure id is a valid number for the external API
      const numericId = safeParseInt(id);
      
      // If the ID isn't valid, throw an error immediately
      if (numericId === null) {
        throw new Error(`Invalid article ID: ${id}`);
      }
      
      // First try the external API - use /v1/articles endpoint
      const response = await axios.get(`${API_BASE_URL}/v1/articles/${numericId}`, { timeout: 2000 });
      return response.data;
    } catch (externalError) {
      // If it's an invalid ID error we threw ourselves, try to get the first article instead
      if (externalError instanceof Error && externalError.message.includes('Invalid article ID')) {
        console.log('Invalid ID detected, trying to fetch the first available article...');
        try {
          // Get the article list and use the first article's ID
          const articles = await methodologyApi.getArticlesList();
          if (articles && articles.length > 0) {
            return await methodologyApi.getArticle(articles[0].id);
          }
        } catch (listError) {
          console.error('Failed to get article list as fallback:', listError);
        }
      }
      
      console.log('External API not available, trying internal API...');
      
      try {
        // Then try the internal API
        const response = await fetch(`/api/v1/methodology/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (internalError) {
        console.error(`All APIs failed, using mock data for article ${id}:`, internalError);
        
        // Finally fall back to mock data
        const mockArticlesList = getFlattenedMockArticles();
        
        // Find the article in mock data
        const mockArticle = mockArticlesList.find(a => a.id.toString() === id.toString());
        
        // If no article found with the ID, return the first mock article
        if (!mockArticle && mockArticlesList.length > 0) {
          const firstArticle = mockArticlesList[0];
          return {
            id: typeof firstArticle.id === 'string' ? parseInt(firstArticle.id) : firstArticle.id,
            title: firstArticle.title,
            content: firstArticle.content || '',
            group_name: firstArticle.group_name || 'Uncategorized'
          };
        }
        
        if (!mockArticle) {
          throw new Error(`Article with ID ${id} not found in mock data`);
        }
        
        // Return mock data in the correct format
        return {
          id: typeof mockArticle.id === 'string' ? parseInt(mockArticle.id) : mockArticle.id,
          title: mockArticle.title,
          content: mockArticle.content || '',
          group_name: mockArticle.group_name || 'Uncategorized'
        };
      }
    }
  },
  
  // Get all articles
  getAllArticles: async (): Promise<Article[]> => {
    try {
      // First try the external API - use /v1/articles endpoint
      const response = await axios.get(`${API_BASE_URL}/v1/articles`, { timeout: 2000 });
      return response.data;
    } catch (externalError) {
      console.log('External API not available, trying internal API...');
      
      try {
        // Then try the internal API
        const response = await fetch(`/api/v1/methodology`);
        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Get full content for each article
        const articlesWithContent = await Promise.all(
          data.map(async (article: ArticleListItem) => {
            try {
              return await methodologyApi.getArticle(article.id);
            } catch (error) {
              console.error(`Error fetching content for article ${article.id}:`, error);
              return {
                ...article,
                content: ''
              };
            }
          })
        );
        
        return articlesWithContent;
      } catch (internalError) {
        console.error('All APIs failed, using mock data:', internalError);
        
        // Finally fall back to mock data
        const mockArticlesList = getFlattenedMockArticles();
        
        // Return mock data in the correct format
        return mockArticlesList.map(article => ({
          id: typeof article.id === 'string' ? parseInt(article.id) : article.id,
          title: article.title,
          content: article.content || '',
          group_name: article.group_name || 'Uncategorized'
        }));
      }
    }
  },
  
  // Create a new article
  createArticle: async (article: Omit<Article, 'id'>): Promise<Article> => {
    try {
      // Use /v1/articles endpoint
      const response = await axios.post(`${API_BASE_URL}/v1/articles`, article);
      return response.data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Update an existing article
  updateArticle: async (id: number | string, article: Partial<Omit<Article, 'id'>>): Promise<Article> => {
    try {
      // Ensure id is a valid number for the external API
      const numericId = safeParseInt(id);
      
      // If the ID isn't valid, throw an error
      if (numericId === null) {
        throw new Error(`Invalid article ID for update: ${id}`);
      }
      
      // Use /v1/articles endpoint
      const response = await axios.put(`${API_BASE_URL}/v1/articles/${numericId}`, article);
      return response.data;
    } catch (error) {
      console.error(`Error updating article with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete an article
  deleteArticle: async (id: number | string): Promise<void> => {
    try {
      // Ensure id is a valid number for the external API
      const numericId = safeParseInt(id);
      
      // If the ID isn't valid, throw an error
      if (numericId === null) {
        throw new Error(`Invalid article ID for deletion: ${id}`);
      }
      
      // Use /v1/articles endpoint
      await axios.delete(`${API_BASE_URL}/v1/articles/${numericId}`);
    } catch (error) {
      console.error(`Error deleting article with ID ${id}:`, error);
      throw error;
    }
  }
};

// AI Valuation API
export const generateAIValuation = async (symbol: string): Promise<{
  success: boolean;
  data: {
    reasoning: string;
    scenario: AIScenario;
  };
  message: string;
}> => {
  try {
    // First try the external API
    try {
      const response = await axios.get(`${API_BASE_URL}/v1/ai-valuation?symbol=${symbol}`, { timeout: 3000 });
      
      // Convert string values to numbers in the scenario data
      const scenario: AIScenario = {
        revenue_gr: {},
        earnings_margin: {},
        ic_gr: {}
      };
      
      // Process revenue_gr
      Object.entries(response.data.scenario.revenue_gr).forEach(([year, value]) => {
        scenario.revenue_gr[year] = parseFloat(value as string);
      });
      
      // Process earnings_margin
      Object.entries(response.data.scenario.earnings_margin).forEach(([year, value]) => {
        scenario.earnings_margin[year] = parseFloat(value as string);
      });
      
      // Process ic_gr
      Object.entries(response.data.scenario.ic_gr).forEach(([year, value]) => {
        scenario.ic_gr[year] = parseFloat(value as string);
      });
      
      return {
        success: response.data.status === 'success',
        data: {
          reasoning: response.data.valuation,
          scenario
        },
        message: response.data.status === 'success' 
          ? `AI valuation for ${symbol} generated successfully`
          : 'Failed to generate AI valuation'
      };
    } catch (externalError) {
      console.log('External AI valuation API not available, trying internal API...');
      
      // Then try the internal API
      const response = await fetch(`/api/ai-valuation?symbol=${symbol}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Parse the response
      const apiResponse = await response.json();
      
      // Convert string values to numbers in the scenario data
      const scenario: AIScenario = {
        revenue_gr: {},
        earnings_margin: {},
        ic_gr: {}
      };
      
      // Process revenue_gr
      Object.entries(apiResponse.scenario.revenue_gr).forEach(([year, value]) => {
        scenario.revenue_gr[year] = parseFloat(value as string);
      });
      
      // Process earnings_margin
      Object.entries(apiResponse.scenario.earnings_margin).forEach(([year, value]) => {
        scenario.earnings_margin[year] = parseFloat(value as string);
      });
      
      // Process ic_gr
      Object.entries(apiResponse.scenario.ic_gr).forEach(([year, value]) => {
        scenario.ic_gr[year] = parseFloat(value as string);
      });
      
      return {
        success: apiResponse.status === 'success',
        data: {
          reasoning: apiResponse.valuation,
          scenario
        },
        message: apiResponse.status === 'success' 
          ? `AI valuation for ${symbol} generated successfully`
          : 'Failed to generate AI valuation'
      };
    }
  } catch (error) {
    console.error('Error calling AI valuation API:', error);
    return {
      success: false,
      data: {
        reasoning: '',
        scenario: {
          revenue_gr: {},
          earnings_margin: {},
          ic_gr: {}
        }
      },
      message: `Failed to generate AI valuation: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}; 