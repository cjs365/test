import { SensitivityData } from '../types';
import { useState } from 'react';

interface SensitivityAnalysisProps {
  sensitivityData: SensitivityData | null;
  generateSensitivityMatrix: () => Promise<void>;
}

const SensitivityAnalysis = ({ sensitivityData, generateSensitivityMatrix }: SensitivityAnalysisProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateMatrix = async () => {
    setIsLoading(true);
    try {
      await generateSensitivityMatrix();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Sensitivity Analysis</h3>
          {sensitivityData && (
            <p className="text-xs text-gray-500 mt-1">Values show potential upside (%)</p>
          )}
        </div>
        <button
          onClick={handleGenerateMatrix}
          disabled={isLoading}
          className={`px-3 py-1 text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} rounded transition-colors flex items-center`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Matrix'
          )}
        </button>
      </div>
      
      {isLoading && !sensitivityData && (
        <div className="py-8 flex justify-center items-center">
          <div className="text-gray-500">Generating sensitivity matrix...</div>
        </div>
      )}
      
      {sensitivityData && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead>
              <tr>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-500 bg-gray-50"></th>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-500 bg-gray-50 border-b" colSpan={sensitivityData.margins.length}>
                  IC Growth
                </th>
              </tr>
              <tr>
                <th className="px-1 py-1 text-center text-xs font-medium text-gray-500 bg-gray-50 w-14">
                  <span className="whitespace-normal">Revenue<br/>Growth</span>
                </th>
                {sensitivityData.margins.map(margin => (
                  <th key={margin} className="px-1 py-1 text-center text-xs font-medium text-gray-500 bg-gray-50">
                    {margin.toFixed(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sensitivityData.growth.map((growth, i) => (
                <tr key={growth}>
                  <td className="px-1 py-1 text-xs font-medium text-gray-500 bg-gray-50 text-center">{growth.toFixed(1)}</td>
                  {sensitivityData.margins.map(margin => {
                    const upside = sensitivityData.matrix[i][sensitivityData.margins.indexOf(margin)];
                    return (
                      <td 
                        key={margin}
                        className={`px-1 py-1 text-xs text-center ${
                          upside >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {upside.toFixed(1)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SensitivityAnalysis; 