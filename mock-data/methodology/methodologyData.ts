// Type definitions
export interface Article {
  id: string | number;
  title: string;
  excerpt?: string;
  content?: string;
  group_name?: string;
}

export interface ArticleSection {
  id: string;
  category: string;
  title: string;
  articles: Article[];
}

// Mock data for methodology articles
export const methodologyArticles: ArticleSection[] = [
  {
    id: 'fundamental-analysis',
    category: 'Analysis Frameworks',
    title: 'Fundamental Analysis',
    articles: [
      {
        id: 'financial-statement-analysis',
        title: 'Financial Statement Analysis',
        excerpt: 'How to analyze income statements, balance sheets, and cash flow statements',
      },
      {
        id: 'valuation-metrics',
        title: 'Valuation Metrics',
        excerpt: 'Understanding P/E, P/B, EV/EBITDA, and other key valuation metrics',
      },
      {
        id: 'discounted-cash-flow',
        title: 'Discounted Cash Flow (DCF)',
        excerpt: 'Step-by-step guide to building DCF models for equity valuation',
      },
      {
        id: 'financial-ratios',
        title: 'Financial Ratios',
        excerpt: 'Key ratios for assessing profitability, liquidity, and solvency',
      }
    ]
  },
  {
    id: 'technical-analysis',
    category: 'Analysis Frameworks',
    title: 'Technical Analysis',
    articles: [
      {
        id: 'chart-patterns',
        title: 'Chart Patterns',
        excerpt: 'Identifying and interpreting common chart patterns',
      },
      {
        id: 'technical-indicators',
        title: 'Technical Indicators',
        excerpt: 'Using RSI, MACD, Bollinger Bands, and other technical indicators',
      },
      {
        id: 'support-resistance',
        title: 'Support and Resistance',
        excerpt: 'Identifying key price levels and their significance',
      },
      {
        id: 'trend-analysis',
        title: 'Trend Analysis',
        excerpt: 'Methods for identifying and confirming market trends',
      }
    ]
  },
  {
    id: 'portfolio-management',
    category: 'Portfolio Strategies',
    title: 'Portfolio Management',
    articles: [
      {
        id: 'asset-allocation',
        title: 'Asset Allocation',
        excerpt: 'Strategic approaches to distributing investments across asset classes',
      },
      {
        id: 'risk-management',
        title: 'Risk Management',
        excerpt: 'Techniques for measuring and managing portfolio risk',
      },
      {
        id: 'portfolio-rebalancing',
        title: 'Portfolio Rebalancing',
        excerpt: 'When and how to rebalance your investment portfolio',
      },
      {
        id: 'performance-measurement',
        title: 'Performance Measurement',
        excerpt: 'Methods for evaluating portfolio performance against benchmarks',
      }
    ]
  },
  {
    id: 'investment-strategies',
    category: 'Portfolio Strategies',
    title: 'Investment Strategies',
    articles: [
      {
        id: 'value-investing',
        title: 'Value Investing',
        excerpt: 'Principles and methods of value-based investment approaches',
      },
      {
        id: 'growth-investing',
        title: 'Growth Investing',
        excerpt: 'Identifying and investing in high-growth companies',
      },
      {
        id: 'dividend-investing',
        title: 'Dividend Investing',
        excerpt: 'Building income-focused portfolios with dividend-paying stocks',
      },
      {
        id: 'factor-investing',
        title: 'Factor Investing',
        excerpt: 'Using factors like size, value, momentum, and quality in portfolio construction',
      }
    ]
  },
  {
    id: 'market-analysis',
    category: 'Market Research',
    title: 'Market Analysis',
    articles: [
      {
        id: 'economic-indicators',
        title: 'Economic Indicators',
        excerpt: 'Understanding GDP, inflation, employment, and other key indicators',
      },
      {
        id: 'sector-analysis',
        title: 'Sector Analysis',
        excerpt: 'Evaluating industry sectors and their investment potential',
      },
      {
        id: 'market-cycles',
        title: 'Market Cycles',
        excerpt: 'Identifying and navigating different phases of market cycles',
      },
      {
        id: 'sentiment-analysis',
        title: 'Sentiment Analysis',
        excerpt: 'Using market sentiment indicators to inform investment decisions',
      }
    ]
  },
  {
    id: 'risk-analysis',
    category: 'Market Research',
    title: 'Risk Analysis',
    articles: [
      {
        id: 'volatility-measures',
        title: 'Volatility Measures',
        excerpt: 'Understanding standard deviation, beta, and other volatility metrics',
      },
      {
        id: 'correlation-analysis',
        title: 'Correlation Analysis',
        excerpt: 'Analyzing relationships between assets for diversification',
      },
      {
        id: 'stress-testing',
        title: 'Stress Testing',
        excerpt: 'Techniques for testing portfolio resilience under adverse scenarios',
      },
      {
        id: 'risk-adjusted-returns',
        title: 'Risk-Adjusted Returns',
        excerpt: 'Evaluating performance using Sharpe ratio, Sortino ratio, and other metrics',
      }
    ]
  }
];

