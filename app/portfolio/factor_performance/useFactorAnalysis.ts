import { useState } from 'react';
import { PortfolioAnalysisService } from '@/mock-data/portfolio-analysis/portfolioAnalysisService';

export function useFactorAnalysis() {
  const [factorAnalysis, setFactorAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [loadingDots, setLoadingDots] = useState<string>('');

  const fetchAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Analyzing market factors');
    
    // Animate loading dots
    let dots = '';
    const dotsInterval = setInterval(() => {
      dots = dots.length >= 3 ? '' : dots + '.';
      setLoadingDots(dots);
    }, 500);
    
    try {
      const result = await PortfolioAnalysisService.fetchFactorAnalysis();
      
      if (result.success && result.analysis) {
        setFactorAnalysis(result.analysis);
      } else {
        throw new Error(result.error || 'Failed to generate factor analysis');
      }
    } catch (err) {
      console.error('Error fetching factor analysis:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      clearInterval(dotsInterval);
      setIsLoading(false);
      setLoadingMessage('');
      setLoadingDots('');
    }
  };
  
  return {
    factorAnalysis,
    isLoading,
    error,
    loadingMessage,
    loadingDots,
    fetchAnalysis
  };
} 