'use client';

import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/app/components/layout/MainLayout';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Search } from 'lucide-react';
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

// Get all unique first letters for the alphabetical navigation
const alphabet = Array.from(new Set(financialTerms.map(term => term.term.charAt(0).toUpperCase()))).sort();
const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function FinancialTermsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [isNavSticky, setIsNavSticky] = useState(false);
  const navRef = useRef(null);
  const topOffsetRef = useRef(null);

  // Filter terms based on search, category, and selected letter
  const filteredTerms = financialTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || term.category === selectedCategory;
    const matchesLetter = selectedLetter === '' || term.term.charAt(0).toUpperCase() === selectedLetter;
    return matchesSearch && matchesCategory && matchesLetter;
  });

  // Stick the navigation menu to the top when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (topOffsetRef.current && navRef.current) {
        const offsetElement = topOffsetRef.current as HTMLDivElement;
        const navTop = offsetElement.getBoundingClientRect().top;
        setIsNavSticky(navTop <= 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MainLayout>
      <div className="py-6 container mx-auto">
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
        
        {/* Spacer div to calculate when to make nav sticky */}
        <div ref={topOffsetRef} />
        
        {/* Floating Search and Navigation Bar */}
        <div 
          ref={navRef}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} px-6 py-4 mb-8 rounded-lg shadow-md transition-all z-10
            ${isNavSticky ? 'sticky top-0 left-0 right-0 shadow-lg' : ''}`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search financial terms..."
                className={`pl-9 ${isDark ? 'bg-gray-700 border-gray-600' : ''}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/2">
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
          
          {/* A-Z navigation */}
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {allLetters.map(letter => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(selectedLetter === letter ? '' : letter)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
                  ${alphabet.includes(letter)
                    ? (letter === selectedLetter
                      ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                      : (isDark ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'))
                    : (isDark ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                  }`}
                disabled={!alphabet.includes(letter)}
              >
                {letter}
              </button>
            ))}
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter('')}
                className={`ml-2 px-2 py-1 text-xs rounded ${
                  isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Two-column Terms List */}
        {filteredTerms.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
            {filteredTerms.map((term, index) => (
              <div key={term.id} className={`py-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} ${index < filteredTerms.length - 1 ? 'border-b' : ''}`}>
                <div className="mb-1 flex items-center">
                  <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {term.term}
                  </h2>
                  <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {term.category}
                  </span>
                </div>
                <p className={`mb-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {term.definition}
                </p>
                
                {term.related && term.related.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {term.related.map((relatedTerm) => (
                      <span 
                        key={relatedTerm}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {relatedTerm}
                      </span>
                    ))}
                  </div>
                )}
                
                {term.id === 'factor-investing' && (
                  <div className="mt-2">
                    <Link href="/academy/methodology">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      } hover:underline`}>
                        Learn more about factor investing
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>No terms found matching your criteria.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 