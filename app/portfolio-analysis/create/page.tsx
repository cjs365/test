'use client';

import { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ChevronLeft, Plus, X, Search } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePortfolioAnalysisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  
  const [watchlistName, setWatchlistName] = useState('');
  const [watchlistDescription, setWatchlistDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedStocks, setSelectedStocks] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  // Mock search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Mock search results
      const mockResults = [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
      ].filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setSearching(false);
    }, 500);
  };

  const addStock = (stock: any) => {
    if (!selectedStocks.some(s => s.symbol === stock.symbol)) {
      setSelectedStocks([...selectedStocks, { ...stock, weight: 0 }]);
    }
    setSearchResults([]);
    setSearchQuery('');
  };

  const removeStock = (symbol: string) => {
    setSelectedStocks(selectedStocks.filter(stock => stock.symbol !== symbol));
  };

  const updateStockWeight = (symbol: string, weight: number) => {
    setSelectedStocks(
      selectedStocks.map(stock => 
        stock.symbol === symbol ? { ...stock, weight } : stock
      )
    );
  };

  const handleCreateWatchlist = async () => {
    if (watchlistName.trim() === '') {
      alert('Please enter a watchlist name');
      return;
    }
    
    if (selectedStocks.length === 0) {
      alert('Please add at least one stock to your watchlist');
      return;
    }
    
    setCreating(true);
    
    // Normalize weights if they don't sum to 100
    const totalWeight = selectedStocks.reduce((sum, stock) => sum + (parseFloat(stock.weight) || 0), 0);
    let normalizedStocks = selectedStocks;
    
    if (totalWeight !== 100 && totalWeight !== 0) {
      normalizedStocks = selectedStocks.map(stock => ({
        ...stock,
        weight: totalWeight === 0 ? (100 / selectedStocks.length) : (parseFloat(stock.weight) || 0) * (100 / totalWeight)
      }));
    } else if (totalWeight === 0) {
      // Equal weights if all weights are 0
      normalizedStocks = selectedStocks.map(stock => ({
        ...stock,
        weight: 100 / selectedStocks.length
      }));
    }
    
    // Mock API call to create watchlist
    setTimeout(() => {
      setCreating(false);
      router.push('/portfolio-analysis/watchlists');
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/portfolio-analysis" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:underline flex items-center`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Portfolio Analysis
            </Link>
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Create New Analysis
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Build a custom portfolio for analysis by adding stocks and setting weights
          </p>
        </div>

        {/* Watchlist Creation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h2 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Portfolio Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Name
                  </label>
                  <Input
                    placeholder="Enter a name for your portfolio"
                    value={watchlistName}
                    onChange={(e) => setWatchlistName(e.target.value)}
                    className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Description (Optional)
                  </label>
                  <Input
                    placeholder="Add a brief description"
                    value={watchlistDescription}
                    onChange={(e) => setWatchlistDescription(e.target.value)}
                    className={isDark ? 'bg-gray-700 border-gray-600' : ''}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className={`text-base font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Add Stocks
                </h3>
                
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for stocks by name or symbol..."
                      className={`pl-9 ${isDark ? 'bg-gray-700 border-gray-600' : ''}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={searching}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                  </Button>
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className={`mb-4 border rounded-md overflow-hidden ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`p-2 font-medium text-sm ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'}`}>
                      Search Results
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults.map((stock) => (
                        <div 
                          key={stock.symbol} 
                          className={`p-3 flex justify-between items-center border-t ${
                            isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                          } cursor-pointer`}
                          onClick={() => addStock(stock)}
                        >
                          <div>
                            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {stock.symbol} - {stock.name}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {stock.sector}
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Plus size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Selected Stocks */}
                <div className={`border rounded-md ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className={`p-3 font-medium ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-700'} flex justify-between items-center`}>
                    <div>Selected Stocks ({selectedStocks.length})</div>
                    <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedStocks.length > 0 ? 'Set weights (%) or leave empty for equal weighting' : ''}
                    </div>
                  </div>
                  
                  {selectedStocks.length === 0 ? (
                    <div className={`p-6 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No stocks selected. Search and add stocks to your portfolio.
                    </div>
                  ) : (
                    <div>
                      {selectedStocks.map((stock) => (
                        <div 
                          key={stock.symbol} 
                          className={`p-3 flex justify-between items-center border-t ${
                            isDark ? 'border-gray-700' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex-grow">
                            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {stock.symbol} - {stock.name}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {stock.sector}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-20">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={stock.weight || ''}
                                onChange={(e) => updateStockWeight(stock.symbol, parseFloat(e.target.value) || 0)}
                                className={`text-right ${isDark ? 'bg-gray-700 border-gray-600' : ''}`}
                                placeholder="Auto"
                              />
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-300"
                              onClick={() => removeStock(stock.symbol)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Link href="/portfolio-analysis">
                  <Button variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  onClick={handleCreateWatchlist} 
                  disabled={creating || watchlistName.trim() === '' || selectedStocks.length === 0}
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Portfolio'
                  )}
                </Button>
              </div>
            </Card>
          </div>
          
          <div>
            <Card className={`p-5 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <h2 className={`text-lg font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Tips
              </h2>
              
              <div className={`space-y-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Adding Stocks
                  </h3>
                  <p>
                    Search for stocks by name or ticker symbol and click to add them to your portfolio.
                  </p>
                </div>
                
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Setting Weights
                  </h3>
                  <p>
                    You can manually set the weight percentage for each stock, or leave them empty for equal weighting.
                    Weights will be automatically normalized to sum to 100%.
                  </p>
                </div>
                
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Analysis Features
                  </h3>
                  <p>
                    After creating your portfolio, you'll be able to analyze:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Sector allocation and exposure</li>
                    <li>Factor exposures and risk metrics</li>
                    <li>Performance attribution</li>
                    <li>Risk statistics and scenario analysis</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Benchmark Comparison
                  </h3>
                  <p>
                    Your portfolio will be automatically compared against relevant benchmarks like the S&P 500.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 