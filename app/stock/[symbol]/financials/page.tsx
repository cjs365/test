'use client';

import { useState, useRef, useEffect } from 'react';
import StockLayout from '@/app/components/layout/StockLayout';
import { formatNumber } from '@/app/lib/utils';
import Image from 'next/image';
import { 
  FinancialMetric, 
  fetchFinancialData, 
  getFinancialData, 
  getYearsFromData,
  getForecastYearsFromData,
  ReportType
} from '@/app/stock/[symbol]/financials/api';

type StatementType = 'Income Statement' | 'Balance Sheet' | 'Cash Flow';
type Period = 'Annual' | 'TTM';
type Unit = '.0' | '.00' | 'K' | 'M' | 'B';

// Financial report tree structure
interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isExpanded?: boolean;
}

const financialReportTree: TreeNode[] = [
  {
    id: 'overview',
    name: 'Overview',
    isExpanded: false,
  },
  {
    id: 'financial-statements',
    name: 'Financial Statements',
    isExpanded: true,
    children: [
      {
        id: 'income-statement',
        name: 'Income Statement',
      },
      {
        id: 'balance-sheet',
        name: 'Balance Sheet',
      },
      {
        id: 'cash-flow',
        name: 'Cash Flow',
      }
    ]
  },
  {
    id: 'adjusted-roic',
    name: 'Adjusted Return On Invested Capital',
    isExpanded: false,
  },
  {
    id: 'capital-allocation',
    name: 'Capital Allocation',
    isExpanded: false,
  },
  {
    id: 'key-ratios-growth',
    name: 'Key Ratios – Growth',
    isExpanded: false,
  },
  {
    id: 'key-ratios-profitability',
    name: 'Key Ratios – Profitability',
    isExpanded: false,
  },
  {
    id: 'earnings-asset-quality',
    name: 'Earnings & Asset Quality',
    isExpanded: false,
  }
];

// Map statement types to API report types
const statementToReportType = (statement: StatementType): ReportType => {
  switch (statement) {
    case 'Income Statement':
      return 'income';
    case 'Balance Sheet':
      return 'balance';
    case 'Cash Flow':
      return 'cash_flow';
    default:
      return 'income';
  }
};

