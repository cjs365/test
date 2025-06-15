'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/app/context/ThemeProvider';
import MainLayout from '@/app/components/layout/MainLayout';

// Mock data for model portfolios - same as in the main portfolio page
const mockModelPortfolios = [
  {
    id: 'tech-growth',
    name: 'Tech Growth Leaders',
    ticker: 'TGRT',
    market: 'US',
    description: 'High-growth technology companies with strong competitive advantages',
    category: 'Technology',
    riskLevel: 'High',
    performance: {
      ytd: '+28.4%',
      oneYear: '+32.7%',
      threeYear: '+21.5%',
      fiveYear: '+19.8%',
    },
    holdings: ['NVDA', 'MSFT', 'GOOGL', 'AMZN', 'META', 'AAPL', 'ADBE', 'CRM', 'TSM', 'AVGO']
  },
  {
    id: 'dividend-income',
    name: 'Dividend Income',
    ticker: 'DINC',
    market: 'US',
    description: 'Stable companies with consistent dividend growth history',
    category: 'Income',
    riskLevel: 'Low',
    performance: {
      ytd: '+8.6%',
      oneYear: '+12.5%',
      threeYear: '+9.8%',
      fiveYear: '+10.5%',
    },
    holdings: ['JNJ', 'PG', 'KO', 'PEP', 'VZ', 'XOM', 'CVX', 'MMM', 'MCD', 'T']
  },
  {
    id: 'balanced-growth',
    name: 'Balanced Growth',
    ticker: 'BLGR',
    market: 'US',
    description: 'Diversified portfolio with moderate growth and income components',
    category: 'Balanced',
    riskLevel: 'Medium',
    performance: {
      ytd: '+14.2%',
      oneYear: '+18.9%',
      threeYear: '+15.2%',
      fiveYear: '+13.4%',
    },
    holdings: ['AAPL', 'BRK.B', 'HD', 'UNH', 'V', 'MSFT', 'JPM', 'JNJ', 'PG', 'MA']
  },
  {
    id: 'healthcare-innovation',
    name: 'Healthcare Innovation',
    ticker: 'HCIN',
    market: 'US',
    description: 'Companies at the forefront of healthcare technology and services',
    category: 'Healthcare',
    riskLevel: 'Medium-High',
    performance: {
      ytd: '+18.7%',
      oneYear: '+22.5%',
      threeYear: '+17.8%',
      fiveYear: '+16.3%',
    },
    holdings: ['UNH', 'LLY', 'ISRG', 'ABBV', 'TMO', 'JNJ', 'AMGN', 'ABT', 'DHR', 'GILD']
  },
  {
    id: 'esg-leaders',
    name: 'ESG Leaders',
    ticker: 'ESGL',
    market: 'US',
    description: 'Companies with strong environmental, social, and governance practices',
    category: 'ESG',
    riskLevel: 'Medium',
    performance: {
      ytd: '+12.8%',
      oneYear: '+16.5%',
      threeYear: '+13.2%',
      fiveYear: '+12.1%',
    },
    holdings: ['MSFT', 'CSCO', 'ADBE', 'CRM', 'NFLX', 'GOOGL', 'INTC', 'NVDA', 'PYPL', 'ADP']
  }
];

type PortfolioLayoutProps = {
  children: React.ReactNode;
};

export default function PortfolioLayout({ children }: PortfolioLayoutProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const params = useParams() || {};
  const ticker = typeof params.ticker === 'string' ? params.ticker : '';
  const pathname = usePathname();
  
  // Find the portfolio by ticker
  const portfolio = mockModelPortfolios.find(p => p.ticker.toLowerCase() === ticker.toLowerCase()) || mockModelPortfolios[0];
  
  // Define navigation items
  const navItems = [
    { name: 'Overview', path: `/portfolio/${ticker.toLowerCase()}` },
    { name: 'Holdings', path: `/portfolio/${ticker.toLowerCase()}/holdings` },
  ];
  
  return (
    <MainLayout>
      <div className="py-6">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {portfolio.name}
                </h1>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  {portfolio.ticker} · {portfolio.market} · {portfolio.holdings.length} positions
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={isDark ? "outline" : "secondary"} className="text-xs">
                  {portfolio.category}
                </Badge>
                <Badge variant={
                  portfolio.riskLevel === 'Low' ? 'success' :
                  portfolio.riskLevel === 'Medium' ? 'warning' :
                  'destructive'
                } className="text-xs">
                  {portfolio.riskLevel} Risk
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="portfolio-nav border-b mb-6">
            {navItems.map((item) => {
              // Check if the current path matches or starts with the nav item path
              const isActive = pathname === item.path || 
                (item.path !== `/portfolio/${ticker.toLowerCase()}` && pathname?.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`portfolio-nav-item ${isActive ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          {children}
        </div>
      </div>
    </MainLayout>
  );
} 