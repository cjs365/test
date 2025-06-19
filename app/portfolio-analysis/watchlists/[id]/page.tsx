'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Edit, Download, Share2, ChevronLeft
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeProvider';
import Link from 'next/link';
import { portfolioAnalysisService } from '@/api/v1/portfolio-analysis/service';
import OverviewTab from './components/OverviewTab';
import AttributionTab from './components/AttributionTab';
import FactorsTab from './components/FactorsTab';
import RiskTab from './components/RiskTab';
import HoldingsTab from './components/HoldingsTab';

// Define the type for parameters
type Params = {
  id: string;
};

export default function WatchlistDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const params = useParams<Params>();
  const watchlistId = params?.id || '';
  
  const [watchlist, setWatchlist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch watchlist details
  useEffect(() => {
    const fetchWatchlistDetails = async () => {
      try {
        setLoading(true);
        const data = await portfolioAnalysisService.getWatchlistById(watchlistId);
        setWatchlist(data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching watchlist details:', err);
        setError(err.message || 'Failed to load watchlist details');
        setLoading(false);
      }
    };

    if (watchlistId) {
      fetchWatchlistDetails();
    }
  }, [watchlistId]);

  // Format performance values
  const formatPerformance = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="py-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className={`h-10 w-10 animate-spin mx-auto mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Loading watchlist details...
            </h3>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="py-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className={`p-4 mb-4 rounded-lg ${isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-50 text-red-800'}`}>
              {error}
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!watchlist) {
    return (
      <MainLayout>
        <div className="py-6 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className={`p-4 mb-4 rounded-lg ${isDark ? 'bg-yellow-900/30 text-yellow-200' : 'bg-yellow-50 text-yellow-800'}`}>
              Watchlist not found
            </div>
            <Link href="/portfolio-analysis/watchlists">
              <Button className="mt-4">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Watchlists
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-6">
        {/* Header section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/portfolio-analysis/watchlists" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:underline flex items-center`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Watchlists
                </Link>
              </div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {watchlist.name}
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {watchlist.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className={isDark ? 'border-gray-700' : ''}>
                  {watchlist.stocks.length} stocks
                </Badge>
                <Badge variant="outline" className={isDark ? 'border-gray-700' : ''}>
                  Created {new Date(watchlist.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/portfolio-analysis/watchlists/${watchlistId}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit size={14} className="mr-1" />
                  Edit
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Download size={14} className="mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 size={14} className="mr-1" />
                Share
              </Button>
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1 Month Return</p>
                  <h3 className={`text-2xl font-bold mt-1 ${
                    parseFloat(watchlist.performance['1M']) >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {formatPerformance(watchlist.performance['1M'])}
                  </h3>
                </div>
                <div className={`p-2 rounded-full ${
                  parseFloat(watchlist.performance['1M']) >= 0 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {parseFloat(watchlist.performance['1M']) >= 0 ? 
                    <ArrowUpRight size={18} /> : 
                    <ArrowDownRight size={18} />
                  }
                </div>
              </div>
              <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                vs. S&P 500: {formatPerformance(watchlist.benchmarkDiff?.['1M'] || 0)}
              </div>
            </Card>
            
            <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>YTD Return</p>
                  <h3 className={`text-2xl font-bold mt-1 ${
                    parseFloat(watchlist.performance['YTD']) >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {formatPerformance(watchlist.performance['YTD'])}
                  </h3>
                </div>
                <div className={`p-2 rounded-full ${
                  parseFloat(watchlist.performance['YTD']) >= 0 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {parseFloat(watchlist.performance['YTD']) >= 0 ? 
                    <ArrowUpRight size={18} /> : 
                    <ArrowDownRight size={18} />
                  }
                </div>
              </div>
              <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                vs. S&P 500: {formatPerformance(watchlist.benchmarkDiff?.['YTD'] || 0)}
              </div>
            </Card>
            
            <Card className={`p-4 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>1 Year Return</p>
                  <h3 className={`text-2xl font-bold mt-1 ${
                    parseFloat(watchlist.performance['1Y']) >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {formatPerformance(watchlist.performance['1Y'])}
                  </h3>
                </div>
                <div className={`p-2 rounded-full ${
                  parseFloat(watchlist.performance['1Y']) >= 0 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {parseFloat(watchlist.performance['1Y']) >= 0 ? 
                    <ArrowUpRight size={18} /> : 
                    <ArrowDownRight size={18} />
                  }
                </div>
              </div>
              <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                vs. S&P 500: {formatPerformance(watchlist.benchmarkDiff?.['1Y'] || 0)}
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs for different analysis views */}
        <Tabs 
          defaultValue="overview" 
          className="w-full" 
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attribution">Attribution</TabsTrigger>
            <TabsTrigger value="factors">Factor Analysis</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab watchlist={watchlist} isDark={isDark} />
          </TabsContent>
          
          <TabsContent value="attribution">
            <AttributionTab watchlistId={watchlistId} isDark={isDark} />
          </TabsContent>
          
          <TabsContent value="factors">
            <FactorsTab watchlistId={watchlistId} isDark={isDark} />
          </TabsContent>
          
          <TabsContent value="risk">
            <RiskTab watchlistId={watchlistId} isDark={isDark} />
          </TabsContent>
          
          <TabsContent value="holdings">
            <HoldingsTab watchlist={watchlist} isDark={isDark} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
} 