export default function FinancialsPage({ params }: { params: { symbol: string } }) {
  const [activeStatement, setActiveStatement] = useState<StatementType>('Income Statement');
  const [activePeriod, setActivePeriod] = useState<Period>('Annual');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [showForecast, setShowForecast] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<Unit>('M');
  const [lastUnit, setLastUnit] = useState<'K' | 'M' | 'B'>('M');
  const [decimalPlaces, setDecimalPlaces] = useState<0 | 1 | 2>(1);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>(financialReportTree);
  const [activeNodeId, setActiveNodeId] = useState<string>('income-statement');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [financialData, setFinancialData] = useState<FinancialMetric[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [forecastYears, setForecastYears] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch data when activeStatement changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const reportType = statementToReportType(activeStatement);
        const data = await fetchFinancialData(params.symbol, reportType);
        
        if (data.length > 0) {
          setFinancialData(data);
          const extractedYears = getYearsFromData(data);
          setYears(extractedYears);
          setForecastYears(getForecastYearsFromData(data));
        } else {
          // Fallback to mock data if API returns empty
          const mockData = getFinancialData();
          setFinancialData(mockData);
          setYears(['2020', '2021', '2022', '2023', '2024']);
          setForecastYears(['2023', '2024']);
        }
      } catch (err) {
        console.error('Error fetching financial data:', err);
        setError('Failed to load financial data. Using mock data instead.');
        
        // Use mock data as fallback
        const mockData = getFinancialData();
        setFinancialData(mockData);
        setYears(['2020', '2021', '2022', '2023', '2024']);
        setForecastYears(['2023', '2024']);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [activeStatement, params.symbol]);

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

  // Toggle expanded state of a tree node
  const toggleNodeExpand = (nodeId: string) => {
    setTreeNodes(prevNodes => 
      prevNodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        return node;
      })
    );
  };

  // Set active node and update active statement if needed
  const handleNodeSelect = (nodeId: string) => {
    setActiveNodeId(nodeId);
    
    // Update active statement based on selected node
    if (nodeId === 'income-statement') {
      setActiveStatement('Income Statement');
    } else if (nodeId === 'balance-sheet') {
      setActiveStatement('Balance Sheet');
    } else if (nodeId === 'cash-flow') {
      setActiveStatement('Cash Flow');
    }
  };

  // Render tree node and its children recursively
  const renderTreeNode = (node: TreeNode, level = 0) => {
    const isActive = node.id === activeNodeId;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="mb-1">
        <div 
          className={`flex items-center py-1.5 pl-${level * 4} ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-gray-100 rounded cursor-pointer text-sm`}
        >
          {hasChildren && (
            <button 
              onClick={() => toggleNodeExpand(node.id)}
              className="mr-1 w-4 h-4 flex items-center justify-center"
            >
              {node.isExpanded ? (
                <span className="text-xs">▼</span>
              ) : (
                <span className="text-xs">►</span>
              )}
            </button>
          )}
          
          <span 
            className={`${!hasChildren ? 'ml-5' : ''} truncate`}
            onClick={() => handleNodeSelect(node.id)}
            title={node.name}
          >
            {node.name}
          </span>
        </div>
        
        {node.isExpanded && node.children && (
          <div className="ml-2">
            {node.children.map(childNode => renderTreeNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Get current statement title from active node
  const getCurrentStatementTitle = () => {
    // Find the corresponding node in the tree structure
    let title = 'Financial Statements';
    
    // Check direct matches
    if (activeNodeId === 'overview') return 'Overview';
    if (activeNodeId === 'income-statement') return 'Income Statement';
    if (activeNodeId === 'balance-sheet') return 'Balance Sheet';
    if (activeNodeId === 'cash-flow') return 'Cash Flow';
    if (activeNodeId === 'adjusted-roic') return 'Adjusted Return On Invested Capital';
    if (activeNodeId === 'capital-allocation') return 'Capital Allocation';
    if (activeNodeId === 'key-ratios-growth') return 'Key Ratios – Growth';
    if (activeNodeId === 'key-ratios-profitability') return 'Key Ratios – Profitability';
    if (activeNodeId === 'earnings-asset-quality') return 'Earnings & Asset Quality';
    
    // If it's a parent node (like financial-statements), just use the node name
    const findNodeTitle = (nodes: TreeNode[]): string | null => {
      for (const node of nodes) {
        if (node.id === activeNodeId) {
          return node.name;
        }
        if (node.children) {
          const childTitle = findNodeTitle(node.children);
          if (childTitle) return childTitle;
        }
      }
      return null;
    };
    
    const foundTitle = findNodeTitle(treeNodes);
    if (foundTitle) title = foundTitle;
    
    return title;
  };

  return (
    <StockLayout symbol={params.symbol} companyName="Apple Inc." sector="Technology" country="United States">
      <div className="flex min-h-screen bg-white">
        {/* Sidebar Container with fixed width that collapses */}
        <div 
          className={`${sidebarCollapsed ? 'w-0' : 'w-64'} 
            flex-shrink-0 transition-all duration-300 ease-in-out 
            border-r border-gray-200 relative`}
        >
          {/* Sidebar Content */}
          <div className={`p-4 ${sidebarCollapsed ? 'invisible' : 'visible'} w-64`}>
            <h3 className="font-medium text-gray-900 mb-4">Financial Reports</h3>
            <div className="space-y-1">
              {treeNodes.map(node => renderTreeNode(node))}
            </div>
          </div>
        </div>

        {/* Toggle Button - Always at the same position */}
        <div className="relative">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -left-3 top-6 w-6 h-16 bg-white border border-gray-200 
              rounded-r-md flex items-center justify-center shadow-sm z-10"
          >
            <span className="text-gray-500">
              {sidebarCollapsed ? '►' : '◄'}
            </span>
          </button>
        </div>

        {/* Main Content Area - Flexible width */}
        <div className="flex-grow">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{getCurrentStatementTitle()}</h2>
              <p className="text-xs text-gray-500 mt-1">USD except per share data</p>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            {/* Statement Type Tabs and Controls */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {/* Left Side Controls */}
                <div className="flex items-center space-x-3">
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
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 bg-white border-b w-72">
                      Name
                    </th>
                    {getDisplayYears().map(year => (
                      <th
                        key={year}
                        className={`px-4 py-2 text-right text-xs font-medium w-24 border-b ${
                          forecastYears.includes(year)
                            ? 'text-blue-700 bg-blue-50'
                            : 'text-gray-900 bg-white'
                        } ${
                          year === forecastYears[0] ? 'border-l-2 border-l-blue-700' : ''
                        }`}
                      >
                        {year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                    {financialData.map((metric, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50"
                    >
                      <td className={`px-4 py-2 text-xs border-b ${metric.isBold ? 'font-medium text-gray-900 border-b-2 border-gray-300' : 'text-gray-600'}`}>
                        {metric.name}
                      </td>
                      {getDisplayYears().map(year => (
                        <td
                          key={year}
                          className={`px-4 py-2 text-right text-xs border-b ${
                            forecastYears.includes(year) 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-600'
                          } ${
                            year === forecastYears[0] ? 'border-l-2 border-l-blue-700' : ''
                          } ${metric.isBold ? 'font-medium border-b-2 border-gray-300' : ''}`}
                        >
                          {metric.values && metric.values[year] !== undefined 
                            ? (metric.values[year] === 0 ? '—' : formatValue(metric.values[year]))
                            : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>
      </div>
    </StockLayout>
  );
} 