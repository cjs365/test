import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface StockLayoutProps {
  children: React.ReactNode;
  symbol: string;
  companyName: string;
  price: number;
  change: number;
  changePercent: number;
}

export function StockLayout({
  children,
  symbol,
  companyName,
  price,
  change,
  changePercent,
}: StockLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--light-gray)]">
      {/* Navigation Bar */}
      <nav className="bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold">ClarVal</Link>
              <div className="hidden md:flex space-x-4">
                <a href="#" className="hover:text-gray-300">Markets</a>
                <a href="#" className="hover:text-gray-300">Economics</a>
                <a href="#" className="hover:text-gray-300">Industries</a>
                <a href="#" className="hover:text-gray-300">Tech</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="search"
                placeholder="Search stocks..."
                className="px-4 py-1 rounded bg-gray-800 text-white border border-gray-700"
              />
              <Button variant="outline" className="text-white border-white hover:bg-gray-800">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Market Summary Bar */}
      <div className="bg-white border-b border-[var(--border-color)] py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 overflow-x-auto text-sm">
            <div>
              <span className="text-gray-600">S&P 500</span>
              <span className="ml-2">4,783.45</span>
              <span className="ml-2 text-[var(--positive-color)]">+0.32%</span>
            </div>
            <div>
              <span className="text-gray-600">Nasdaq</span>
              <span className="ml-2">15,123.45</span>
              <span className="ml-2 text-[var(--positive-color)]">+0.45%</span>
            </div>
            <div>
              <span className="text-gray-600">Dow Jones</span>
              <span className="ml-2">35,456.78</span>
              <span className="ml-2 text-[var(--negative-color)]">-0.12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Header */}
      <div className="bg-white border-b border-[var(--border-color)] shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold">{symbol}</h1>
                <span className="text-[var(--dark-gray)] text-lg">{companyName}</span>
              </div>
              <div className="mt-2 flex items-center space-x-4">
                <span className="stock-price">${price.toFixed(2)}</span>
                <span className={`stock-change ${change >= 0 ? 'positive' : 'negative'}`}>
                  {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-[var(--button-color)] text-[var(--button-color)] hover:bg-[var(--light-gray)]">
                Add to Watchlist
              </Button>
              <Button className="bg-[var(--button-color)] hover:bg-[var(--accent-color)]">
                Trade
              </Button>
            </div>
          </div>

          {/* Stock Navigation */}
          <div className="mt-8 border-b border-[var(--border-color)]">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b">
                <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-[var(--button-color)]">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="financials" className="data-[state=active]:border-b-2 data-[state=active]:border-[var(--button-color)]">
                  Financials
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:border-b-2 data-[state=active]:border-[var(--button-color)]">
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:border-b-2 data-[state=active]:border-[var(--button-color)]">
                  News
                </TabsTrigger>
                <TabsTrigger value="peers" className="data-[state=active]:border-b-2 data-[state=active]:border-[var(--button-color)]">
                  Peers
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
} 