'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';
import { Criterion, MetricType, Operator } from '@/app/types/screener';
import { X } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeProvider';

const metrics: MetricType[] = [
  'Dividend Yield',
  'P/E Ratio',
  'Market Cap',
  'Beta',
  'Price',
  'Volume',
  'EPS Growth',
  'Revenue Growth',
];

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
};

export default function CriteriaBuilder({
  criteria,
  onCriteriaChange,
}: CriteriaBuilderProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleAddCriterion = () => {
    const newCriterion: Criterion = {
      metric: 'Dividend Yield',
      operator: 'greater_than',
      value1: 0,
    };
    onCriteriaChange([...criteria, newCriterion]);
  };

  const handleRemoveCriterion = (index: number) => {
    const newCriteria = criteria.filter((_, i) => i !== index);
    onCriteriaChange(newCriteria);
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

  return (
    <div className="bg-transparent">
      <div className="flex justify-end mb-2">
        <Button
          onClick={handleAddCriterion}
          className={`text-white ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          size="sm"
        >
          Add Criterion
        </Button>
      </div>

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
              <Select
                value={criterion.metric}
                onValueChange={(value: MetricType) =>
                  handleCriterionChange(index, 'metric', value)
                }
              >
                <SelectTrigger className={`w-[160px] text-xs h-8 ${
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
                  {metrics.map((metric) => (
                    <SelectItem key={metric} value={metric}>
                      {metric}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

              <button
                onClick={() => handleRemoveCriterion(index)}
                className={`ml-auto ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Remove criterion"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 