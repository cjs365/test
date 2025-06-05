'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/app/context/ThemeProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for stock analyses
const stockAnalyses = [
  {
    id: 1,
    title: 'Google Says It Will Appeal Online Search Antitrust Decision',
    summary: 'The decision comes amid ongoing antitrust scrutiny of major tech companies. Google plans to appeal the federal judge\'s decision requiring restructuring of its online search business.',
    category: 'Tech',
    ticker: 'GOOGL',
    imageUrl: '/images/analysis/google.jpg',
    timeAgo: '2 hours ago',
    author: 'Sarah Johnson',
    featured: true
  },
  {
    id: 2,
    title: 'Tesla Faces Production Challenges Amid Supply Chain Disruptions',
    summary: 'Electric vehicle manufacturer struggles with component shortages affecting its production targets for the quarter.',
    category: 'Automotive',
    ticker: 'TSLA',
    imageUrl: '/images/analysis/tesla.jpg',
    timeAgo: '5 hours ago',
    author: 'Michael Chen',
    featured: false
  },
  {
    id: 3,
    title: 'Apple\'s New Product Line Expected to Boost Revenue Growth',
    summary: 'Analysts predict significant revenue increase following the upcoming product announcements scheduled for next month.',
    category: 'Tech',
    ticker: 'AAPL',
    imageUrl: '/images/analysis/apple.jpg',
    timeAgo: '1 day ago',
    author: 'Jessica Williams',
    featured: false
  },
  {
    id: 4,
    title: 'Amazon Expands Cloud Services With New Enterprise Solutions',
    summary: 'The e-commerce giant unveils new cloud offerings targeting enterprise customers, intensifying competition with Microsoft Azure.',
    category: 'Tech',
    ticker: 'AMZN',
    imageUrl: '/images/analysis/amazon.jpg',
    timeAgo: '1 day ago',
    author: 'Robert Garcia',
    featured: false
  }
];

// Mock data for market analyses
const marketAnalyses = [
  {
    id: 5,
    title: 'Fed Signals Potential Rate Cut in September',
    summary: 'The Federal Reserve has indicated it may begin easing monetary policy as inflation shows signs of moderating.',
    category: 'Monetary Policy',
    imageUrl: '/images/analysis/fed.jpg',
    timeAgo: '4 hours ago',
    author: 'Thomas Reynolds',
    featured: true
  },
  {
    id: 6,
    title: 'Oil Prices Stabilize After Recent Volatility',
    summary: 'Crude oil futures found support following weeks of fluctuation amid concerns over global demand and supply constraints.',
    category: 'Commodities',
    imageUrl: '/images/analysis/oil.jpg',
    timeAgo: '8 hours ago',
    author: 'Anna Martinez',
    featured: true
  },
  {
    id: 7,
    title: 'Tech Stocks Rally on Strong Earnings',
    summary: 'Major technology companies reported better-than-expected quarterly results, lifting the sector and broader market indices.',
    category: 'Market Trends',
    imageUrl: '/images/analysis/tech-stocks.jpg',
    timeAgo: '6 hours ago',
    author: 'David Wilson',
    featured: true
  },
  {
    id: 8,
    title: 'European Markets Close Higher on Economic Data',
    summary: 'European indices finished in positive territory after encouraging PMI figures suggested economic resilience despite challenges.',
    category: 'Global Markets',
    imageUrl: '/images/analysis/europe.jpg',
    timeAgo: '10 hours ago',
    author: 'Sophie Laurent',
    featured: true
  }
];

// Mock data for trending articles
const trendingArticles = [
  {
    id: 9,
    title: 'Semiconductor Shortage: When Will It End?',
    category: 'Tech',
    timeAgo: '2 days ago',
    views: 24680
  },
  {
    id: 10,
    title: 'ESG Investing: Trend or Long-term Shift?',
    category: 'Investing',
    timeAgo: '1 day ago',
    views: 18542
  },
  {
    id: 11,
    title: 'Crypto Market Recovers After Regulatory News',
    category: 'Cryptocurrency',
    timeAgo: '12 hours ago',
    views: 15230
  },
  {
    id: 12,
    title: 'Housing Market Cools as Mortgage Rates Rise',
    category: 'Real Estate',
    timeAgo: '5 hours ago',
    views: 12184
  },
  {
    id: 13,
    title: 'Small-Cap Stocks Outperform in Shifting Market',
    category: 'Equities',
    timeAgo: '8 hours ago',
    views: 9856
  }
];

