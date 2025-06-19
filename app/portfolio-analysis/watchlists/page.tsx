'use client';

import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, SlidersHorizontal, ArrowRight, ChevronLeft, ArrowUpDown, FileEdit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeProvider';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/app/components/ui/dropdown-menu';

// Mock data for watchlists
const watchlistsData = [
  { 
    id: '1', 
    name: 'Technology Leaders', 
    description: 'Top tech companies with strong growth and market position',
    holdings: 12, 
    created: '2023-09-15', 
    lastUpdated: '2023-10-01', 
    performance: { 
      daily: 0.8,
      weekly: 1.9,
      monthly: 2.8,
      yearly: 15.7
    }
  },
  { 
    id: '2', 
    name: 'Dividend Kings', 
    description: 'Companies with 50+ years of dividend increases',
    holdings: 20, 
    created: '2023-08-20', 
    lastUpdated: '2023-09-25', 
    performance: { 
      daily: 0.2,
      weekly: 0.5,
      monthly: 1.5,
      yearly: 8.3
    }
  },
  { 
    id: '3', 
    name: 'Green Energy', 
    description: 'Companies focused on renewable energy and sustainability',
    holdings: 8, 
    created: '2023-07-10', 
    lastUpdated: '2023-09-18', 
    performance: { 
      daily: -0.3,
      weekly: -1.2,
      monthly: -0.7,
      yearly: 4.2
    }
  },
  { 
    id: '4', 
    name: 'Healthcare Innovation', 
    description: 'Companies driving advancements in healthcare and biotech',
    holdings: 15, 
    created: '2023-06-05', 
    lastUpdated: '2023-09-10', 
    performance: { 
      daily: 0.5,
      weekly: 1.1,
      monthly: 2.2,
      yearly: 9.5
    }
  },
  { 
    id: '5', 
    name: 'Value Stocks', 
    description: 'Undervalued companies with strong fundamentals',
    holdings: 18, 
    created: '2023-05-12', 
    lastUpdated: '2023-09-05', 
    performance: { 
      daily: 0.1,
      weekly: 0.3,
      monthly: 1.1,
      yearly: 6.8
    }
  },
];

export default function WatchlistsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [watchlistToDelete, setWatchlistToDelete] = useState<string | null>(null);
  const [performanceView, setPerformanceView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Filter watchlists based on search term
  const filteredWatchlists = watchlistsData.filter(watchlist => 
    watchlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    watchlist.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort options (not implemented for simplicity)
  const handleSort = (column: string) => {
    // In a real app, would implement sorting here
    console.log('Sorting by', column);
  };

  // Delete watchlist
  const handleDeleteWatchlist = () => {
    // In a real app, would implement deletion here
    console.log('Deleting watchlist', watchlistToDelete);
    setShowDeleteDialog(false);
    setWatchlistToDelete(null);
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              My Watchlists
            </h1>
            <Link href="/portfolio-analysis/create">
              <Button className="mt-2 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
          <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            View and manage your portfolio analysis watchlists
          </p>
        </div>

        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search watchlists..."
                  className={`pl-9 ${isDark ? 'bg-gray-700 border-gray-600' : ''}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Performance:
                </span>
                <div className="flex border rounded-md overflow-hidden">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`rounded-none ${performanceView === 'daily' 
                      ? (isDark ? 'bg-gray-700' : 'bg-gray-100') 
                      : ''}`}
                    onClick={() => setPerformanceView('daily')}
                  >
                    1D
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`rounded-none ${performanceView === 'weekly' 
                      ? (isDark ? 'bg-gray-700' : 'bg-gray-100') 
                      : ''}`}
                    onClick={() => setPerformanceView('weekly')}
                  >
                    1W
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`rounded-none ${performanceView === 'monthly' 
                      ? (isDark ? 'bg-gray-700' : 'bg-gray-100') 
                      : ''}`}
                    onClick={() => setPerformanceView('monthly')}
                  >
                    1M
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`rounded-none ${performanceView === 'yearly' 
                      ? (isDark ? 'bg-gray-700' : 'bg-gray-100') 
                      : ''}`}
                    onClick={() => setPerformanceView('yearly')}
                  >
                    1Y
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={isDark ? 'border-gray-700' : ''}>
                    <TableHead className={isDark ? 'text-gray-300' : ''}>
                      <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                        Watchlist
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className={isDark ? 'text-gray-300' : ''}>Description</TableHead>
                    <TableHead className={`text-center ${isDark ? 'text-gray-300' : ''}`}>
                      <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('holdings')}>
                        Holdings
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className={`text-center ${isDark ? 'text-gray-300' : ''}`}>
                      <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('performance')}>
                        Performance
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className={`text-center ${isDark ? 'text-gray-300' : ''}`}>
                      <div className="flex items-center justify-center cursor-pointer" onClick={() => handleSort('lastUpdated')}>
                        Last Updated
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className={`text-right ${isDark ? 'text-gray-300' : ''}`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWatchlists.length > 0 ? (
                    filteredWatchlists.map((watchlist) => (
                      <TableRow key={watchlist.id} className={isDark ? 'border-gray-700' : ''}>
                        <TableCell className="font-medium">
                          <Link 
                            href={`/portfolio-analysis/watchlists/${watchlist.id}`} 
                            className={`hover:underline ${isDark ? 'text-white' : 'text-gray-900'}`}
                          >
                            {watchlist.name}
                          </Link>
                        </TableCell>
                        <TableCell className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                          {watchlist.description}
                        </TableCell>
                        <TableCell className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {watchlist.holdings}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={watchlist.performance[performanceView] >= 0 ? "success" : "destructive"}>
                            {watchlist.performance[performanceView] > 0 ? '+' : ''}
                            {watchlist.performance[performanceView].toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {watchlist.lastUpdated}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Link href={`/portfolio-analysis/watchlists/${watchlist.id}`}>
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <SlidersHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link href={`/portfolio-analysis/watchlists/${watchlist.id}`}>
                                  <DropdownMenuItem>
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    <span>View Analysis</span>
                                  </DropdownMenuItem>
                                </Link>
                                <Link href={`/portfolio-analysis/watchlists/${watchlist.id}/edit`}>
                                  <DropdownMenuItem>
                                    <FileEdit className="mr-2 h-4 w-4" />
                                    <span>Edit Watchlist</span>
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => {
                                    setWatchlistToDelete(watchlist.id);
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchTerm ? (
                          <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                            No watchlists found matching "{searchTerm}".
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              You don't have any watchlists yet.
                            </div>
                            <Link href="/portfolio-analysis/create">
                              <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Watchlist
                              </Button>
                            </Link>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this watchlist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteWatchlist}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
} 