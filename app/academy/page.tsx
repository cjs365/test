'use client';

import React from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, School, Lightbulb, Calculator, TrendingUp, Clock, BarChart2, BookMarked } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeProvider';

export default function AcademyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const featuredArticles = [
    {
      title: 'Understanding Factor Investing',
      description: 'Learn how factor investing can enhance your portfolio returns and reduce risk',
      category: 'Investment Strategy',
      timeToRead: '8 min read',
      path: '/academy/methodology',
      icon: <TrendingUp className="h-4 w-4" />,
      date: 'May 15, 2023'
    },
    {
      title: 'Fundamental vs. Technical Analysis',
      description: 'Compare two major approaches to stock analysis and when to use each',
      category: 'Analysis Techniques',
      timeToRead: '10 min read',
      path: '/academy/methodology/comparison',
      icon: <BarChart2 className="h-4 w-4" />,
      date: 'June 2, 2023'
    },
    {
      title: 'Portfolio Risk Management',
      description: 'Essential strategies to manage and mitigate risk in your investment portfolio',
      category: 'Risk Management',
      timeToRead: '12 min read',
      path: '/academy/risk-management',
      icon: <BookMarked className="h-4 w-4" />,
      date: 'July 10, 2023'
    },
  ];

  const latestArticles = [
    {
      title: 'EBITDA vs. Free Cash Flow',
      category: 'Financial Analysis',
      path: '/academy/financial-analysis/ebitda-vs-fcf',
      date: 'Aug 28, 2023',
    },
    {
      title: 'Growth at a Reasonable Price (GARP)',
      category: 'Investment Strategy',
      path: '/academy/methodology/garp',
      date: 'Aug 15, 2023',
    },
    {
      title: 'Discounted Cash Flow Analysis',
      category: 'Valuation',
      path: '/academy/financial-analysis/dcf',
      date: 'July 30, 2023',
    },
    {
      title: 'Understanding Bond Yield Spreads',
      category: 'Fixed Income',
      path: '/academy/financial-analysis/bond-yields',
      date: 'July 22, 2023',
    },
    {
      title: 'Smart Beta ETFs Explained',
      category: 'ETF Strategies',
      path: '/academy/methodology/smart-beta',
      date: 'July 15, 2023',
    },
  ];

  const popularTopics = [
    'Factor Investing',
    'Discounted Cash Flow',
    'EBITDA',
    'P/E Ratio',
    'Beta',
    'Portfolio Optimization',
    'Market Efficiency',
    'Value Investing',
    'Growth Investing',
    'Volatility',
    'Sharpe Ratio',
    'Inflation',
  ];

  const academyCurriculum = [
    {
      title: 'Investment Fundamentals',
      description: 'Essential concepts for new investors',
      icon: <BookOpen className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />,
      topics: ['Introduction to Investing', 'Risk & Return', 'Asset Classes', 'Portfolio Diversification'],
      path: '/academy/fundamentals'
    },
    {
      title: 'Financial Analysis',
      description: 'Analyze company performance & statements',
      icon: <Calculator className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />,
      topics: ['Financial Statements', 'Ratios', 'Cash Flow Analysis', 'Valuation Methods'],
      path: '/academy/financial-analysis'
    },
    {
      title: 'Investment Methodologies',
      description: 'Advanced analytical frameworks',
      icon: <School className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />,
      topics: ['Factor Investing', 'Quantitative Analysis', 'Fundamental Analysis', 'Technical Analysis'],
      path: '/academy/methodology'
    },
    {
      title: 'Financial Terms',
      description: 'Glossary of essential terminology',
      icon: <FileText className={`h-6 w-6 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />,
      topics: ['Investment Terms', 'Market Indicators', 'Economic Concepts', 'Financial Ratios'],
      path: '/academy/financial-terms'
    },
  ];

  return (
    <MainLayout>
      <div className="py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${isDark ? 'from-gray-800 to-gray-900' : 'from-blue-50 to-indigo-50'} p-6 rounded-lg mb-6 shadow-sm`}>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Investment Academy
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl`}>
            Expert resources to enhance your investment knowledge and decision-making. Explore our curated content from fundamental concepts to advanced methodologies.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant={isDark ? "outline" : "secondary"} asChild>
              <Link href="/academy/methodology">
                <School className="h-4 w-4 mr-1" />
                Investment Methodologies
              </Link>
              </Button>
            <Button size="sm" variant={isDark ? "outline" : "secondary"} asChild>
              <Link href="/academy/financial-terms">
                <FileText className="h-4 w-4 mr-1" />
                Financial Terms
            </Link>
            </Button>
          </div>
          </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content - Left 8 columns */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Featured Content */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className={isDark ? 'text-white' : ''}>Featured Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredArticles.map((article, index) => (
              <Link key={index} href={article.path} className="block">
                      <Card className={`h-full border ${isDark ? 'bg-gray-900 border-gray-700 hover:bg-gray-800' : 'hover:bg-gray-50 border-gray-200'} transition-colors`}>
                        <CardContent className="p-4">
                          <div className={`inline-flex items-center px-2 py-1 mb-3 text-xs font-medium rounded-full ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                            {article.icon}
                            <span className="ml-1">{article.category}</span>
                    </div>
                          <h3 className={`text-base font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {article.title}
                    </h3>
                          <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {article.description}
                    </p>
                          <div className={`flex justify-between items-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                      {article.timeToRead}
                            </span>
                            <span>{article.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/academy/all-articles">
                      View All Articles
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
        </div>
              </CardContent>
            </Card>

            {/* Learning Curriculum */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader className="pb-2">
                <CardTitle className={isDark ? 'text-white' : ''}>Learning Curriculum</CardTitle>
                <CardDescription className={isDark ? 'text-gray-400' : ''}>
                  Structured educational paths to build your investment knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {academyCurriculum.map((category, index) => (
                    <Card key={index} className={`border ${isDark ? 'bg-gray-900 border-gray-700' : 'border-gray-200'}`}>
                      <CardHeader className="p-4 pb-0 flex flex-row items-center space-y-0">
                        <div className={`p-2 rounded-lg mr-3 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      {category.icon}
                    </div>
                    <div>
                          <CardTitle className={`text-base ${isDark ? 'text-white' : ''}`}>{category.title}</CardTitle>
                          <CardDescription className={`text-xs ${isDark ? 'text-gray-400' : ''}`}>
                        {category.description}
                      </CardDescription>
                    </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <div className="grid grid-cols-2 gap-1">
                          {category.topics.map((topic, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className={`w-1 h-1 rounded-full mr-1.5 ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`}></div>
                              <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{topic}</span>
                            </div>
                          ))}
                  </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Link 
                          href={category.path} 
                          className={`text-xs flex items-center ${
                            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                          }`}
                        >
                          Explore path
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right 4 columns */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Recent & Popular */}
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-white' : ''}`}>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map((topic, index) => (
                    <Link key={index} href={`/academy/search?q=${encodeURIComponent(topic)}`} className="no-underline">
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isDark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}>
                        {topic}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <Card className={`${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? 'text-white' : ''}`}>Start Here</CardTitle>
                <CardDescription className={isDark ? 'text-gray-400' : ''}>
                  Essential foundations for investing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/academy/fundamentals/intro">
                  <div className={`p-3 rounded-md border ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center">
                      <div className={`p-2 mr-3 rounded-md ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Introduction to Investing</h3>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Core concepts for beginners</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/academy/financial-terms">
                  <div className={`p-3 rounded-md border ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center">
                      <div className={`p-2 mr-3 rounded-md ${isDark ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Financial Terms Glossary</h3>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Key terminology reference</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/academy/methodology">
                  <div className={`p-3 rounded-md border ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                    <div className="flex items-center">
                      <div className={`p-2 mr-3 rounded-md ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        <School className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Investment Methodologies</h3>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Analysis frameworks</p>
                      </div>
                    </div>
                  </div>
                </Link>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}