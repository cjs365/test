import React from 'react';
import { formatTooltipValue } from '@/app/lib/utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  preferredUnit?: string;
  unit?: string;
  formatter?: (value: any, name?: string, props?: any) => React.ReactNode | [React.ReactNode, React.ReactNode];
  labelFormatter?: (value: any) => React.ReactNode;
}

const CustomTooltip = ({ 
  active, 
  payload, 
  label, 
  preferredUnit, 
  unit,
  formatter,
  labelFormatter
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;
  
  // Format label if labelFormatter is provided
  const formattedLabel = labelFormatter ? labelFormatter(label) : label;
  const unitToUse = unit || preferredUnit;
  
  // Check if any datapoint is a forecast
  const isForecast = payload.some(p => 
    p.dataKey === 'forecastValue' || 
    (p.name && p.name.toLowerCase().includes('forecast'))
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 shadow-sm rounded-md">
      <p className="font-medium text-gray-900 dark:text-gray-100 text-xs">
        {formattedLabel} {isForecast && '(Forecast)'}
      </p>
      <div className="mt-1.5 space-y-1.5">
        {payload.map((entry, index) => {
          // Skip entries with null/undefined values
          if (entry.value === null || entry.value === undefined) return null;
          
          // Format the value using either provided formatter or our utility
          let displayValue;
          let displayName = entry.name;
          
          if (formatter) {
            const formattedResult = formatter(entry.value, entry.name, entry);
            if (Array.isArray(formattedResult)) {
              [displayValue, displayName] = formattedResult;
            } else {
              displayValue = formattedResult;
            }
          } else {
            // Determine if this is a forecast value for styling
            const entryIsForecast = entry.dataKey === 'forecastValue' || 
                                   (entry.name && entry.name.toLowerCase().includes('forecast'));
            
            // Get the name in lowercase for format detection
            const nameLower = (entry.name || '').toLowerCase();
            
            // Determine format type based on name
            let formatType = 'auto';
            if (nameLower.includes('growth') || 
                nameLower.includes('margin') || 
                nameLower.includes('aroic') || 
                nameLower.includes('%')) {
              formatType = 'percent';
            }
            
            displayValue = formatTooltipValue(entry.value, entry.name, {
              formatType: formatType as any,
              unit: unitToUse
            });
          }
          
          // Set color based on entry
          const color = entry.color || entry.stroke || (isForecast ? '#f87171' : '#3b82f6');
          
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
                <span className="font-medium text-gray-700 dark:text-gray-300">{displayName}: </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomTooltip; 