interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
}

export default function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;

  return (
    <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
      <p className="text-xs font-medium text-gray-600 mb-1">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-xs">
          <span className="font-medium">{item.name}: </span>
          <span>{typeof item.value === 'number' ? item.value.toFixed(1) : item.value}</span>
        </p>
      ))}
    </div>
  );
} 