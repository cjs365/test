'use client';

import React, { useState } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/app/context/ThemeProvider';

// Mock financial terms data
const financialTerms = [
  {
    id: 'alpha',
    term: 'Alpha',
    definition: 'A measure of the active return on an investment compared to a market index or benchmark that represents the market\'s movement as a whole.',
    category: 'Investment Performance',
    related: ['Beta', 'Risk-Adjusted Return']
  },
  {
    id: 'beta',
    term: 'Beta',
    definition: 'A measure of the volatility, or systematic risk, of a security or portfolio compared to the market as a whole.',
    category: 'Risk Metrics',
    related: ['Alpha', 'Volatility', 'CAPM']
  },
  {
    id: 'capm',
    term: 'Capital Asset Pricing Model (CAPM)',
    definition: 'A model that describes the relationship between systematic risk and expected return for assets, particularly stocks.',
    category: 'Valuation Models',
    related: ['Beta', 'Risk-Free Rate', 'Market Risk Premium']
  },
  {
    id: 'dividend-yield',
    term: 'Dividend Yield',
    definition: 'A financial ratio that shows how much a company pays out in dividends each year relative to its stock price.',
    category: 'Fundamental Analysis',
    related: ['Dividend', 'Dividend Payout Ratio']
  },
  {
    id: 'ebitda',
    term: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of a company\'s overall financial performance.',
    category: 'Financial Statements',
    related: ['Operating Income', 'Cash Flow']
  },
  {
    id: 'factor-investing',
    term: 'Factor Investing',
    definition: 'An investment strategy in which securities are chosen based on attributes that are associated with higher returns.',
    category: 'Investment Strategy',
    related: ['Smart Beta', 'Value Factor', 'Momentum Factor']
  },
  {
    id: 'growth-investing',
    term: 'Growth Investing',
    definition: 'An investment strategy that focuses on stocks of companies expected to grow at an above-average rate compared to other companies.',
    category: 'Investment Strategy',
    related: ['Value Investing', 'Price-to-Earnings Ratio', 'Revenue Growth']
  },
  {
    id: 'hedge',
    term: 'Hedge',
    definition: 'An investment position intended to offset potential losses or gains that may be incurred by a companion investment.',
    category: 'Risk Management',
    related: ['Risk Management', 'Derivatives', 'Options']
  },
  {
    id: 'inflation',
    term: 'Inflation',
    definition: 'A general increase in prices and fall in the purchasing value of money.',
    category: 'Economics',
    related: ['CPI', 'Monetary Policy', 'Interest Rates']
  },
  {
    id: 'liquidity',
    term: 'Liquidity',
    definition: 'The degree to which an asset or security can be quickly bought or sold in the market without affecting the asset\'s price.',
    category: 'Market Characteristics',
    related: ['Bid-Ask Spread', 'Trading Volume']
  },
  {
    id: 'market-cap',
    term: 'Market Capitalization',
    definition: 'The total market value of a company\'s outstanding shares of stock.',
    category: 'Company Metrics',
    related: ['Large Cap', 'Small Cap', 'Mid Cap']
  },
  {
    id: 'pe-ratio',
    term: 'Price-to-Earnings Ratio (P/E)',
    definition: 'A valuation ratio of a company\'s current share price compared to its per-share earnings.',
    category: 'Valuation Metrics',
    related: ['EPS', 'PEG Ratio', 'Valuation']
  },
  {
    id: 'value-investing',
    term: 'Value Investing',
    definition: 'An investment strategy that involves picking stocks that appear to be trading for less than their intrinsic or book value.',
    category: 'Investment Strategy',
    related: ['Growth Investing', 'Value Factor', 'Intrinsic Value']
  },
  {
    id: 'volatility',
    term: 'Volatility',
    definition: 'A statistical measure of the dispersion of returns for a given security or market index.',
    category: 'Risk Metrics',
    related: ['Standard Deviation', 'Beta', 'VIX']
  },
  {
    id: 'yield-curve',
    term: 'Yield Curve',
    definition: 'A line that plots yields (interest rates) of bonds having equal credit quality but differing maturity dates.',
    category: 'Fixed Income',
    related: ['Treasury Bonds', 'Interest Rates', 'Inverted Yield Curve']
  },
];

// Categories for filtering
const categories = [
  'All Categories',
  'Investment Strategy',
  'Risk Metrics',
  'Valuation Metrics',
  'Financial Statements',
  'Economics',
  'Company Metrics',
  'Market Characteristics',
  'Fixed Income',
  'Investment Performance',
  'Fundamental Analysis',
  'Risk Management',
  'Valuation Models',
];

export default function FinancialTermsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Filter terms based on search and category
  const filteredTerms = financialTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/academy" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} hover:underline flex items-center`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Academy
            </Link>
          </div>
          
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Financial Terms Glossary
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            A comprehensive guide to financial and investment terminology
          </p>
        </div>

        {/* Search and Filter */}
        <Card className={`mb-8 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search financial terms..."
                    className={`pl-9 ${isDark ? 'bg-gray-700 border-gray-600' : ''}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select
                  className={`w-full h-10 rounded-md border px-3 py-2 text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms List */}
        <div className="space-y-6">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term) => (
              <Card key={term.id} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {term.term}
                        </h2>
                        <span className={`ml-3 text-xs px-2 py-1 rounded-full ${
                          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {term.category}
                        </span>
                      </div>
                      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {term.definition}
                      </p>
                      
                      {term.related && term.related.length > 0 && (
                        <div>
                          <h3 className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Related Terms:
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {term.related.map((relatedTerm) => (
                              <span 
                                key={relatedTerm}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {relatedTerm}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {term.id === 'factor-investing' && (
                      <div className="mt-2 md:mt-0">
                        <Link href="/academy/methodology">
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Learn More
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="p-6 text-center">
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  No terms found matching your search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 