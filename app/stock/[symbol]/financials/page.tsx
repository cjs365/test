'use client';

import { useState, useRef, useEffect } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import { formatNumber } from '@/app/lib/utils';
import Image from 'next/image';

type StatementType = 'Income Statement' | 'Balance Sheet' | 'Cash Flow';
type Period = 'Annual' | 'TTM';
type Unit = '.0' | '.00' | 'K' | 'M' | 'B';

interface FinancialMetric {
  name: string;
  values: { [year: string]: number };
  isSubItem?: boolean;
  isBold?: boolean;
}

// Mock data structure
const mockData: FinancialMetric[] = [
  {
    name: 'Gross Profit',
    values: {
      '2020': 104956,
      '2021': 152836,
      '2022': 170782,
      '2023': 169148,
      '2024': 180683,
    }
  },
  {
    name: 'Operating Income/Expenses',
    values: {
      '2020': -38668,
      '2021': -43887,
      '2022': -51345,
      '2023': -54847,
      '2024': -57467,
    }
  },
  {
    name: 'Total Operating Profit/Loss',
    values: {
      '2020': 66288,
      '2021': 108949,
      '2022': 119437,
      '2023': 114301,
      '2024': 123216,
    },
    isBold: true
  },
  {
    name: 'Non-Operating Income/Expense, Total',
    values: {
      '2020': 803,
      '2021': 258,
      '2022': -334,
      '2023': -565,
      '2024': 269,
    }
  },
  {
    name: 'Pretax Income',
    values: {
      '2020': 67091,
      '2021': 109207,
      '2022': 119103,
      '2023': 113736,
      '2024': 123485,
    },
    isBold: true
  },
  {
    name: 'Provision for Income Tax',
    values: {
      '2020': -9680,
      '2021': -14527,
      '2022': -19300,
      '2023': -16741,
      '2024': -29749,
    }
  },
  {
    name: 'Net Income before Extraordinary Items',
    values: {
      '2020': 57411,
      '2021': 94680,
      '2022': 99803,
      '2023': 96995,
      '2024': 93736,
    },
    isBold: true
  },
  {
    name: 'Net Income Available to Common Stockholders',
    values: {
      '2020': 57411,
      '2021': 94680,
      '2022': 99803,
      '2023': 96995,
      '2024': 93736,
    },
    isBold: true
  },
  {
    name: 'Basic Weighted Average Shares Outstanding',
    values: {
      '2020': 17352.12,
      '2021': 16701.27,
      '2022': 16215.96,
      '2023': 15744.23,
      '2024': 15343.78,
    }
  },
  {
    name: 'Diluted Weighted Average Shares Outstanding',
    values: {
      '2020': 17528.21,
      '2021': 16864.92,
      '2022': 16325.82,
      '2023': 15812.55,
      '2024': 15408.10,
    }
  },
  {
    name: 'Total Dividend Per Share',
    values: {
      '2020': 0.795,
      '2021': 0.850,
      '2022': 0.900,
      '2023': 0.940,
      '2024': 0.980,
    }
  },
];

const years = ['2020', '2021', '2022', '2023', '2024'];
const forecastYears = ['2023', '2024'];

