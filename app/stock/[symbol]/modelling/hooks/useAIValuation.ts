import { useState } from 'react';
import { AIScenario } from '../types';
import { generateMockAIValuation, generateMockAIScenario } from '@/mock-data/stock/stockData';
import { generateStockAIValuation } from '@/api/v1/stock/service';

interface UseAIValuationResult {
  aiValuation: string | null;
  aiScenario: AIScenario | null;
  isGenerating: boolean;
  loadingMessage: string;
  loadingDots: string;
  generateValuation: () => Promise<void>;
  error: string | null;
}

/**
 * Custom hook for generating AI-powered stock valuations
 */
export function useAIValuation(symbol: string): UseAIValuationResult {
  const [aiValuation, setAIValuation] = useState<string | null>(null);
  const [aiScenario, setAIScenario] = useState<AIScenario | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Generating');
  const [loadingDots, setLoadingDots] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [usedMockData, setUsedMockData] = useState(false);
  
  // Function to simulate loading dots animation
  const updateLoadingDots = () => {
    setLoadingDots(prev => {
      if (prev.length >= 3) return '';
      return prev + '.';
    });
  };
  
  // Function to generate AI valuation
  const generateValuation = async () => {
    setIsGenerating(true);
    setError(null);
    setLoadingMessage('Analyzing company data');
    setLoadingDots('');
    setUsedMockData(false);
    
    // Set up loading animation
    const dotsInterval = setInterval(updateLoadingDots, 500);
    
    try {
      // Simulate API call with a sequence of loading messages
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingMessage('Evaluating industry trends');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingMessage('Projecting future cash flows');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingMessage('Calculating valuation metrics');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoadingMessage('Finalizing analysis');
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // Call the AI valuation service
        const result = await generateStockAIValuation(symbol);
        
        if (result.success && result.data) {
          setAIValuation(result.data.reasoning);
          setAIScenario(result.data.scenario);
        } else {
          throw new Error(result.message || 'Failed to generate AI valuation');
        }
      } catch (apiError: any) {
        console.error('API error, using mock data instead:', apiError);
        
        // Generate mock AI valuation text
        const mockValuation = generateMockAIValuation(symbol);
        setAIValuation(mockValuation);
        
        // Generate mock AI scenario data
        // We need headers to generate the scenario, but we don't have them here
        // We'll create a basic set of headers for the mock scenario
        const currentYear = new Date().getFullYear();
        const mockHeaders = [];
        for (let i = 5; i > 0; i--) mockHeaders.push((currentYear - i).toString());
        mockHeaders.push(currentYear.toString());
        for (let i = 1; i <= 5; i++) mockHeaders.push((currentYear + i).toString());
        
        const mockScenario = generateMockAIScenario(mockHeaders);
        setAIScenario(mockScenario);
        setUsedMockData(true);
        
        // Set a warning but don't show an error since we're providing mock data
        setError(`Using mock data: ${apiError.message || 'API unavailable'}`);
      }
    } catch (err: any) {
      console.error('Error generating AI valuation:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // If we haven't already set mock data, do it now as a fallback
      if (!usedMockData) {
        // Generate mock AI valuation text
        const mockValuation = generateMockAIValuation(symbol);
        setAIValuation(mockValuation);
        
        // Generate mock AI scenario data with basic headers
        const currentYear = new Date().getFullYear();
        const mockHeaders = [];
        for (let i = 5; i > 0; i--) mockHeaders.push((currentYear - i).toString());
        mockHeaders.push(currentYear.toString());
        for (let i = 1; i <= 5; i++) mockHeaders.push((currentYear + i).toString());
        
        const mockScenario = generateMockAIScenario(mockHeaders);
        setAIScenario(mockScenario);
        setUsedMockData(true);
      }
    } finally {
      clearInterval(dotsInterval);
      setIsGenerating(false);
    }
  };
  
  return {
    aiValuation,
    aiScenario,
    isGenerating,
    loadingMessage,
    loadingDots,
    generateValuation,
    error
  };
} 