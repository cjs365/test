import React from 'react';
import { Tooltip } from 'recharts';
import CustomTooltip from '../CustomTooltip';
import { formatTooltipValue } from '@/app/lib/utils';

interface ChartTooltipProps {
  // Standard tooltip props
  formatter?: (value: any, name?: string, props?: any) => [string, string] | string;
  labelFormatter?: (value: any) => string;
  offset?: number;
  wrapperClassName?: string;
  cursor?: boolean | object;
  
  // Custom props for our formatting
  formatType?: 'auto' | 'number' | 'percent' | 'currency' | 'short';
  unit?: string;
  prefix?: string;
  decimals?: number;
  showSign?: boolean;
  showLabel?: boolean;
}

/**
 * Enhanced tooltip component for charts that provides consistent styling
 * and behavior across the entire application
 */
const ChartTooltip: React.FC<ChartTooltipProps> = ({
  // Standard tooltip props
  formatter,
  labelFormatter,
  offset,
  wrapperClassName,
  cursor,
  
  // Custom formatting options
  formatType = 'auto',
  unit,
  prefix,
  decimals = 1,
  showSign = false,
  showLabel = true,
}) => {
  // If no custom formatter provided, create one using our utility function
  const defaultFormatter = formatter || ((value: any, name?: string) => {
    const formattedValue = formatTooltipValue(value, name, {
      formatType,
      unit,
      prefix,
      decimals,
      forceSign: showSign
    });
    return [formattedValue, name || ''];
  });
  
  return (
    <Tooltip
      formatter={defaultFormatter}
      labelFormatter={labelFormatter}
      offset={offset}
      wrapperClassName={wrapperClassName}
      cursor={cursor}
      content={(props: any) => (
        <CustomTooltip 
          {...props}
          formatter={defaultFormatter} 
          labelFormatter={labelFormatter}
          preferredUnit={unit}
          showLabel={showLabel}
        />
      )}
    />
  );
};

export default ChartTooltip; 