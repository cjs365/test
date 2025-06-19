'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save, X, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Holding {
  id: string;
  symbol: string;
  name: string;
  weight: number;
  sector: string;
}

interface EditHoldingsFormProps {
  portfolioId: string;
  initialHoldings: Holding[];
  onSave: (holdings: Holding[]) => void;
  onCancel: () => void;
}

// Mock sectors for the select dropdown
const SECTORS = [
  "Technology",
  "Healthcare",
  "Financials",
  "Consumer Discretionary",
  "Communication Services",
  "Industrials",
  "Consumer Staples",
  "Energy",
  "Utilities",
  "Real Estate",
  "Materials"
];

export default function EditHoldingsForm({ portfolioId, initialHoldings, onSave, onCancel }: EditHoldingsFormProps) {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSymbolDialogOpen, setIsSymbolDialogOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [isBalancingWeights, setIsBalancingWeights] = useState(false);
  const [tableHeight, setTableHeight] = useState('400px');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Track if weights have been modified
  const [weightsModified, setWeightsModified] = useState(false);
  
  useEffect(() => {
    // When holdings change, check if they sum to 100%
    const totalWeight = holdings.reduce((sum, holding) => sum + holding.weight, 0);
    setWeightsModified(Math.abs(totalWeight - 100) > 0.01);
  }, [holdings]);
  
  // Adjust table height based on available space
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const footerHeight = 80; // Approximate height for footer buttons and padding
        const paginationHeight = 50; // Approximate height for pagination controls
        const headerHeight = 80; // Approximate height for header and validation message
        
        // Calculate available height
        const availableHeight = windowHeight - containerTop - footerHeight - paginationHeight - headerHeight;
        
        // Set minimum height to 200px
        const height = Math.max(200, availableHeight);
        setTableHeight(`${height}px`);
      }
    };
    
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);
  
  // Calculate pagination values
  const totalPages = Math.max(1, Math.ceil(holdings.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, holdings.length);
  const currentHoldings = holdings.slice(startIndex, endIndex);
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of the middle section
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };
  
  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };
  
  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10);
    setItemsPerPage(newPageSize);
    // Reset to first page when changing page size
    setCurrentPage(1);
  };

  const calculateTotalWeight = () => {
    return holdings.reduce((sum, holding) => sum + holding.weight, 0);
  };
  
  const handleAddHolding = () => {
    if (newSymbol.trim() === '') return;
    
    // In a real app, we would fetch company data from an API
    const newHolding: Holding = {
      id: Date.now().toString(),
      symbol: newSymbol.toUpperCase(),
      name: `${newSymbol.toUpperCase()} Inc.`, // Mock name
      weight: 0,
      sector: SECTORS[0] // Default to first sector
    };
    
    setHoldings([...holdings, newHolding]);
    setNewSymbol('');
    setIsSymbolDialogOpen(false);
  };
  
  const handleRemoveHolding = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
  };
  
  const handleWeightChange = (id: string, weight: string) => {
    const numWeight = parseFloat(weight);
    if (isNaN(numWeight)) return;
    
    setHoldings(holdings.map(h => 
      h.id === id ? { ...h, weight: numWeight } : h
    ));
    
    // Clear validation error if it exists
    if (validationErrors[id]) {
      const newErrors = { ...validationErrors };
      delete newErrors[id];
      setValidationErrors(newErrors);
    }
  };
  
  const handleSectorChange = (id: string, sector: string) => {
    setHoldings(holdings.map(h => 
      h.id === id ? { ...h, sector } : h
    ));
  };
  
  const balanceWeights = () => {
    setIsBalancingWeights(true);
    
    // Simple rebalancing to 100%
    const totalWeight = calculateTotalWeight();
    if (totalWeight === 0) {
      // If all weights are 0, distribute evenly
      const equalWeight = 100 / holdings.length;
      setHoldings(holdings.map(h => ({ ...h, weight: parseFloat(equalWeight.toFixed(2)) })));
    } else {
      // Scale all weights proportionally to sum to 100%
      const scaleFactor = 100 / totalWeight;
      setHoldings(holdings.map(h => ({ 
        ...h, 
        weight: parseFloat((h.weight * scaleFactor).toFixed(2))
      })));
    }
    
    setIsBalancingWeights(false);
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const totalWeight = calculateTotalWeight();
    
    if (Math.abs(totalWeight - 100) > 0.01) {
      errors["total"] = `Total weight must be 100% (currently ${totalWeight.toFixed(2)}%)`;
    }
    
    holdings.forEach(holding => {
      if (holding.weight < 0) {
        errors[holding.id] = "Weight cannot be negative";
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSaveClick = () => {
    if (validateForm()) {
      onSave(holdings);
    }
  };
  
  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">Edit Holdings</h3>
        <div className="flex items-center gap-2">
          {weightsModified && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={balanceWeights}
                    disabled={isBalancingWeights}
                    className="h-7 text-xs"
                  >
                    Balance to 100%
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adjust weights to sum to 100%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <Dialog open={isSymbolDialogOpen} onOpenChange={setIsSymbolDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 text-xs">
                <Plus className="h-3 w-3 mr-1" /> Add Holding
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Holding</DialogTitle>
                <DialogDescription>
                  Enter the stock symbol to add to this portfolio.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Input 
                    value={newSymbol} 
                    onChange={(e) => setNewSymbol(e.target.value)}
                    placeholder="e.g. AAPL, MSFT" 
                    className="uppercase"
                  />
                  <Button onClick={handleAddHolding}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {validationErrors["total"] && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-2 py-1 rounded-md text-xs flex items-center">
          <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
          {validationErrors["total"]}
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <ScrollArea style={{ height: tableHeight }} className="w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
              <TableRow className="h-8">
                <TableHead className="w-[100px] py-1 text-xs">Symbol</TableHead>
                <TableHead className="py-1 text-xs">Name</TableHead>
                <TableHead className="w-[90px] text-right py-1 text-xs">Weight (%)</TableHead>
                <TableHead className="w-[40px] py-1"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentHoldings.length > 0 ? (
                currentHoldings.map((holding) => (
                  <TableRow key={holding.id} className="h-8">
                    <TableCell className="font-medium py-1 text-xs">{holding.symbol}</TableCell>
                    <TableCell className="py-1 text-xs">{holding.name}</TableCell>
                    <TableCell className="text-right py-1">
                      <Input
                        type="number"
                        value={holding.weight}
                        onChange={(e) => handleWeightChange(holding.id, e.target.value)}
                        className={`h-6 text-right w-16 float-right text-xs ${validationErrors[holding.id] ? 'border-red-500' : ''}`}
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className="py-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHolding(holding.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-16 text-center text-gray-500 text-xs">
                    This portfolio has no holdings. Click "Add Holding" to add stocks.
                  </TableCell>
                </TableRow>
              )}
              
              {holdings.length > 0 && (
                <TableRow className="bg-gray-50 dark:bg-gray-900/50 h-8">
                  <TableCell colSpan={2} className="font-medium text-right py-1 text-xs">
                    Total:
                  </TableCell>
                  <TableCell className="text-right font-bold py-1 text-xs">
                    {calculateTotalWeight().toFixed(2)}%
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      
      {/* Minimal pagination controls */}
      {holdings.length > 0 && (
        <div className="flex justify-center items-center border-t pt-2">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-l-md"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1 text-xs text-gray-500"
                >
                  …
                </span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 rounded-none text-xs"
                  onClick={() => goToPage(page as number)}
                >
                  {page}
                </Button>
              )
            ))}
            
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0 rounded-r-md"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
            
            <div className="ml-2">
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-7 w-10 text-xs border-gray-200">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-2">
        <Button variant="outline" onClick={onCancel} className="h-7 text-xs">
          <X className="h-3 w-3 mr-1" /> Cancel
        </Button>
        <Button onClick={handleSaveClick} className="h-7 text-xs">
          <Save className="h-3 w-3 mr-1" /> Save Changes
        </Button>
      </div>
    </div>
  );
} 