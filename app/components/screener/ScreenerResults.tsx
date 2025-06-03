'use client';

import { ScreenerResult, ColumnType } from '@/app/types/screener';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeProvider';

type ScreenerResultsProps = {
  results: ScreenerResult[];
  columns: ColumnType[];
};

export default function ScreenerResults({ results, columns }: ScreenerResultsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="bg-transparent">
      <div className="flex justify-between items-center p-3">
        <div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {results.length} stocks match your criteria
          </p>
        </div>
        <Button className={`text-white text-xs h-7 px-3 py-0 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
          Export
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full ${isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark 
                      ? 'bg-gray-900 text-gray-400' 
                      : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
            {results.map((stock) => (
              <tr
                key={stock.symbol}
                className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
              >
                {columns.map((column) => (
                  <td
                    key={`${stock.symbol}-${column}`}
                    className="px-3 py-2 whitespace-nowrap text-xs"
                  >
                    {column === 'Symbol' ? (
                      <Link
                        href={`/stock/${stock.symbol}/overview`}
                        className={`font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                      >
                        {stock.symbol}
                      </Link>
                    ) : column === 'Name' ? (
                      <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>{stock.name}</span>
                    ) : (
                      <span className={`text-right block ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                        {formatMetric(column, stock.metrics[column as keyof typeof stock.metrics])}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatMetric(metric: ColumnType, value: number | undefined): string {
  if (value === undefined) return '-';

  switch (metric) {
    case 'Dividend Yield':
      return `${value.toFixed(2)}%`;
    case 'P/E Ratio':
      return `${value.toFixed(1)}x`;
    case 'Market Cap':
      return `$${value.toLocaleString()}M`;
    case 'Beta':
      return value.toFixed(2);
    case 'Price':
      return `$${value.toFixed(2)}`;
    case 'Volume':
      return value.toLocaleString();
    case 'EPS Growth':
    case 'Revenue Growth':
      return `${value.toFixed(1)}%`;
    default:
      return value.toString();
  }
} 