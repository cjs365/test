import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ReferenceLine,
  Cell
} from 'recharts';
import ChartTooltip from '@/app/components/charts/ChartTooltip';

interface ChartDataPoint {
  year: string;
  value: number | null | undefined;
  isForecast?: boolean;
}

interface MetricsChartProps {
  title: string;
  data: ChartDataPoint[];
  preferredUnit?: string;
}

export default function MetricsChart({ title, data, preferredUnit }: MetricsChartProps) {
  // Ensure data is valid and handle potential null/undefined values
  const validData = Array.isArray(data) ? data : [];
  
  // Prepare data for chart - use a single series
  const chartData = validData
    .filter(point => point && typeof point === 'object' && point.year)
    .map(point => ({
      year: point.year,
      value: point.value !== null && point.value !== undefined ? Number(point.value) : 0,
      isForecast: !!point.isForecast
    }));
  
  // Check if we have data
  const hasData = chartData.length > 0;
  
  // Determine if we're using percentage format based on title
  const isPercentage = title.toLowerCase().includes('growth') || 
                       title.toLowerCase().includes('margin') || 
                       title.toLowerCase().includes('aroic') ||
                       title.includes('%');
  
  // Format Y-axis values
  const formatYAxis = (value: number) => {
    // For percentages
    if (isPercentage) {
      return `${value}%`;
    }
    
    // For large numbers
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    
    return value.toString();
  };

  return (
    <div className="h-64">
      <h4 className="text-sm font-medium mb-2 text-gray-700">{title}</h4>
      {!hasData ? (
        <div className="flex items-center justify-center h-56 bg-gray-100 rounded-md">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart 
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10 }}
              height={30}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickFormatter={formatYAxis}
              width={40}
            />
            <ChartTooltip
              formatType={isPercentage ? 'percent' : 'short'}
              labelFormatter={(label) => `Year: ${label}`}
              unit={preferredUnit}
              decimals={1}
            />
            <ReferenceLine y={0} stroke="#666" />
            <Bar 
              dataKey="value" 
              name={title}
              radius={[2, 2, 0, 0]}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.isForecast ? '#f87171' : '#3b82f6'}
                  stroke={entry.isForecast ? '#ef4444' : '#1d4ed8'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 