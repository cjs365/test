'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Criterion, MetricType, Operator, MetricDefinition } from '@/app/types/screener';
import { X, ChevronDown, Check, Search, Play } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeProvider';
import MetricsSelector from './MetricsSelector';
import { getAllMetrics, searchMetrics } from '@/mock-data/screener/screenerData';

const operators: { value: Operator; label: string }[] = [
  { value: 'equal', label: '=' },
  { value: 'not_equal', label: '≠' },
  { value: 'greater_than', label: '>' },
  { value: 'greater_than_equal', label: '≥' },
  { value: 'less_than', label: '<' },
  { value: 'less_than_equal', label: '≤' },
  { value: 'between', label: 'between' },
];

type CriteriaBuilderProps = {
  criteria: Criterion[];
  onCriteriaChange: (criteria: Criterion[]) => void;
  onRunScreen?: () => void;
};

export default function CriteriaBuilder({
  criteria,
  onCriteriaChange,
  onRunScreen = () => {},
}: CriteriaBuilderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MetricDefinition[]>([]);
  const [allMetrics, setAllMetrics] = useState<MetricDefinition[]>([]);
  const [showMetricsSelector, setShowMetricsSelector] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null);
  
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Update refs array when criteria changes
  useEffect(() => {
    dropdownRefs.current = dropdownRefs.current.slice(0, criteria.length);
  }, [criteria.length]);
  
  // Fetch all metrics on component mount
  useEffect(() => {
    const fetchMetrics = async () => {
      const metrics = await getAllMetrics();
      setAllMetrics(metrics);
    };
    
    fetchMetrics();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdownIndex !== null && 
          dropdownRefs.current[activeDropdownIndex] && 
          !dropdownRefs.current[activeDropdownIndex]?.contains(event.target as Node)) {
        setActiveDropdownIndex(null);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdownIndex]);

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

  const handleAddCriterion = () => {
    // Find the first metric from our loaded metrics
    const defaultMetric = allMetrics.length > 0 ? allMetrics[0].name : 'Dividend Yield';
    
    const newCriterion: Criterion = {
      metric: defaultMetric as MetricType,
      operator: 'greater_than',
      value1: 0,
    };
    onCriteriaChange([...criteria, newCriterion]);
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = criteria.filter((_, i) => i !== index);
    onCriteriaChange(newCriteria);
    
    // If we're removing the active dropdown, clear it
    if (activeDropdownIndex === index) {
      setActiveDropdownIndex(null);
      setSearchTerm('');
    } else if (activeDropdownIndex !== null && activeDropdownIndex > index) {
      // Adjust the active dropdown index if we're removing an item before it
      setActiveDropdownIndex(activeDropdownIndex - 1);
    }
  };

  const handleCriterionChange = (
    index: number,
    field: keyof Criterion,
    value: string | number
  ) => {
    const newCriteria = [...criteria];
    newCriteria[index] = {
      ...newCriteria[index],
      [field]: value,
    };
    onCriteriaChange(newCriteria);
  };

  const toggleDropdown = (index: number) => {
    if (activeDropdownIndex === index) {
      setActiveDropdownIndex(null);
      setSearchTerm('');
    } else {
      setActiveDropdownIndex(index);
      setSearchTerm('');
    }
  };

  const handleMetricSelect = (index: number, metric: string) => {
    handleCriterionChange(index, 'metric', metric);
    setActiveDropdownIndex(null);
    setSearchTerm('');
  };

  const handleBrowseAllMetrics = (index: number) => {
    setCurrentEditingIndex(index);
    setShowMetricsSelector(true);
    setActiveDropdownIndex(null);
  };

  const handleMetricSelectorSelect = (metric: MetricDefinition) => {
    if (currentEditingIndex !== null) {
      handleCriterionChange(currentEditingIndex, 'metric', metric.name);
    }
    setShowMetricsSelector(false);
    setCurrentEditingIndex(null);
  };

  const handleRemoveMetric = (metricId: string) => {
    // Find the criterion with this metric and remove it
    const indexToRemove = criteria.findIndex(c => {
      const metric = allMetrics.find(m => m.name === c.metric);
      return metric?.id === metricId;
    });
    
    if (indexToRemove !== -1) {
      handleRemoveCriterion(indexToRemove);
    }
  };

  const handleReorderMetrics = (reorderedMetrics: MetricDefinition[]) => {
    // Create a map of metric ID to criterion
    const criteriaMap = new Map<string, Criterion>();
    
    criteria.forEach(criterion => {
      const metric = allMetrics.find(m => m.name === criterion.metric);
      if (metric) {
        criteriaMap.set(metric.id, criterion);
      }
    });
    
    // Create a new array of criteria in the reordered order
    const newCriteria = reorderedMetrics
      .map(metric => criteriaMap.get(metric.id))
      .filter((c): c is Criterion => c !== undefined);
    
    // Add any criteria that weren't in the reordered list (should be rare)
    criteria.forEach(criterion => {
      const metric = allMetrics.find(m => m.name === criterion.metric);
      if (!metric || !reorderedMetrics.some(m => m.id === metric.id)) {
        newCriteria.push(criterion);
      }
    });
    
    onCriteriaChange(newCriteria);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Get top matching metrics for a criterion
  const getTopMatchingMetrics = (index: number, limit = 5) => {
    const currentMetric = criteria[index]?.metric || '';
    
    // If we have search results, use those
    if (searchTerm.trim().length > 0) {
      return searchResults.slice(0, limit).map(m => m.name as MetricType);
    }
    
    // Otherwise, show current metric at top followed by other metrics
    const otherMetrics = allMetrics
      .filter(m => m.name !== currentMetric)
      .slice(0, limit - 1)
      .map(m => m.name as MetricType);
    
    return [currentMetric, ...otherMetrics];
  };

  return (
    <div className="bg-transparent">
      <div className={`space-y-2 ${criteria.length > 0 ? 'divide-y divide-gray-200 dark:divide-gray-700' : ''}`}>
        {criteria.length === 0 ? (
          <div className={`text-sm italic text-center py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No criteria defined. Add criteria or use the AI generator above.
          </div>
        ) : (
          criteria.map((criterion, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-2 py-2 relative group"
            >
              <button
                onClick={() => handleRemoveCriterion(index)}
                className={`${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Remove criterion"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* Metric Dropdown */}
              <div 
                className="relative w-[160px]" 
                ref={(el) => { dropdownRefs.current[index] = el; }}
              >
                <div
                  onClick={() => toggleDropdown(index)}
                  className={`flex items-center justify-between px-3 py-1 text-xs h-8 rounded border cursor-pointer ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <span className="truncate">{criterion.metric}</span>
                  <ChevronDown className="h-4 w-4 ml-1 flex-shrink-0" />
                </div>
                
                {activeDropdownIndex === index && (
                  <div className={`absolute z-10 w-64 mt-1 rounded-md border shadow-lg ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {/* Search Box */}
                    <div className={`p-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="relative">
                        <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <Input
                          type="text"
                          placeholder="Type To Search..."
                          value={searchTerm}
                          onChange={handleSearchInputChange}
                          className={`pl-8 text-xs h-8 ${
                            isDark 
                              ? 'bg-gray-800 border-gray-700 text-gray-200' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    {/* Metrics List */}
                    <div className={`max-h-60 overflow-y-auto`}>
                      {/* Selected/Top Matching Items */}
                      {getTopMatchingMetrics(index).map((metric) => (
                        <div
                          key={metric}
                          onClick={() => handleMetricSelect(index, metric)}
                          className={`flex items-center px-3 py-2 text-xs cursor-pointer ${
                            criterion.metric === metric
                              ? isDark ? 'bg-blue-900/30' : 'bg-blue-50'
                              : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                          }`}
                        >
                          {criterion.metric === metric && (
                            <Check className={`h-4 w-4 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                          )}
                          <span className={criterion.metric === metric ? 'ml-0' : 'ml-6'}>
                            {metric}
                          </span>
                        </div>
                      ))}
                      
                      {/* Browse All Metrics Button */}
                      <div
                        className={`flex items-center justify-center px-3 py-2 text-xs cursor-pointer border-t ${
                          isDark 
                            ? 'border-gray-700 text-blue-400 hover:bg-gray-700' 
                            : 'border-gray-200 text-blue-600 hover:bg-gray-100'
                        }`}
                        onClick={() => handleBrowseAllMetrics(index)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Browse All Metrics
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Select
                value={criterion.operator}
                onValueChange={(value: Operator) =>
                  handleCriterionChange(index, 'operator', value)
                }
              >
                <SelectTrigger className={`w-[100px] text-xs h-8 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-900'
                }>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={criterion.value1}
                onChange={(e) =>
                  handleCriterionChange(index, 'value1', parseFloat(e.target.value))
                }
                className={`w-[80px] text-xs h-8 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />

              {criterion.operator === 'between' && (
                <>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>and</span>
                  <Input
                    type="number"
                    value={criterion.value2 || 0}
                    onChange={(e) =>
                      handleCriterionChange(
                        index,
                        'value2',
                        parseFloat(e.target.value)
                      )
                    }
                    className={`w-[80px] text-xs h-8 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 text-gray-200' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Action Buttons - Moved to bottom */}
      <div className="flex justify-start mt-4 gap-2">
        <Button
          onClick={handleAddCriterion}
          className={`text-white ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          size="sm"
        >
          Add Criterion
        </Button>
        <Button
          onClick={onRunScreen}
          className={`text-white ${isDark ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'}`}
          size="sm"
        >
          <Play className="h-3 w-3 mr-1" />
          Run Screen
        </Button>
      </div>
      
      {/* Metrics Selector Modal */}
      {showMetricsSelector && (
        <MetricsSelector
          onSelect={handleMetricSelectorSelect}
          onClose={() => setShowMetricsSelector(false)}
          selectedMetrics={criteria.map(c => {
            const metric = allMetrics.find(m => m.name === c.metric);
            return metric || { 
              id: c.metric.toLowerCase().replace(/\s+/g, '-'),
              name: c.metric,
              category: 'Other' as any,
              description: ''
            };
          })}
          onRemoveMetric={handleRemoveMetric}
          onReorderMetrics={handleReorderMetrics}
        />
      )}
    </div>
  );
} 