'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ColumnType } from '@/app/types/screener';
import { useTheme } from '@/app/context/ThemeProvider';
import { X, GripVertical, Plus, Check, Search } from 'lucide-react';
import { getColumnCategories, searchColumns } from '@/mock-data/screener/screenerData';

// All available metrics that can be added as columns
const availableColumns: ColumnType[] = [
  'Symbol',
  'Name',
  'Dividend Yield',
  'P/E Ratio',
  'Market Cap',
  'Beta',
  'Price',
  'Volume',
  'EPS Growth',
  'Revenue Growth',
];

// Column categories for organization
const columnCategories = [
  {
    category: 'Basic Info',
    columns: ['Symbol', 'Name'] as ColumnType[]
  },
  {
    category: 'Valuation',
    columns: ['P/E Ratio', 'Dividend Yield', 'Market Cap'] as ColumnType[]
  },
  {
    category: 'Performance',
    columns: ['Beta', 'Price', 'Volume'] as ColumnType[]
  },
  {
    category: 'Growth',
    columns: ['EPS Growth', 'Revenue Growth'] as ColumnType[]
  }
];

type EditViewProps = {
  onClose: () => void;
  onSave: (name: string, columns: ColumnType[]) => void;
  onDelete?: () => void;
  initialName?: string;
  initialColumns?: ColumnType[];
  isNew?: boolean;
};

