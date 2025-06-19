'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit2, Trash2, Plus, FileEdit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import UploadPortfolioDialog from './UploadPortfolioDialog';
import EditHoldingsForm from './EditHoldingsForm';

// Sample holdings data structure
interface Holding {
  id: string;
  symbol: string;
  name: string;
  weight: number;
  sector: string;
}

interface Portfolio {
  id: string;
  name: string;
  holdings: Holding[];
  metrics?: {
    totalReturn?: string;
    volatility?: string;
    sharpe?: string;
    beta?: string;
  };
}

interface PortfolioManagementDialogProps {
  portfolios: Array<{ id: string; name: string }>;
  onAddPortfolio: (portfolioName: string, tickers: any[]) => void;
  onRemovePortfolio: (portfolioId: string) => void;
  onEditPortfolio: (portfolioId: string, newName: string) => void;
  onEditHoldings?: (portfolioId: string, holdings: Holding[]) => void;
}

// Mock function to get portfolio details (in a real app, this would fetch from an API)
const getPortfolioDetails = (portfolioId: string): Portfolio => {
  // This is mock data - in a real app, you would fetch this from your API
  return {
    id: portfolioId,
    name: `Portfolio ${portfolioId}`,
    holdings: [
      { id: '1', symbol: 'AAPL', name: 'Apple Inc.', weight: 15.5, sector: 'Technology' },
      { id: '2', symbol: 'MSFT', name: 'Microsoft Corporation', weight: 12.2, sector: 'Technology' },
      { id: '3', symbol: 'AMZN', name: 'Amazon.com, Inc.', weight: 9.3, sector: 'Consumer Discretionary' },
      { id: '4', symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 8.1, sector: 'Communication Services' },
      { id: '5', symbol: 'META', name: 'Meta Platforms, Inc.', weight: 6.4, sector: 'Communication Services' },
      { id: '6', symbol: 'TSLA', name: 'Tesla, Inc.', weight: 5.8, sector: 'Consumer Discretionary' },
      { id: '7', symbol: 'NVDA', name: 'NVIDIA Corporation', weight: 5.9, sector: 'Technology' },
      { id: '8', symbol: 'BRK-B', name: 'Berkshire Hathaway Inc.', weight: 3.2, sector: 'Financials' },
      { id: '9', symbol: 'JPM', name: 'JPMorgan Chase & Co.', weight: 3.7, sector: 'Financials' },
      { id: '10', symbol: 'JNJ', name: 'Johnson & Johnson', weight: 2.9, sector: 'Healthcare' },
      { id: '11', symbol: 'V', name: 'Visa Inc.', weight: 2.5, sector: 'Financials' },
      { id: '12', symbol: 'PG', name: 'Procter & Gamble Co.', weight: 2.3, sector: 'Consumer Staples' },
      { id: '13', symbol: 'UNH', name: 'UnitedHealth Group Inc.', weight: 2.1, sector: 'Healthcare' },
      { id: '14', symbol: 'HD', name: 'Home Depot Inc.', weight: 2.0, sector: 'Consumer Discretionary' },
      { id: '15', symbol: 'MA', name: 'Mastercard Inc.', weight: 1.9, sector: 'Financials' },
      { id: '16', symbol: 'DIS', name: 'Walt Disney Co.', weight: 1.8, sector: 'Communication Services' },
      { id: '17', symbol: 'BAC', name: 'Bank of America Corp.', weight: 1.7, sector: 'Financials' },
      { id: '18', symbol: 'ADBE', name: 'Adobe Inc.', weight: 1.6, sector: 'Technology' },
      { id: '19', symbol: 'CRM', name: 'Salesforce Inc.', weight: 1.5, sector: 'Technology' },
      { id: '20', symbol: 'NFLX', name: 'Netflix Inc.', weight: 1.4, sector: 'Communication Services' },
      { id: '21', symbol: 'CSCO', name: 'Cisco Systems Inc.', weight: 1.3, sector: 'Technology' },
      { id: '22', symbol: 'PFE', name: 'Pfizer Inc.', weight: 1.2, sector: 'Healthcare' },
      { id: '23', symbol: 'INTC', name: 'Intel Corporation', weight: 1.1, sector: 'Technology' },
      { id: '24', symbol: 'KO', name: 'Coca-Cola Co.', weight: 1.0, sector: 'Consumer Staples' },
      { id: '25', symbol: 'PEP', name: 'PepsiCo Inc.', weight: 0.9, sector: 'Consumer Staples' }
    ],
    metrics: {
      totalReturn: '+12.4%',
      volatility: '15.2%',
      sharpe: '0.82',
      beta: '0.95'
    }
  };
};

