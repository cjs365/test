'use client';

import { useState, useRef } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import UniverseSelector from '@/app/components/screener/UniverseSelector';
import CriteriaBuilder from '@/app/components/screener/CriteriaBuilder';
import ScreenerResults from '@/app/components/screener/ScreenerResults';
import { Criterion, ScreenerResult, MetricType, ColumnType, Operator } from '@/app/types/screener';
import { Button } from '@/app/components/ui/button';
import { TabsList, TabsTrigger, Tabs, TabsContent } from '@/app/components/ui/tabs';
import { ChevronDown, ChevronUp, Sparkles, ChevronLeft, ChevronRight, Filter, Save } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { useTheme } from '@/app/context/ThemeProvider';

// Mock saved screens
const savedScreens = [
  {
    id: 1,
    name: 'High Dividend Stocks',
    description: 'US stocks with dividend yield > 4% and P/E < 20',
    criteria: [
      { metric: 'Dividend Yield' as MetricType, operator: 'greater_than' as Operator, value1: 4 },
      { metric: 'P/E Ratio' as MetricType, operator: 'less_than' as Operator, value1: 20 },
    ] as Criterion[],
    country: 'US',
    sector: null,
  },
  {
    id: 2,
    name: 'Growth Tech Companies',
    description: 'Technology sector with high revenue growth',
    criteria: [
      { metric: 'Revenue Growth' as MetricType, operator: 'greater_than' as Operator, value1: 20 },
      { metric: 'Market Cap' as MetricType, operator: 'greater_than' as Operator, value1: 1000 },
    ] as Criterion[],
    country: 'US',
    sector: 'technology',
  },
  {
    id: 3,
    name: 'Complex Quality Screen',
    description: 'Multi-factor screen for quality stocks',
    criteria: [
      { metric: 'P/E Ratio' as MetricType, operator: 'less_than' as Operator, value1: 25 },
      { metric: 'Dividend Yield' as MetricType, operator: 'greater_than' as Operator, value1: 2 },
      { metric: 'Revenue Growth' as MetricType, operator: 'greater_than' as Operator, value1: 10 },
      { metric: 'Beta' as MetricType, operator: 'less_than' as Operator, value1: 1.2 },
      { metric: 'Market Cap' as MetricType, operator: 'greater_than' as Operator, value1: 500 },
    ] as Criterion[],
    country: 'US',
    sector: null,
  },
];

// Column configurations
const columnConfigs = [
  {
    id: 1,
    name: 'Default View',
    columns: ['Symbol', 'Name', 'Dividend Yield', 'P/E Ratio', 'Market Cap', 'Beta'] as ColumnType[],
  },
  {
    id: 2,
    name: 'Growth Metrics',
    columns: ['Symbol', 'Name', 'Revenue Growth', 'EPS Growth', 'Price', 'Volume'] as ColumnType[],
  },
  {
    id: 3,
    name: 'Value Metrics',
    columns: ['Symbol', 'Name', 'P/E Ratio', 'Dividend Yield', 'Market Cap', 'Beta'] as ColumnType[],
  },
];

// Mock data for demonstration
const mockResults: ScreenerResult[] = [
  {
    symbol: 'TEN',
    name: 'Tsakos Energy Navigation Ltd.',
    metrics: {
      'Dividend Yield': 10.0,
      'P/E Ratio': 3.7,
      'Market Cap': 543.5,
      'Beta': -0.15,
    },
  },
  {
    symbol: 'KREF',
    name: 'KKR Real Estate Finance Trust Inc.',
    metrics: {
      'Dividend Yield': 9.8,
      'P/E Ratio': 8.2,
      'Market Cap': 789.3,
      'Beta': 0.45,
    },
  },
  {
    symbol: 'NLY',
    name: 'Annaly Capital Management Inc.',
    metrics: {
      'Dividend Yield': 8.9,
      'P/E Ratio': 12.4,
      'Market Cap': 1243.8,
      'Beta': 0.78,
    },
  },
];

// Utility function to format a criterion for display
const formatCriterion = (criterion: Criterion): string => {
  const { metric, operator, value1, value2 } = criterion;
  
  switch (operator) {
    case 'equal':
      return `${metric} = ${value1}`;
    case 'not_equal':
      return `${metric} ≠ ${value1}`;
    case 'greater_than':
      return `${metric} > ${value1}`;
    case 'greater_than_equal':
      return `${metric} ≥ ${value1}`;
    case 'less_than':
      return `${metric} < ${value1}`;
    case 'less_than_equal':
      return `${metric} ≤ ${value1}`;
    case 'between':
      return `${metric} between ${value1} and ${value2}`;
    default:
      return `${metric} ${value1}`;
  }
};

// Utility function to format criteria list with limit
const formatCriteriaList = (criteria: Criterion[], limit: number = 3): string => {
  if (!criteria || criteria.length === 0) return "No criteria";
  
  const formattedCriteria = criteria.slice(0, limit).map(formatCriterion);
  
  if (criteria.length > limit) {
    return formattedCriteria.join(" · ") + " · ...";
  }
  
  return formattedCriteria.join(" · ");
};