// Sample article content for demonstration
export const sampleArticleContent = `
## Financial Statement Analysis

Financial statement analysis is a process of reviewing and analyzing a company's financial statements to make better economic decisions. These statements include the income statement, balance sheet, statement of cash flows, and a statement of changes in equity.

### Income Statement Analysis

The income statement shows a company's revenues, expenses, and profits over a period of time. Key components to analyze include:

- **Revenue Growth**: Compare year-over-year and quarter-over-quarter revenue growth
- **Gross Margin**: Calculated as (Revenue - Cost of Goods Sold) / Revenue
- **Operating Margin**: Operating Income / Revenue
- **Net Profit Margin**: Net Income / Revenue
- **Earnings Per Share (EPS)**: Net Income / Outstanding Shares

### Balance Sheet Analysis

The balance sheet provides a snapshot of a company's assets, liabilities, and shareholders' equity at a specific point in time.

#### Assets Analysis
- **Current Assets**: Cash, accounts receivable, inventory
- **Fixed Assets**: Property, plant, equipment
- **Intangible Assets**: Patents, goodwill, trademarks

#### Liabilities Analysis
- **Current Liabilities**: Short-term debt, accounts payable
- **Long-term Liabilities**: Long-term debt, deferred tax liabilities

#### Equity Analysis
- **Retained Earnings**: Accumulated profits
- **Shareholder's Equity**: Assets - Liabilities

### Cash Flow Statement Analysis

The cash flow statement shows how changes in balance sheet accounts and income affect cash and cash equivalents.

- **Operating Cash Flow**: Cash generated from day-to-day business operations
- **Investing Cash Flow**: Cash used for investing in assets and proceeds from the sale of other businesses, equipment, or long-term assets
- **Financing Cash Flow**: Cash from debt, equity financing, and dividends

### Key Financial Ratios

#### Liquidity Ratios
- **Current Ratio**: Current Assets / Current Liabilities
- **Quick Ratio**: (Current Assets - Inventory) / Current Liabilities

#### Profitability Ratios
- **Return on Assets (ROA)**: Net Income / Total Assets
- **Return on Equity (ROE)**: Net Income / Shareholder's Equity

#### Efficiency Ratios
- **Inventory Turnover**: Cost of Goods Sold / Average Inventory
- **Accounts Receivable Turnover**: Net Credit Sales / Average Accounts Receivable

#### Solvency Ratios
- **Debt-to-Equity Ratio**: Total Debt / Shareholders' Equity
- **Interest Coverage Ratio**: EBIT / Interest Expense

### Trend Analysis

Analyzing financial statements over multiple periods helps identify trends and patterns in a company's financial performance. This includes:

- **Horizontal Analysis**: Comparing financial data over several reporting periods
- **Vertical Analysis**: Expressing financial statement items as percentages of a base figure

### Conclusion

Comprehensive financial statement analysis provides insights into a company's operational efficiency, profitability, financial health, and long-term viability. It forms the foundation for fundamental analysis and investment decision-making.
`;

// Mock articles for API
export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Financial Statement Analysis',
    content: `## Financial Statement Analysis

Financial statement analysis is a process of reviewing and analyzing a company's financial statements to make better economic decisions. These statements include the income statement, balance sheet, statement of cash flows, and a statement of changes in equity.

### Income Statement Analysis

The income statement shows a company's revenues, expenses, and profits over a period of time. Key components to analyze include:

- **Revenue Growth**: Compare year-over-year and quarter-over-quarter revenue growth
- **Gross Margin**: Calculated as (Revenue - Cost of Goods Sold) / Revenue
- **Operating Margin**: Operating Income / Revenue
- **Net Profit Margin**: Net Income / Revenue
- **Earnings Per Share (EPS)**: Net Income / Outstanding Shares

### Balance Sheet Analysis

The balance sheet provides a snapshot of a company's assets, liabilities, and shareholders' equity at a specific point in time.

#### Assets Analysis
- **Current Assets**: Cash, accounts receivable, inventory
- **Fixed Assets**: Property, plant, equipment
- **Intangible Assets**: Patents, goodwill, trademarks

#### Liabilities Analysis
- **Current Liabilities**: Short-term debt, accounts payable
- **Long-term Liabilities**: Long-term debt, deferred tax liabilities

#### Equity Analysis
- **Retained Earnings**: Accumulated profits
- **Shareholder's Equity**: Assets - Liabilities`,
    group_name: 'Fundamental Analysis'
  },
  {
    id: 2,
    title: 'Valuation Metrics',
    content: `## Valuation Metrics

Understanding P/E, P/B, EV/EBITDA, and other key valuation metrics.

### Price-to-Earnings (P/E) Ratio

The P/E ratio measures a company's current share price relative to its earnings per share (EPS).

- **Formula**: Market Price per Share / Earnings per Share
- **Interpretation**: A high P/E suggests investors expect higher earnings growth in the future compared to companies with a lower P/E.
- **Limitations**: Can be misleading for companies with no or negative earnings.

### Price-to-Book (P/B) Ratio

The P/B ratio compares a company's market value to its book value.

- **Formula**: Market Price per Share / Book Value per Share
- **Interpretation**: A lower P/B ratio could indicate an undervalued stock.
- **Limitations**: Less relevant for companies with significant intangible assets.`,
    group_name: 'Fundamental Analysis'
  },
  {
    id: 3,
    title: 'Chart Patterns',
    content: `## Chart Patterns

Chart patterns are specific formations on price charts that can help traders predict future price movements.

### Head and Shoulders

A reversal pattern with three peaks, where the middle peak (head) is higher than the two surrounding peaks (shoulders).

- **Recognition**: Look for a left shoulder, head, right shoulder, and neckline.
- **Signal**: When price breaks below the neckline after forming the right shoulder, it signals a bearish reversal.
- **Target**: The distance from the head to the neckline, projected downward from the neckline break.

### Double Top/Bottom

A reversal pattern showing two peaks or troughs at approximately the same price level.

- **Double Top**: Bearish reversal pattern with two peaks.
- **Double Bottom**: Bullish reversal pattern with two troughs.
- **Confirmation**: Occurs when price breaks the support/resistance level between the two peaks/troughs.`,
    group_name: 'Technical Analysis'
  }
]; 