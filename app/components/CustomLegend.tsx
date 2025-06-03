export default function CustomLegend() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-[#0A4174]" />
        <span className="text-xs text-gray-600">Historical</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 bg-[#93C5FD]" />
        <span className="text-xs text-gray-600">Forecast</span>
      </div>
    </div>
  );
} 