export default function EditView({
  onClose,
  onSave,
  onDelete,
  initialName = 'New View',
  initialColumns = ['Symbol', 'Name', 'Dividend Yield', 'P/E Ratio', 'Market Cap', 'Beta'],
  isNew = true,
}: EditViewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [viewName, setViewName] = useState(initialName);
  const [selectedColumns, setSelectedColumns] = useState<ColumnType[]>(initialColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Basic Info');
  const [selectedColumn, setSelectedColumn] = useState<ColumnType | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [columnCategories, setColumnCategories] = useState<{ category: string, columns: ColumnType[] }[]>([]);
  const [availableColumns, setAvailableColumns] = useState<ColumnType[]>([]);
  const [searchResults, setSearchResults] = useState<ColumnType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch column categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categories = await getColumnCategories();
        setColumnCategories(categories);
        
        // Extract all available columns
        const allColumns = Array.from(
          new Set(
            categories.flatMap(category => category.columns)
          )
        );
        setAvailableColumns(allColumns);
        
        if (categories.length > 0) {
          setSelectedCategory(categories[0].category);
        }
      } catch (error) {
        console.error('Error fetching column categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim().length === 0) {
        setSearchResults([]);
        return;
      }
      
      try {
        const results = await searchColumns(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching columns:', error);
        setSearchResults([]);
      }
    };
    
    const debounceTimer = setTimeout(handleSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Filter available columns that are not already selected
  const getAvailableColumns = () => {
    return availableColumns.filter(column => !selectedColumns.includes(column));
  };

  // Get columns to display in the middle column
  const getDisplayColumns = () => {
    if (searchTerm.trim().length > 0) {
      return searchResults.filter(column => !selectedColumns.includes(column));
    }
    
    return columnCategories
      .find(c => c.category === selectedCategory)
      ?.columns.filter(column => !selectedColumns.includes(column)) || [];
  };

  // Add a column to the selected list
  const handleAddColumn = (column: ColumnType) => {
    setSelectedColumns([...selectedColumns, column]);
  };

  // Remove a column from the selected list
  const handleRemoveColumn = (index: number) => {
    const newColumns = [...selectedColumns];
    newColumns.splice(index, 1);
    setSelectedColumns(newColumns);
  };

  // Handle saving the view
  const handleSave = () => {
    // Ensure Symbol and Name are always included
    let columnsToSave = [...selectedColumns];
    if (!columnsToSave.includes('Symbol')) {
      columnsToSave = ['Symbol', ...columnsToSave];
    }
    if (!columnsToSave.includes('Name')) {
      columnsToSave = ['Symbol', 'Name', ...columnsToSave.filter(c => c !== 'Symbol')];
    }
    
    onSave(viewName, columnsToSave);
    onClose();
  };

  // Handle category click
  const handleCategoryClick = (category: string | 'search-results') => {
    setSelectedCategory(category);
    setSelectedColumn(null);
  };

  // Handle column click
  const handleColumnClick = (column: ColumnType) => {
    setSelectedColumn(column);
  };

  // Handle select column
  const handleSelectColumn = () => {
    if (selectedColumn && !selectedColumns.includes(selectedColumn)) {
      setSelectedColumns([...selectedColumns, selectedColumn]);
      setSelectedColumn(null);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;
    
    const updatedColumns = [...selectedColumns];
    const draggedColumn = updatedColumns[draggingIndex];
    
    // Remove the dragged item
    updatedColumns.splice(draggingIndex, 1);
    // Insert it at the new position
    updatedColumns.splice(index, 0, draggedColumn);
    
    setSelectedColumns(updatedColumns);
    setDraggingIndex(index);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isDark ? 'bg-black/50' : 'bg-gray-600/30'}`}>
      <div className={`w-4/5 max-w-5xl h-4/5 rounded-lg shadow-lg flex flex-col ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Selected Columns Section - Simplified Horizontal Layout */}
        {selectedColumns.length > 0 && (
          <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Selected Columns
              </h3>
              <div className="flex items-center px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                <label className={`text-sm font-medium mr-2 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                  View Name:
                </label>
                <Input
                  type="text"
                  value={viewName}
                  onChange={(e) => setViewName(e.target.value)}
                  placeholder="Enter view name..."
                  className={`w-48 h-7 text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500' : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
                <button
                  onClick={onDelete || onClose}
                  className={`ml-2 p-1 rounded-full ${isDark ? 'hover:bg-blue-800 text-blue-300' : 'hover:bg-blue-100 text-blue-700'}`}
                  title="Delete view"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedColumns.map((column, index) => (
                <div
                  key={column}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs ${
                    isDark 
                      ? 'bg-gray-800 text-gray-200 border border-gray-700' 
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  } ${draggingIndex === index ? (isDark ? 'border-blue-500' : 'border-blue-500') : ''}`}
                >
                  <span>{column}</span>
                  {column !== 'Symbol' && column !== 'Name' && (
                    <button
                      onClick={() => handleRemoveColumn(index)}
                      className={`ml-1 p-0.5 rounded-full ${
                        isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Browse Columns
          </h3>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <Input
              type="text"
              placeholder="Search columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}
            />
            <button 
              onClick={onClose}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <X className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
        
        {/* Content - Three Column Layout */}
        <div className="flex flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
            </div>
          ) : (
            <div className="flex-1 flex">
              {/* Categories Column */}
              <div className={`w-1/3 p-4 overflow-y-auto border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Categories
                </h3>
                <div className="space-y-1">
                  {/* Search Results Category */}
                  {searchTerm.trim().length > 0 && (
                    <div
                      onClick={() => handleCategoryClick('search-results')}
                      className={`p-2 rounded cursor-pointer text-xs ${
                        isDark ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-100 border border-blue-300'
                      }`}
                    >
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        Search Results
                      </span>
                      <span className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({searchResults.filter(col => !selectedColumns.includes(col)).length})
                      </span>
                    </div>
                  )}
                  
                  {/* Regular Categories */}
                  {columnCategories.map((cat) => (
                    <div
                      key={cat.category}
                      onClick={() => handleCategoryClick(cat.category)}
                      className={`p-2 rounded cursor-pointer text-xs ${
                        selectedCategory === cat.category && searchTerm.trim().length === 0
                          ? isDark ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-100 border border-blue-300'
                          : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {cat.category}
                      </span>
                      <span className={`ml-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        ({cat.columns.filter(col => !selectedColumns.includes(col)).length})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Columns Column */}
              <div className={`w-1/3 p-4 overflow-y-auto border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {searchTerm.trim().length > 0 ? 'Search Results' : 'Available Columns'}
                </h3>
                {getDisplayColumns().length === 0 ? (
                  <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {searchTerm.trim().length > 0 
                      ? `No columns found matching "${searchTerm}"` 
                      : 'All columns in this category have been added'}
                  </p>
                ) : (
                  <div className="space-y-1">
                    {getDisplayColumns().map((column) => (
                      <div
                        key={column}
                        onClick={() => handleColumnClick(column)}
                        className={`p-2 rounded cursor-pointer text-xs ${
                          selectedColumn === column
                            ? isDark ? 'bg-blue-900/50 border border-blue-700' : 'bg-blue-100 border border-blue-300'
                            : isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        }`}
                      >
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>
                          {column}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Details Column */}
              <div className="w-1/3 p-4 overflow-y-auto">
                <h3 className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Details
                </h3>
                {selectedColumn ? (
                  <div>
                    <h4 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {selectedColumn}
                    </h4>
                    <div className={`mt-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description for {selectedColumn} column.
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        onClick={handleSelectColumn}
                        disabled={selectedColumns.includes(selectedColumn)}
                        className={`w-full text-xs ${
                          selectedColumns.includes(selectedColumn)
                            ? isDark ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {selectedColumns.includes(selectedColumn) ? 'Already Added' : 'Add Column'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className={`text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select a column to view details
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} flex justify-end`}>
          <Button
            onClick={onClose}
            variant="outline"
            className={`mr-2 ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className={`${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={!viewName.trim()}
          >
            Save View
          </Button>
        </div>
      </div>
    </div>
  );
} 