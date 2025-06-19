'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { MetricDefinition, MetricCategoryGroup, MetricCategory } from '@/app/types/screener';
import { getMetricsCategorized, searchMetrics } from '@/mock-data/screener/screenerData';
import { useTheme } from '@/app/context/ThemeProvider';
import { X, ChevronUp, ChevronDown, Trash2, GripVertical, Search } from 'lucide-react';

type MetricsSelectorProps = {
  onSelect: (metric: MetricDefinition) => void;
  onClose: () => void;
  selectedMetrics?: MetricDefinition[];
  onRemoveMetric?: (metricId: string) => void;
  onReorderMetrics?: (metrics: MetricDefinition[]) => void;
};

export default function MetricsSelector({
  onSelect,
  onClose,
  selectedMetrics = [],
  onRemoveMetric,
  onReorderMetrics,
}: MetricsSelectorProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [categories, setCategories] = useState<MetricCategoryGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MetricDefinition[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<MetricDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localSelectedMetrics, setLocalSelectedMetrics] = useState<MetricDefinition[]>(selectedMetrics);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Update local selected metrics when prop changes
  useEffect(() => {
    setLocalSelectedMetrics(selectedMetrics);
  }, [selectedMetrics]);

  // Fetch categories and metrics on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categorizedMetrics = await getMetricsCategorized();
        setCategories(categorizedMetrics);
        
        if (categorizedMetrics.length > 0) {
          setSelectedCategory(categorizedMetrics[0].category);
        }
      } catch (error) {
        console.error('Error fetching metrics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim().length === 0) {
        setSearchResults([]);
        return;
      }
      
      const results = await searchMetrics(searchTerm);
      setSearchResults(results);
    };
    
    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleCategoryClick = (category: MetricCategory | 'search-results') => {
    if (category === 'search-results') {
      // Keep the selected category as is, just show search results
    } else {
      setSelectedCategory(category);
    }
    setSelectedMetric(null);
  };

  const handleMetricClick = (metric: MetricDefinition) => {
    setSelectedMetric(metric);
  };

  const handleSelectMetric = () => {
    if (selectedMetric) {
      onSelect(selectedMetric);
      
      // Add to local selected metrics if not already there
      if (!localSelectedMetrics.some(m => m.id === selectedMetric.id)) {
        setLocalSelectedMetrics([...localSelectedMetrics, selectedMetric]);
      }
      
      setSelectedMetric(null);
    }
  };

  const isMetricSelected = (metric: MetricDefinition) => {
    return localSelectedMetrics.some(m => m.id === metric.id);
  };

  const handleRemoveMetric = (metricId: string) => {
    const updatedMetrics = localSelectedMetrics.filter(m => m.id !== metricId);
    setLocalSelectedMetrics(updatedMetrics);
    
    if (onRemoveMetric) {
      onRemoveMetric(metricId);
    }
  };

  const handleMoveMetric = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === localSelectedMetrics.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedMetrics = [...localSelectedMetrics];
    const temp = updatedMetrics[index];
    updatedMetrics[index] = updatedMetrics[newIndex];
    updatedMetrics[newIndex] = temp;
    
    setLocalSelectedMetrics(updatedMetrics);
    
    if (onReorderMetrics) {
      onReorderMetrics(updatedMetrics);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    
    const updatedMetrics = [...localSelectedMetrics];
    const draggedMetric = updatedMetrics[draggingIndex];
    
    // Remove the dragged item
    updatedMetrics.splice(draggingIndex, 1);
    // Insert it at the new position
    updatedMetrics.splice(index, 0, draggedMetric);
    
    setLocalSelectedMetrics(updatedMetrics);
    setDraggingIndex(index);
    
    if (onReorderMetrics) {
      onReorderMetrics(updatedMetrics);
    }
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  // Get metrics to display in the middle column
  const getDisplayMetrics = () => {
    if (searchTerm.trim().length > 0) {
      return searchResults;
    }
    
    if (!selectedCategory) return [];
    
    return categories
      .find(c => c.category === selectedCategory)
      ?.metrics || [];
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDark ? 'bg-black/50' : 'bg-gray-600/30'}`}>
      <div className={`w-4/5 max-w-5xl h-4/5 rounded-lg shadow-lg flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Selected Metrics Section - Simplified Horizontal Layout */}
        {localSelectedMetrics.length > 0 && (
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Selected Metrics
            </h3>
            <div className="flex flex-wrap gap-2">
              {localSelectedMetrics.map((metric, index) => (
                <div
                  key={metric.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
                    isDark 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  } ${draggingIndex === index ? (isDark ? 'border-blue-500' : 'border-blue-500') : ''}`}
                >
                  <span>{metric.name}</span>
                  <button
                    onClick={() => handleRemoveMetric(metric.id)}
                    className={`ml-1 p-0.5 rounded-full ${
                      isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Section with Title */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Browse Metrics
          </h3>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <Input
              type="text"
              placeholder="Search metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
            />
            <button 
              onClick={onClose}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
        
        {/* Content - Always Three Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
            </div>
          ) : (
            <div className="flex-1 flex">
              {/* Categories Column */}
              <div className={`w-1/3 p-4 overflow-y-auto border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Categories
                </h3>
                <div className="space-y-1">
                  {/* Search Results Category */}
                  {searchTerm.trim().length > 0 && (
                    <div
                      onClick={() => handleCategoryClick('search-results')}
                      className={`p-2 rounded cursor-pointer text-xs ${
                        isDark ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-100 border border-blue-300'
                      }`}
                    >
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        Search Results
                      </span>
                      <span className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({searchResults.length})
                      </span>
                    </div>
                  )}
                  
                  {/* Regular Categories */}
                  {categories.map((categoryGroup) => (
                    <div
                      key={categoryGroup.category}
                      onClick={() => handleCategoryClick(categoryGroup.category)}
                      className={`p-2 rounded cursor-pointer text-xs ${
                        selectedCategory === categoryGroup.category && searchTerm.trim().length === 0
                          ? isDark ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-100 border border-blue-300'
                          : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {categoryGroup.category}
                      </span>
                      <span className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({categoryGroup.metrics.length})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Metrics Column */}
              <div className={`w-1/3 p-4 overflow-y-auto border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {searchTerm.trim().length > 0 ? 'Search Results' : 'Metrics'}
                </h3>
                {getDisplayMetrics().length === 0 && searchTerm.trim().length > 0 ? (
                  <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No metrics found matching "{searchTerm}"
                  </p>
                ) : (
                  <div className="space-y-1">
                    {getDisplayMetrics().map((metric) => (
                      <div
                        key={metric.id}
                        onClick={() => handleMetricClick(metric)}
                        className={`p-2 rounded cursor-pointer text-xs ${
                          selectedMetric?.id === metric.id
                            ? isDark ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-100 border border-blue-300'
                            : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        } ${isMetricSelected(metric) ? (isDark ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-green-500') : ''}`}
                      >
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                          {metric.name}
                        </span>
                        {searchTerm.trim().length > 0 && (
                          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {metric.category}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Details Column */}
              <div className="w-1/3 p-4 overflow-y-auto">
                <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Details
                </h3>
                {selectedMetric ? (
                  <div>
                    <h4 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedMetric.name}
                    </h4>
                    <div className={`mt-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedMetric.description}
                    </div>
                    
                    {selectedMetric.unit && (
                      <div className="mt-2">
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Unit:
                        </span>
                        <span className={`ml-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {selectedMetric.unit}
                        </span>
                      </div>
                    )}
                    
                    {selectedMetric.formula && (
                      <div className="mt-2">
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Formula:
                        </span>
                        <div className={`mt-1 p-2 rounded font-mono text-xs ${
                          isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedMetric.formula}
                        </div>
                      </div>
                    )}
                    
                    {selectedMetric.isHigherBetter !== undefined && (
                      <div className="mt-2">
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Interpretation:
                        </span>
                        <span className={`ml-1 text-xs ${
                          selectedMetric.isHigherBetter
                            ? isDark ? 'text-green-400' : 'text-green-600'
                            : isDark ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {selectedMetric.isHigherBetter ? 'Higher is better' : 'Lower is better'}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <Button
                        onClick={handleSelectMetric}
                        className={`w-full text-xs ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                      >
                        Select Metric
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select a metric to view details
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
          <Button
            onClick={onClose}
            variant="outline"
            className={`mr-2 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
} 