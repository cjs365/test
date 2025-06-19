'use client';

import React from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, FileText, School, Lightbulb, Calculator } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeProvider';

export default function AcademyPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const academyCategories = [
    {
      title: 'Investment Fundamentals',
      description: 'Learn the basic concepts and principles of investing',
      icon: <BookOpen className={`h-8 w-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />,
      items: [
        { title: 'Introduction to Investing', path: '/academy/fundamentals/intro' },
        { title: 'Understanding Risk and Return', path: '/academy/fundamentals/risk-return' },
        { title: 'Asset Classes Overview', path: '/academy/fundamentals/asset-classes' },
        { title: 'Portfolio Construction Basics', path: '/academy/fundamentals/portfolio-construction' },
      ]
    },
    {
      title: 'Financial Analysis',
      description: 'Techniques for analyzing financial statements and company performance',
      icon: <Calculator className={`h-8 w-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />,
      items: [
        { title: 'Reading Financial Statements', path: '/academy/financial-analysis/statements' },
        { title: 'Key Financial Ratios', path: '/academy/financial-analysis/ratios' },
        { title: 'Cash Flow Analysis', path: '/academy/financial-analysis/cash-flow' },
        { title: 'Company Valuation Methods', path: '/academy/financial-analysis/valuation' },
      ]
    },
    {
      title: 'Investment Methodologies',
      description: 'Comprehensive overview of our analytical approaches and frameworks',
      icon: <School className={`h-8 w-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />,
      items: [
        { title: 'Factor Investing Explained', path: '/academy/methodology/factors' },
        { title: 'Quantitative Analysis', path: '/academy/methodology/quantitative' },
        { title: 'Fundamental Analysis', path: '/academy/methodology/fundamental' },
        { title: 'Technical Analysis', path: '/academy/methodology/technical' },
      ]
    },
    {
      title: 'Financial Terms',
      description: 'Glossary of financial terms and concepts',
      icon: <FileText className={`h-8 w-8 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />,
      items: [
        { title: 'Investment Terminology', path: '/academy/financial-terms' },
        { title: 'Market Indicators', path: '/academy/financial-terms/indicators' },
        { title: 'Economic Concepts', path: '/academy/financial-terms/economic' },
        { title: 'Technical Terms', path: '/academy/financial-terms/technical' },
      ]
    },
  ];

  const featuredArticles = [
    {
      title: 'Understanding Factor Investing',
      description: 'Learn how factor investing can enhance your portfolio returns and reduce risk',
      category: 'Investment Strategy',
      timeToRead: '8 min read',
      path: '/academy/methodology',
    },
    {
      title: 'Fundamental vs. Technical Analysis',
      description: 'Compare two major approaches to stock analysis and when to use each',
      category: 'Analysis Techniques',
      timeToRead: '10 min read',
      path: '/academy/methodology/comparison',
    },
    {
      title: 'Portfolio Risk Management',
      description: 'Essential strategies to manage and mitigate risk in your investment portfolio',
      category: 'Risk Management',
      timeToRead: '12 min read',
      path: '/academy/risk-management',
    },
  ];

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Investment Academy
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Educational resources to enhance your investing knowledge and skills
          </p>
        </div>

        {/* Featured Content */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Featured Articles
            </h2>
            <Link href="/academy/all-articles">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <Link key={index} href={article.path} className="block">
                <Card className={`h-full ${isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  <CardContent className="p-6">
                    <div className={`inline-block px-2 py-1 mb-3 text-xs font-medium rounded-full ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {article.category}
                    </div>
                    <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {article.title}
                    </h3>
                    <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {article.description}
                    </p>
                    <div className={`flex items-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {article.timeToRead}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Academy Categories */}
        <div>
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Learning Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {academyCategories.map((category, index) => (
              <Card key={index} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-lg mr-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className={isDark ? 'text-white' : ''}>{category.title}</CardTitle>
                      <CardDescription className={isDark ? 'text-gray-400' : ''}>
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link 
                          href={item.path} 
                          className={`flex items-center hover:underline ${
                            isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-right">
                    <Link 
                      href={`/academy/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className={`text-sm flex items-center justify-end ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      View all in this category
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}