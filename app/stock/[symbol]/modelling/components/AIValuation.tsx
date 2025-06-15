import { useState } from 'react';
import { AIScenario } from '../types';

interface AIValuationProps {
  aiValuation: string | null;
  aiScenario: AIScenario | null;
  isGenerating: boolean;
  loadingMessage: string;
  loadingDots: string;
  handleGenerateValuation: () => void;
  handleApplyAIScenario: () => void;
  handleReset: () => void;
  error: string | null;
}

const AIValuation = ({
  aiValuation,
  aiScenario,
  isGenerating,
  loadingMessage,
  loadingDots,
  handleGenerateValuation,
  handleApplyAIScenario,
  handleReset,
  error
}: AIValuationProps) => {
  const [isAiValuationExpanded, setIsAiValuationExpanded] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-medium text-gray-900">AI Valuation</h3>
        <div className="flex items-center space-x-2">
          {aiValuation && (
            <button
              onClick={() => setIsAiValuationExpanded(!isAiValuationExpanded)}
              className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${isAiValuationExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {isAiValuationExpanded ? 'Collapse' : 'Expand'}
            </button>
          )}
          <div className="flex flex-col items-end relative">
            {loadingMessage && (
              <div className="absolute bottom-full mb-2 text-sm text-gray-600 whitespace-nowrap">
                {loadingMessage}{loadingDots}
              </div>
            )}
            <button
              onClick={handleGenerateValuation}
              disabled={isGenerating}
              className="inline-flex items-center px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <span className="flex items-center space-x-2">
                <span>Generate AI Valuation</span>
                {isGenerating && (
                  <svg className="animate-spin h-4 w-4 ml-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Error message display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {aiValuation && isAiValuationExpanded && (
        <div className="mb-6 prose prose-sm max-w-none">
          <div className="rounded-lg bg-gray-50 p-4">
            {/* AI Scenario Data Table */}
            {aiScenario && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">AI Scenario Assumptions</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500">Metric</th>
                        {Object.keys(aiScenario.revenue_gr).map(year => (
                          <th key={year} className="px-2 py-1 text-left text-xs font-medium text-gray-500">{year}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-2 py-1 text-xs font-medium">Revenue Gr (%)</td>
                        {Object.entries(aiScenario.revenue_gr).map(([year, value]) => (
                          <td key={year} className="px-2 py-1 text-xs text-blue-600">{value.toFixed(1)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs font-medium">Earnings Margin (%)</td>
                        {Object.entries(aiScenario.earnings_margin).map(([year, value]) => (
                          <td key={year} className="px-2 py-1 text-xs text-blue-600">{value.toFixed(1)}</td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-2 py-1 text-xs font-medium">IC Growth (%)</td>
                        {Object.entries(aiScenario.ic_gr).map(([year, value]) => (
                          <td key={year} className="px-2 py-1 text-xs text-blue-600">{value.toFixed(1)}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Reset to Default
                  </button>
                  <button
                    onClick={handleApplyAIScenario}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Apply Scenario
                  </button>
                </div>
              </div>
            )}

            {/* Existing AI Valuation Content */}
            {aiValuation.split('\n').map((line, index) => (
              <div key={index} className="markdown-line">
                {line.startsWith('###') ? (
                  <h3 className="text-sm font-semibold mt-3 mb-2">{line.replace('### ', '')}</h3>
                ) : line.startsWith('##') ? (
                  <h2 className="text-base font-semibold mb-3">{line.replace('## ', '')}</h2>
                ) : line.startsWith('-') ? (
                  <p className="text-sm text-gray-600 ml-4 my-1">• {line.replace('- ', '')}</p>
                ) : line.startsWith('  •') ? (
                  <p className="text-sm text-gray-600 ml-8 my-1">{line}</p>
                ) : (
                  <p className="text-sm text-gray-600 my-1">{line}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIValuation; 