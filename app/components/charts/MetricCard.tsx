'use client';

type MetricCardProps = {
  label: string;
  value: string | number;
  percentile?: number;
  comparison?: {
    label: string;
    value: string | number;
  };
};

export default function MetricCard({ label, value, percentile, comparison }: MetricCardProps) {
  const getPercentileColor = (p: number) => {
    if (p >= 80) return 'text-green-500';
    if (p >= 60) return 'text-blue-500';
    if (p >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-gray-50 p-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-500 font-medium">{label}</div>
          <div className="text-sm font-mono font-semibold mt-0.5">{value}</div>
        </div>
        {percentile && (
          <div className="text-right">
            <div className="text-xs text-gray-500">Percentile</div>
            <div className={`text-sm font-mono font-medium ${getPercentileColor(percentile)}`}>
              {percentile}%
            </div>
          </div>
        )}
      </div>
      {comparison && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{comparison.label}</span>
            <span className="font-mono">{comparison.value}</span>
          </div>
        </div>
      )}
    </div>
  );
} 