// Mock performance data with benchmark comparison
const mockPerformanceData = {
  chartData: [
    { date: '2019-01', portfolio: 100, benchmark: 100 },
    { date: '2019-04', portfolio: 110, benchmark: 105 },
    { date: '2019-07', portfolio: 115, benchmark: 108 },
    { date: '2019-10', portfolio: 118, benchmark: 110 },
    { date: '2020-01', portfolio: 122, benchmark: 112 },
    { date: '2020-04', portfolio: 95, benchmark: 90 },
    { date: '2020-07', portfolio: 118, benchmark: 105 },
    { date: '2020-10', portfolio: 125, benchmark: 110 },
    { date: '2021-01', portfolio: 135, benchmark: 118 },
    { date: '2021-04', portfolio: 148, benchmark: 125 },
    { date: '2021-07', portfolio: 165, benchmark: 135 },
    { date: '2021-10', portfolio: 178, benchmark: 142 },
    { date: '2022-01', portfolio: 168, benchmark: 138 },
    { date: '2022-04', portfolio: 160, benchmark: 132 },
    { date: '2022-07', portfolio: 172, benchmark: 136 },
    { date: '2022-10', portfolio: 178, benchmark: 140 },
    { date: '2023-01', portfolio: 195, benchmark: 145 },
    { date: '2023-04', portfolio: 215, benchmark: 152 },
    { date: '2023-07', portfolio: 225, benchmark: 160 },
    { date: '2023-10', portfolio: 240, benchmark: 168 },
    { date: '2024-01', portfolio: 255, benchmark: 178 },
    { date: '2024-04', portfolio: 270, benchmark: 185 },
  ],
  monthlyReturns: [
    { month: 'Jan', portfolio: 3.2, benchmark: 2.1 },
    { month: 'Feb', portfolio: 1.8, benchmark: 1.5 },
    { month: 'Mar', portfolio: -0.5, benchmark: -0.2 },
    { month: 'Apr', portfolio: 2.7, benchmark: 2.1 },
    { month: 'May', portfolio: 1.2, benchmark: 0.8 },
    { month: 'Jun', portfolio: -1.1, benchmark: -0.5 },
    { month: 'Jul', portfolio: 4.5, benchmark: 3.2 },
    { month: 'Aug', portfolio: 0.9, benchmark: 0.3 },
    { month: 'Sep', portfolio: -0.7, benchmark: -1.2 },
    { month: 'Oct', portfolio: 2.1, benchmark: 1.5 },
    { month: 'Nov', portfolio: 3.8, benchmark: 2.7 },
    { month: 'Dec', portfolio: 1.5, benchmark: 1.2 },
  ]
};

// Define TypeScript interfaces
interface Article {
  id: number;
  title: string;
  summary?: string;
  category: string;
  ticker?: string;
  imageUrl?: string;
  timeAgo: string;
  author?: string;
  featured?: boolean;
  views?: number;
}

interface ArticleCardProps {
  article: Article;
  isDark: boolean;
  fullWidth?: boolean;
}

interface TrendingArticleProps {
  article: Article;
  index: number;
  isDark: boolean;
}

// Article card component
const ArticleCard = ({ article, isDark, fullWidth = false }: ArticleCardProps) => {
  const widthClass = fullWidth ? 'col-span-2' : 'col-span-1';
  
  return (
    <Card className={`overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : ''} ${fullWidth ? 'md:flex' : ''}`}>
      <div className={`${fullWidth ? 'md:w-1/3' : 'w-full'} relative overflow-hidden h-48`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-700 flex items-center justify-center text-white">
          {/* Placeholder for when images aren't available */}
          <span className="text-xl font-bold">{article.category}</span>
        </div>
      </div>
      <div className={`p-4 ${fullWidth ? 'md:w-2/3' : 'w-full'}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="space-x-2">
            {article.category && (
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
            )}
            {article.ticker && (
              <Badge variant="outline" className="text-xs">
                {article.ticker}
              </Badge>
            )}
          </div>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {article.timeAgo}
          </span>
        </div>
        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {article.title}
        </h3>
        {article.summary && (
          <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {article.summary}
          </p>
        )}
        {article.author && (
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            By {article.author}
          </p>
        )}
      </div>
    </Card>
  );
};

// Trending article component
const TrendingArticle = ({ article, index, isDark }: TrendingArticleProps) => {
  return (
    <div className={`flex items-start py-3 ${index !== 0 ? 'border-t' : ''} ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 font-bold text-sm ${index < 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
        {index + 1}
      </div>
      <div className="flex-1">
        <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {article.title}
        </h4>
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">
            {article.category}
          </Badge>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {article.timeAgo}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function AnalysisPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <MainLayout>
      <div className="py-6">
        <div className="container mx-auto px-4">
          <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Analysis & Insights
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Column - Trending Articles */}
            <div className="lg:col-span-1">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Trending Articles
                </h2>
                <div className="space-y-0">
                  {trendingArticles.map((article, index) => (
                    <TrendingArticle 
                      key={article.id} 
                      article={article} 
                      index={index}
                      isDark={isDark}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="featured" className="mb-6">
                <TabsList>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="stocks">Stock Analysis</TabsTrigger>
                  <TabsTrigger value="market">Market Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="featured" className="mt-4">
                  <div className="space-y-4">
                    <section>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Key Story
                        </h2>
                      </div>
                      <ArticleCard 
                        article={stockAnalyses.find(a => a.featured) || stockAnalyses[0]} 
                        isDark={isDark}
                        fullWidth={true}
                      />
                    </section>
                    
                    <section>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Featured Analysis
                        </h2>
                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
                          View All
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {marketAnalyses.filter(a => a.featured).slice(0, 4).map(article => (
                          <ArticleCard 
                            key={article.id} 
                            article={article}
                            isDark={isDark}
                          />
                        ))}
                      </div>
                    </section>
                  </div>
                </TabsContent>
                
                <TabsContent value="stocks" className="mt-4">
                  <div className="space-y-4">
                    <section>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Stock Analysis
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {stockAnalyses.map(article => (
                          <ArticleCard 
                            key={article.id} 
                            article={article}
                            isDark={isDark}
                          />
                        ))}
                      </div>
                    </section>
                  </div>
                </TabsContent>
                
                <TabsContent value="market" className="mt-4">
                  <div className="space-y-4">
                    <section>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Market & Macro Analysis
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {marketAnalyses.map(article => (
                          <ArticleCard 
                            key={article.id} 
                            article={article}
                            isDark={isDark}
                          />
                        ))}
                      </div>
                    </section>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 