export default function FinancialsPage({ params }: { params: { symbol: string } }) {
  const [activeStatement, setActiveStatement] = useState<StatementType>('Income Statement');
  const [activePeriod, setActivePeriod] = useState<Period>('Annual');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showForecast, setShowForecast] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<Unit>('M');
  const [lastUnit, setLastUnit] = useState<'K' | 'M' | 'B'>('M');
  const [decimalPlaces, setDecimalPlaces] = useState<0 | 1 | 2>(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPeriodDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to handle unit selection
  const handleUnitChange = (unit: 'K' | 'M' | 'B') => {
    setLastUnit(unit);
    setSelectedUnit(unit);
  };

  const formatValue = (value: number): string => {
    // Convert the value based on unit
    let convertedValue = value;
    if (lastUnit === 'K') convertedValue = value * 1000;
    if (lastUnit === 'B') convertedValue = value / 1000;
    
    // Format with the current number of decimal places
    return convertedValue.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
  };

  const getDisplayYears = () => {
    if (activePeriod === 'TTM') {
      return years.slice(0, -2); // Remove forecast years for TTM
    }
    return showForecast ? years : years.slice(0, -2);
  };

  return (
    <StockLayout symbol={params.symbol} companyName="Apple Inc.">
      <div className="grid grid-cols-12 min-h-screen bg-white">
        {/* Main Content Area */}
        <div className="col-span-9 border-r">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Financial Statements</h2>
              <p className="text-xs text-gray-500 mt-1">USD except per share data</p>
            </div>

            {/* Statement Type Tabs and Controls */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {/* Left Side Controls */}
                <div className="flex items-center space-x-3">
                  {/* Statement Tabs */}
                  <div className="flex space-x-1">
                    {['Income Statement', 'Balance Sheet', 'Cash Flow'].map((statement) => (
                      <button
                        key={statement}
                        onClick={() => setActiveStatement(statement as StatementType)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                          activeStatement === statement
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {statement}
                      </button>
                    ))}
                  </div>

                  {/* Period Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center"
                    >
                      <span>{activePeriod}</span>
                      <span className="ml-1">▾</span>
                    </button>
                    {showPeriodDropdown && (
                      <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setActivePeriod('Annual');
                              setShowPeriodDropdown(false);
                            }}
                            className="block w-full px-4 py-2 text-xs text-left text-gray-700 hover:bg-gray-100"
                          >
                            Annual
                          </button>
                          <button
                            onClick={() => {
                              setActivePeriod('TTM');
                              setShowPeriodDropdown(false);
                              setShowForecast(false);
                            }}
                            className="block w-full px-4 py-2 text-xs text-left text-gray-700 hover:bg-gray-100"
                          >
                            TTM
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Forecast Toggle */}
                  {activePeriod === 'Annual' && (
                    <button
                      onClick={() => setShowForecast(!showForecast)}
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center space-x-1"
                    >
                      <span>{showForecast ? 'Hide' : 'Show'} Forecast</span>
                    </button>
                  )}
                </div>

                {/* Right Side Controls - Format Buttons */}
                <div className="flex items-center space-x-1">
                  {/* Decimal Format Group */}
                  <div className="flex rounded-md shadow-sm">
                    <button
                      onClick={() => {
                        if (decimalPlaces > 0) {
                          setDecimalPlaces((prev) => (prev - 1) as 0 | 1 | 2);
                        }
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-l-md border ${
                        decimalPlaces === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                      disabled={decimalPlaces === 0}
                    >
                      <span className="text-xs font-medium">.0</span>
                    </button>
                    <button
                      onClick={() => {
                        if (decimalPlaces < 2) {
                          setDecimalPlaces((prev) => (prev + 1) as 0 | 1 | 2);
                        }
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-r-md border-t border-r border-b ${
                        decimalPlaces === 2
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                      disabled={decimalPlaces === 2}
                    >
                      <span className="text-xs font-medium">.00</span>
                    </button>
                  </div>

                  {/* Unit Format Group */}
                  <div className="flex rounded-md shadow-sm">
                    <button
                      onClick={() => handleUnitChange('K')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-l-md border ${
                        lastUnit === 'K'
                          ? 'bg-gray-100 text-gray-900 border-gray-300'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      K
                    </button>
                    <button
                      onClick={() => handleUnitChange('M')}
                      className={`px-3 py-1.5 text-xs font-medium border-t border-b ${
                        lastUnit === 'M'
                          ? 'bg-gray-100 text-gray-900 border-gray-300'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      M
                    </button>
                    <button
                      onClick={() => handleUnitChange('B')}
                      className={`px-3 py-1.5 text-xs font-medium border-t border-b border-r rounded-r-md ${
                        lastUnit === 'B'
                          ? 'bg-gray-100 text-gray-900 border-gray-300'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      B
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 bg-white border-b w-72">
                      Name
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 bg-gray-50 border-b w-20">
                      17
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-red-500 bg-gray-50 border-b w-20">
                      2018
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-red-500 bg-gray-50 border-b w-20">
                      2019
                    </th>
                    {getDisplayYears().map(year => (
                      <th
                        key={year}
                        className={`px-4 py-2 text-right text-xs font-medium w-24 border-b ${
                          forecastYears.includes(year)
                            ? 'text-[#D97706] bg-[#FEF3C7]'
                            : 'text-gray-900 bg-white'
                        }`}
                      >
                        {year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((metric, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50"
                    >
                      <td className={`px-4 py-2 text-xs border-b ${metric.isBold ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {metric.name}
                      </td>
                      <td className="px-4 py-2 text-right text-xs text-gray-400 bg-gray-50 border-b">—</td>
                      <td className="px-4 py-2 text-right text-xs text-gray-400 bg-gray-50 border-b">—</td>
                      <td className="px-4 py-2 text-right text-xs text-gray-400 bg-gray-50 border-b">—</td>
                      {getDisplayYears().map(year => (
                        <td
                          key={year}
                          className={`px-4 py-2 text-right text-xs border-b ${
                            forecastYears.includes(year) 
                              ? 'bg-[#FEF3C7] text-[#D97706]' 
                              : 'text-gray-600'
                          } ${metric.isBold ? 'font-medium' : ''}`}
                        >
                          {formatValue(metric.values[year])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Empty Right Column */}
        <div className="col-span-3"></div>
      </div>
    </StockLayout>
  );
} 