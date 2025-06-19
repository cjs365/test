import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFactorAnalysis } from './useFactorAnalysis';
import { useTheme } from '@/app/context/ThemeProvider';
import { Sparkles } from 'lucide-react';

export default function AIFactorAnalysis() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { factorAnalysis, isLoading, error, loadingMessage, loadingDots, fetchAnalysis } = useFactorAnalysis();
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : ''} mt-6`}>
      <CardHeader className="pb-0 flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <div>
          <CardTitle className="text-lg flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
            AI Market Factor Analysis
          </CardTitle>
          <CardDescription>
            In-depth analysis of current factor performance trends and implications
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {factorAnalysis && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 text-xs"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          )}
          <div className="relative">
            {loadingMessage && (
              <div className="absolute -top-8 right-0 text-xs text-gray-500 whitespace-nowrap">
                {loadingMessage}{loadingDots}
              </div>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={fetchAnalysis}
              disabled={isLoading}
              className="h-8 bg-blue-600 hover:bg-blue-700"
            >
              <span className="flex items-center space-x-2">
                <span>{factorAnalysis ? 'Refresh Analysis' : 'Generate Analysis'}</span>
                {isLoading && (
                  <span className="inline-block animate-spin">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                )}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`${isExpanded ? '' : 'max-h-56 overflow-hidden'} pt-4 transition-all duration-200 relative`}>
        {error && !error.includes('mock data') && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            {error}
          </div>
        )}
        
        {factorAnalysis ? (
          <div className="prose prose-sm max-w-none">
            {factorAnalysis.split('\n').map((line, index) => (
              <div key={index}>
                {line.startsWith('## ') ? (
                  <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : ''}`}>
                    {line.replace('## ', '')}
                  </h2>
                ) : line.startsWith('### ') ? (
                  <h3 className={`text-base font-medium mt-4 mb-2 ${isDark ? 'text-white' : ''}`}>
                    {line.replace('### ', '')}
                  </h3>
                ) : line.startsWith('- **') ? (
                  <div className="flex mb-2">
                    <div className="mr-2">•</div>
                    <div>
                      <span className="font-medium">{line.split('**')[1].replace('*', '')}: </span>
                      <span>{line.split('**')[2].replace('*', '')}</span>
                    </div>
                  </div>
                ) : line.trim() === '' ? (
                  <div className="my-2"></div>
                ) : (
                  <p className={`text-sm my-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{line}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Generate an AI analysis to get insights on current market factor trends</p>
            <p className="text-xs mt-1 opacity-75">Analysis includes market overview, factor insights, and strategic implications</p>
          </div>
        )}
        
        {factorAnalysis && !isExpanded && (
          <div className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${
            isDark ? 'from-gray-800' : 'from-white'
          } to-transparent`}></div>
        )}
      </CardContent>
    </Card>
  );
} 