export default function PortfolioManagementDialog({
  portfolios,
  onAddPortfolio,
  onRemovePortfolio,
  onEditPortfolio,
  onEditHoldings
}: PortfolioManagementDialogProps) {
  const [open, setOpen] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<{ id: string; name: string } | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [editingHoldings, setEditingHoldings] = useState(false);
  
  // Get top holdings for display in the main list
  const getTopHoldings = (portfolioId: string): string => {
    const portfolio = getPortfolioDetails(portfolioId);
    return portfolio.holdings
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .map(h => h.symbol)
      .join(', ');
  };

  const handleStartEdit = (portfolio: { id: string; name: string }) => {
    setEditingPortfolio(portfolio);
    setEditName(portfolio.name);
  };

  const handleSaveEdit = () => {
    if (editingPortfolio && editName.trim()) {
      onEditPortfolio(editingPortfolio.id, editName.trim());
      setEditingPortfolio(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPortfolio(null);
    setEditName('');
  };
  
  const handleEditHoldings = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setEditingHoldings(true);
  };
  
  const handleSaveHoldings = (holdings: Holding[]) => {
    if (selectedPortfolioId && onEditHoldings) {
      onEditHoldings(selectedPortfolioId, holdings);
    }
    setEditingHoldings(false);
    setSelectedPortfolioId(null);
  };
  
  const handleCancelHoldings = () => {
    setEditingHoldings(false);
    setSelectedPortfolioId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="w-full justify-start text-xs h-7 px-2">
          Browse All Portfolios
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Portfolio Management</DialogTitle>
          <DialogDescription>
            Manage your portfolios - add, remove, or edit portfolios and their holdings.
          </DialogDescription>
        </DialogHeader>
        
        {!editingHoldings ? (
          <div className="space-y-4">
            <div className="flex justify-end">
              <UploadPortfolioDialog onSubmit={(name, tickers) => onAddPortfolio(name, tickers)} />
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Portfolio Name</TableHead>
                    <TableHead>Top Holdings</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolios.map((portfolio) => (
                    <TableRow key={portfolio.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <TableCell>
                        {editingPortfolio?.id === portfolio.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <div>
                            <div className="font-medium">{portfolio.name}</div>
                            <div className="text-xs text-gray-500">
                              {getPortfolioDetails(portfolio.id).holdings.length} holdings
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-mono">
                          {getTopHoldings(portfolio.id)}
                          {getPortfolioDetails(portfolio.id).holdings.length > 3 && 
                            <span className="text-xs text-gray-500 ml-1">
                              + {getPortfolioDetails(portfolio.id).holdings.length - 3} more
                            </span>
                          }
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {editingPortfolio?.id === portfolio.id ? (
                          <div className="flex space-x-2 justify-end">
                            <Button variant="outline" size="sm" onClick={handleSaveEdit}>
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-1 justify-end">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleEditHoldings(portfolio.id)}
                              className="h-8 w-8 p-0"
                            >
                              <FileEdit className="h-4 w-4 text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleStartEdit(portfolio)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => onRemovePortfolio(portfolio.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {portfolios.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-sm text-gray-500">
                        No portfolios found. Add a portfolio to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <EditHoldingsForm
            portfolioId={selectedPortfolioId!}
            initialHoldings={getPortfolioDetails(selectedPortfolioId!).holdings}
            onSave={handleSaveHoldings}
            onCancel={handleCancelHoldings}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}