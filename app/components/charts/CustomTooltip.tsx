import React from 'react';
import { getHighlightedBgColor } from '@/app/lib/utils';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<any>;
  label?: string;
  formatter?: (value: any, name?: string, props?: any) => React.ReactNode | [React.ReactNode, React.ReactNode];
  labelFormatter?: (value: any) => React.ReactNode;
  itemSorter?: (a: any, b: any) => number;
  wrapperClassName?: string;
  contentClassName?: string;
  labelClassName?: string;
  itemClassName?: string;
  preferredUnit?: string;
  showLabel?: boolean;
}

/**
 * Enhanced CustomTooltip for Recharts
 * 
 * A more robust and versatile tooltip component that works consistently across different chart types
 */
const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  formatter, 
  labelFormatter, 
  itemSorter,
  wrapperClassName = '',
  contentClassName = '',
  labelClassName = '',
  itemClassName = '',
  preferredUnit,
  showLabel = true
}) => {
  if (!active || !payload || !payload.length) return null;

  // Sort items if itemSorter is provided
  const sortedPayload = itemSorter ? [...payload].sort(itemSorter) : payload;
  
  // Format label if labelFormatter is provided
  const formattedLabel = labelFormatter ? labelFormatter(label) : label;
  
  return (
    <div className={`bg-card border border-border shadow-lg rounded-md p-3 text-xs max-w-xs ${wrapperClassName}`}>
      {showLabel && formattedLabel && (
        <div className={`font-medium pb-1.5 mb-1.5 border-b border-border ${labelClassName}`}>
          {formattedLabel}
        </div>
      )}
      <div className={`space-y-1.5 ${contentClassName}`}>
        {sortedPayload.map((entry, index) => {
          // Skip entries with null/undefined values
          if (entry.value === null || entry.value === undefined) return null;
          
          // Use formatter if provided or default to value formatting
          const formattedValue = formatter 
            ? (formatter(entry.value, entry.name, entry) as string | [string, string])
            : entry.value;
          
          let valueDisplay: React.ReactNode;
          let nameDisplay: React.ReactNode = entry.name;
          
          // Handle when formatter returns [value, name]
          if (Array.isArray(formattedValue)) {
            valueDisplay = formattedValue[0];
            nameDisplay = formattedValue[1] || entry.name;
          } else {
            valueDisplay = formattedValue;
          }
          
          // Set color based on entry or series color
          const color = entry.color || entry.stroke || '#8884d8';
          const highlightBg = getHighlightedBgColor(color, 0.2);
          
          return (
            <div 
              key={`tooltip-item-${index}`}
              className={`flex items-center justify-between whitespace-nowrap ${itemClassName}`}
            >
              <div className="flex items-center gap-1">
                <div 
                  className="h-2.5 w-2.5 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium mr-1">{nameDisplay}:</span>
              </div>
              <span className="font-semibold">{valueDisplay}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomTooltip; 