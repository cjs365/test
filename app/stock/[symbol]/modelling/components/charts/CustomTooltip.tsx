import { formatLargeNumber } from '../../utils/formatters';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  preferredUnit?: string;
  unit?: string;
}

// Custom tooltip formatter with more context
const CustomTooltip = ({ active, payload, label, preferredUnit, unit }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    // Find the non-null value (either historical or forecast)
    const dataPoint = payload.find(p => p.value !== null && p.value !== undefined);
    
    if (!dataPoint) return null;
    
    const value = dataPoint.value;
    const dataKey = dataPoint.dataKey;
    const name = dataPoint.name;
    
    // Determine if this is a forecast value
    const isForecast = dataKey === 'forecastValue' || name?.includes('Forecast');
    
    const unitToUse = unit || preferredUnit;
    
    // Format based on type of chart
    let displayValue: string;
    
    // Check if the chart's name contains certain keywords to determine formatting
    const chartName = name?.toLowerCase() || '';
    
    if (value === null || value === undefined) {
      displayValue = 'N/A';
    } else if (chartName.includes('growth') || chartName.includes('margin') || chartName.includes('aroic') || chartName.includes('%')) {
      // Format as percentage
      displayValue = `${Number(value).toFixed(1)}%`;
    } else {
      // Format as large number
      const formatted = formatLargeNumber(value, unitToUse);
      displayValue = formatted.formatted;
    }
    
    return (
      <div className="bg-white border border-gray-200 shadow-sm p-3 text-xs">
        <p className="font-medium text-gray-900">{label} {isForecast && '(Forecast)'}</p>
        <div className="mt-1 space-y-1">
          <p className="text-gray-700">
            {name}: <span className="font-medium">{displayValue}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltip; 