export default function ScreenerPage() {
  const [country, setCountry] = useState('US');
  const [sector, setSector] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>([
    {
      metric: 'Dividend Yield',
      operator: 'between',
      value1: 3,
      value2: 10,
    } as Criterion,
    {
      metric: 'P/E Ratio',
      operator: 'greater_than',
      value1: 0,
    } as Criterion,
  ]);
  const [selectedColumnConfig, setSelectedColumnConfig] = useState(columnConfigs[0]);
  const [criteriaExpanded, setCriteriaExpanded] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const viewsScrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const handleLoadScreen = (screen: typeof savedScreens[0]) => {
    setCountry(screen.country);
    setSector(screen.sector);
    setCriteria(screen.criteria);
  };

  // Adapter functions for UniverseSelector
  const handleCountryChange = (countries: string[]) => {
    // Take the first country or default to 'US'
    setCountry(countries[0] || 'US');
  };

  const handleSectorChange = (sectors: string[]) => {
    // If 'all' is selected or no sectors, set to null
    // Otherwise take the first selected sector
    setSector(sectors.includes('all') || sectors.length === 0 ? null : sectors[0]);
  };

  const handleGenerateFromAI = () => {
    // In a real implementation, this would call an API
    // For now, we'll simulate by setting some example criteria
    if (aiPrompt.toLowerCase().includes('dividend')) {
      setCriteria([
        {
          metric: 'Dividend Yield',
          operator: 'greater_than',
          value1: 4,
        } as Criterion,
        {
          metric: 'Market Cap',
          operator: 'greater_than',
          value1: 1000,
        } as Criterion,
      ]);
    } else if (aiPrompt.toLowerCase().includes('growth')) {
      setCriteria([
        {
          metric: 'Revenue Growth',
          operator: 'greater_than',
          value1: 15,
        } as Criterion,
        {
          metric: 'EPS Growth',
          operator: 'greater_than',
          value1: 10,
        } as Criterion,
      ]);
    } else {
      setCriteria([
        {
          metric: 'P/E Ratio',
          operator: 'less_than',
          value1: 20,
        } as Criterion,
        {
          metric: 'Beta',
          operator: 'less_than',
          value1: 1.2,
        } as Criterion,
      ]);
    }
  };

  const scrollViews = (direction: 'left' | 'right') => {
    if (viewsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      viewsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <MainLayout>
      <div className={`py-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className={`mb-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} pb-3 px-2`}>
          <div className="flex justify-between items-center">
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Stock Screener</h1>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className={`${isDark 
                  ? 'bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Screen
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className={`${isDark 
                  ? 'bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Column - Universe and Saved Screens */}
          <div className={`w-[280px] rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className={`w-full grid grid-cols-2 p-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <TabsTrigger 
                  value="filters" 
                  className={`rounded-none border-b-2 ${isDark 
                    ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-blue-500 data-[state=inactive]:border-transparent' 
                    : 'data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-blue-600 data-[state=inactive]:border-transparent'}`}
                >
                  Universe
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className={`rounded-none border-b-2 ${isDark 
                    ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-blue-500 data-[state=inactive]:border-transparent' 
                    : 'data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-blue-600 data-[state=inactive]:border-transparent'}`}
                >
                  Saved
                </TabsTrigger>
              </TabsList>
              <TabsContent value="filters" className="mt-2 p-3">
                <UniverseSelector
                  onCountryChange={handleCountryChange}
                  onSectorChange={handleSectorChange}
                />
              </TabsContent>
              <TabsContent value="saved" className="mt-2 p-3">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {savedScreens.map((screen) => (
                    <div
                      key={screen.id}
                      className={`py-2 cursor-pointer transition-colors ${isDark 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-50'}`}
                      onClick={() => handleLoadScreen(screen)}
                    >
                      <h3 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{screen.name}</h3>
                      <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatCriteriaList(screen.criteria)}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Criteria and Results */}
          <div className="flex-1 space-y-3">
            {/* Combined AI Prompt and Criteria Section */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div 
                className={`flex justify-between items-center p-2 cursor-pointer border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                onClick={() => setCriteriaExpanded(!criteriaExpanded)}
              >
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-900'}`}>Criteria</h2>
                <button className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}>
                  {criteriaExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {criteriaExpanded && (
                <div className="p-3">
                  {/* AI Prompt */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1">
                      <Input
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Describe your investment strategy in plain English..."
                        className={`w-full text-sm ${isDark 
                          ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-600'}`}
                      />
                    </div>
                    <Button 
                      onClick={handleGenerateFromAI} 
                      className={`text-white whitespace-nowrap ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      size="sm"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                  
                  {/* Criteria Builder */}
                  <CriteriaBuilder
                    criteria={criteria}
                    onCriteriaChange={setCriteria}
                  />
                </div>
              )}
            </div>

            {/* Combined Display View and Results */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} flex-1`}>
              {/* View Selection */}
              <div className={`flex items-center p-1 border-b relative ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <button 
                  onClick={() => scrollViews('left')}
                  className={`absolute left-0 z-10 rounded-full p-1 ${isDark 
                    ? 'bg-gray-900 hover:bg-gray-800' 
                    : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <ChevronLeft className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                
                <div 
                  ref={viewsScrollRef} 
                  className="flex gap-1 overflow-x-auto px-6 scrollbar-hide"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {columnConfigs.map((config) => (
                    <button
                      key={config.id}
                      onClick={() => setSelectedColumnConfig(config)}
                      className={`px-3 py-1 whitespace-nowrap text-xs font-medium transition-colors ${
                        selectedColumnConfig.id === config.id 
                          ? isDark ? 'text-blue-400 border-b-2 border-blue-500' : 'text-blue-600 border-b-2 border-blue-600'
                          : isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {config.name}
                    </button>
                  ))}
                  <button className={`px-3 py-1 whitespace-nowrap text-xs font-medium ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}>
                    + New View
                  </button>
                </div>
                
                <button 
                  onClick={() => scrollViews('right')}
                  className={`absolute right-0 z-10 rounded-full p-1 ${isDark 
                    ? 'bg-gray-900 hover:bg-gray-800' 
                    : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  <ChevronRight className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
              </div>

              {/* Results Table */}
              <ScreenerResults 
                results={mockResults}
                columns={selectedColumnConfig.columns}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 