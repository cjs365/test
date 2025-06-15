// Legend for historical vs forecast
const CustomLegend = () => {
  return (
    <div className="flex items-center justify-end space-x-4 text-xs text-gray-600 mb-2">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-[#1d4ed8] mr-1"></div>
        <span>Historical</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-1"></div>
        <span>Forecast</span>
      </div>
    </div>
  );
};

export default CustomLegend; 