import React from 'react';
import { formatTooltipValue } from '@/app/lib/utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
  formatter?: (value: any, name?: string, props?: any) => React.ReactNode | [React.ReactNode, React.ReactNode];
  labelFormatter?: (value: any) => React.ReactNode;
  preferredUnit?: string;
  showLabel?: boolean;
}

export default function CustomTooltip({ 
  active, 
  payload, 
  label, 
  formatter, 
  labelFormatter, 
  preferredUnit,
  showLabel = true 
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  
  // Format label if labelFormatter is provided
  const formattedLabel = labelFormatter ? labelFormatter(label) : label;
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-sm rounded-md max-w-xs">
      {showLabel && formattedLabel && (
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 pb-1 border-b border-gray-100 dark:border-gray-700">
          {formattedLabel}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((item, index) => {
          // Skip entries with null/undefined values
          if (item.value === null || item.value === undefined) return null;
          
          // Format the value using either provided formatter or our utility
          let displayValue;
          let displayName = item.name;
          
          if (formatter) {
            const formattedResult = formatter(item.value, item.name, item);
            if (Array.isArray(formattedResult)) {
              [displayValue, displayName] = formattedResult;
            } else {
              displayValue = formattedResult;
            }
          } else {
            displayValue = formatTooltipValue(item.value, item.name, { 
              unit: preferredUnit
            });
          }
          
          // Set color based on entry
          const color = item.color || item.stroke || '#8884d8';
          
          return (
            <div 
              key={`tooltip-item-${index}`} 
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1">
                <div 
                  className="h-2.5 w-2.5 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: color }} 
                />
                <span className="font-medium text-gray-700 dark:text-gray-200">{displayName}: </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white ml-1">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 