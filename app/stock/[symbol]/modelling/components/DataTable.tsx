import { useRef, useEffect, useState } from 'react';
import { TableData } from '../types';
import { formatLargeNumber, formatWithCommas } from '../utils/formatters';

interface DataTableProps {
  tableData: TableData;
  headers: string[];
  handleInputChange: (metric: string, year: string, value: string) => void;
}

const DataTable = ({ tableData, headers, handleInputChange }: DataTableProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // Debug log for table data
  useEffect(() => {
    console.log('DataTable received tableData:', tableData);
    
    // Check forecast metrics specifically
    const forecastYears = headers.slice(-5);
    console.log('Forecast years:', forecastYears);
    
    // Log the forecast values for the key metrics
    ['revenue_gr', 'earnings_margin', 'ic_gr'].forEach(metric => {
      if (tableData[metric]) {
        console.log(`${metric} forecast values:`, 
          forecastYears.map(year => ({ 
            year, 
            value: tableData[metric]?.[year] || 0 
          }))
        );
      } else {
        console.log(`${metric} is undefined or null in tableData`);
      }
    });
  }, [tableData, headers]);
  
  return (
    <div className="relative">
      <div 
        ref={tableContainerRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="min-w-max">
          <table className="w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 sticky left-0 bg-gray-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  Metric
                </th>
                {headers.map(year => (
                  <th key={year} className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { key: 'total_revenue', label: 'Revenue', format: 'number' },
                { key: 'revenue_gr', label: 'Revenue Gr', format: 'percent', editable: true, italic: true },
                { key: 'economic_earnings', label: 'Earnings', format: 'number' },
                { key: 'earnings_margin', label: 'Earnings Margin', format: 'percent', editable: true, italic: true },
                { key: 'ic', label: 'IC', format: 'number' },
                { key: 'ic_gr', label: 'IC Growth', format: 'percent', editable: true, italic: true },
                { key: 'ic_change', label: 'IC Change', format: 'number' },
                { key: 'aroic', label: 'AROIC', format: 'percent' },
                { key: 'fcf', label: 'FCF', format: 'number' },
                { key: 'fcf_gr', label: 'FCF Growth', format: 'percent', italic: true }
              ].map(({ key, label, format, editable, italic }) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className={`px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${italic ? 'italic' : ''}`}>
                    {label}
                  </td>
                  {headers.map((year, yearIndex) => {
                    // Safely access the value with fallbacks
                    const valueObj = tableData[key] || {};
                    const value = valueObj[year] || 0;
                    
                    // Debug log for editable forecast cells
                    if (editable && yearIndex >= 6) {
                      console.log(`Cell ${key}[${year}] = ${value}`);
                    }
                    
                    const isEditable = editable && yearIndex >= 6;
                    const formattedValue = format === 'percent' ? 
                      `${formatWithCommas(value)}` : 
                      formatLargeNumber(value).formatted;

                    return (
                      <td key={year} className="px-2 py-2 whitespace-nowrap text-sm text-gray-500">
                        {isEditable ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={formatWithCommas(value)}
                            className="w-full px-1 py-0.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-yellow-50"
                            onChange={(e) => handleInputChange(key, year, e.target.value)}
                          />
                        ) : (
                          <span className={yearIndex >= 6 ? 'text-blue-600' : ''}>
                            {formattedValue}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable; 