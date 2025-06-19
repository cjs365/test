/**
 * Mock data for portfolios
 */

// Portfolio categories and risk levels
export const portfolioCategories = ['Technology', 'Dividend', 'Sustainable', 'Growth', 'Value'];
export const portfolioRiskLevels = ['Low', 'Moderate', 'High'];

// Model portfolios
export const modelPortfolios = [
  {
    id: '1',
    ticker: 'TECH',
    name: 'Technology Leaders',
    market: 'US',
    description: 'A portfolio of leading technology companies with strong growth potential',
    category: 'Technology',
    riskLevel: 'High',
    performance: {
      ytd: '15.6%',
      oneYear: '21.3%',
      threeYear: '68.5%',
      fiveYear: '112.7%'
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 128 },
      { year: 2021, value: 165 },
      { year: 2022, value: 189 },
      { year: 2023, value: 212 }
    ],
    holdings: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA']
  },
  {
    id: '2',
    ticker: 'DIVG',
    name: 'Dividend Growth',
    market: 'US',
    description: 'Companies with a history of dividend growth and stable earnings',
    category: 'Dividend',
    riskLevel: 'Low',
    performance: {
      ytd: '9.3%',
      oneYear: '14.2%',
      threeYear: '42.1%',
      fiveYear: '76.3%'
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 112 },
      { year: 2021, value: 126 },
      { year: 2022, value: 135 },
      { year: 2023, value: 142 }
    ],
    holdings: ['MSFT', 'JNJ', 'PG', 'JPM', 'HD']
  },
  {
    id: '3',
    ticker: 'SUSTN',
    name: 'Sustainable Investing',
    market: 'US',
    description: 'Companies with strong ESG profiles and sustainable business practices',
    category: 'Sustainable',
    riskLevel: 'Moderate',
    performance: {
      ytd: '10.5%',
      oneYear: '16.8%',
      threeYear: '45.3%',
      fiveYear: '82.1%'
    },
    chartData: [
      { year: 2019, value: 100 },
      { year: 2020, value: 115 },
      { year: 2021, value: 132 },
      { year: 2022, value: 148 },
      { year: 2023, value: 168 }
    ],
    holdings: ['MSFT', 'CSCO', 'NKE', 'ADBE', 'UNH']
  }
];

// Add S&P 500 benchmark
export const sp500Benchmark = {
  id: 'sp500',
  ticker: 'SPY',
  name: 'S&P 500',
  market: 'US',
  description: 'Standard & Poor\'s 500 Index',
  category: 'Benchmark',
  riskLevel: 'Moderate',
  performance: {
    ytd: '12.8%',
    oneYear: '18.5%',
    threeYear: '52.7%',
    fiveYear: '92.3%'
  },
  chartData: [
    { year: 2019, value: 100 },
    { year: 2020, value: 118 },
    { year: 2021, value: 142 },
    { year: 2022, value: 165 },
    { year: 2023, value: 185 }
  ],
  holdings: []
};

// Portfolio holdings
export const portfolioHoldings = {
  'TECH': [
    { symbol: 'AAPL', name: 'Apple Inc.', weight: 12.5, sector: 'Technology', performance: { '1Y': 25.7 } },
    { symbol: 'MSFT', name: 'Microsoft Corporation', weight: 11.8, sector: 'Technology', performance: { '1Y': 28.3 } },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', weight: 9.5, sector: 'Communication Services', performance: { '1Y': 18.9 } },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', weight: 8.7, sector: 'Consumer Discretionary', performance: { '1Y': 22.1 } },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', weight: 7.2, sector: 'Technology', performance: { '1Y': 145.6 } },
    { symbol: 'META', name: 'Meta Platforms Inc.', weight: 6.8, sector: 'Communication Services', performance: { '1Y': 31.2 } },
    { symbol: 'TSLA', name: 'Tesla Inc.', weight: 5.3, sector: 'Consumer Discretionary', performance: { '1Y': -15.3 } },
    { symbol: 'ADBE', name: 'Adobe Inc.', weight: 4.2, sector: 'Technology', performance: { '1Y': 17.8 } },
    { symbol: 'CRM', name: 'Salesforce Inc.', weight: 3.9, sector: 'Technology', performance: { '1Y': 22.5 } },
    { symbol: 'INTC', name: 'Intel Corporation', weight: 3.5, sector: 'Technology', performance: { '1Y': -8.2 } }
  ],
  'DIVG': [
    { symbol: 'MSFT', name: 'Microsoft Corporation', weight: 8.5, sector: 'Technology', performance: { '1Y': 28.3 } },
    { symbol: 'JNJ', name: 'Johnson & Johnson', weight: 7.2, sector: 'Healthcare', performance: { '1Y': 5.3 } },
    { symbol: 'PG', name: 'Procter & Gamble Co.', weight: 6.8, sector: 'Consumer Staples', performance: { '1Y': 9.7 } },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', weight: 6.5, sector: 'Financials', performance: { '1Y': 18.2 } },
    { symbol: 'HD', name: 'Home Depot Inc.', weight: 5.8, sector: 'Consumer Discretionary', performance: { '1Y': 12.5 } },
    { symbol: 'VZ', name: 'Verizon Communications Inc.', weight: 5.2, sector: 'Communication Services', performance: { '1Y': -3.8 } },
    { symbol: 'PFE', name: 'Pfizer Inc.', weight: 4.8, sector: 'Healthcare', performance: { '1Y': -15.7 } },
    { symbol: 'KO', name: 'Coca-Cola Co.', weight: 4.5, sector: 'Consumer Staples', performance: { '1Y': 7.2 } },
    { symbol: 'PEP', name: 'PepsiCo Inc.', weight: 4.3, sector: 'Consumer Staples', performance: { '1Y': 8.5 } },
    { symbol: 'MRK', name: 'Merck & Co. Inc.', weight: 4.1, sector: 'Healthcare', performance: { '1Y': 14.3 } }
  ],
  'SUSTN': [
    { symbol: 'MSFT', name: 'Microsoft Corporation', weight: 7.8, sector: 'Technology', performance: { '1Y': 28.3 } },
    { symbol: 'CSCO', name: 'Cisco Systems Inc.', weight: 6.5, sector: 'Technology', performance: { '1Y': 12.1 } },
    { symbol: 'NKE', name: 'Nike Inc.', weight: 5.9, sector: 'Consumer Discretionary', performance: { '1Y': 7.5 } },
    { symbol: 'ADBE', name: 'Adobe Inc.', weight: 5.2, sector: 'Technology', performance: { '1Y': 17.8 } },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', weight: 4.8, sector: 'Healthcare', performance: { '1Y': 9.2 } },
    { symbol: 'V', name: 'Visa Inc.', weight: 4.5, sector: 'Financials', performance: { '1Y': 15.3 } },
    { symbol: 'CRM', name: 'Salesforce Inc.', weight: 4.3, sector: 'Technology', performance: { '1Y': 22.5 } },
    { symbol: 'COST', name: 'Costco Wholesale Corp.', weight: 4.1, sector: 'Consumer Staples', performance: { '1Y': 19.7 } },
    { symbol: 'ABT', name: 'Abbott Laboratories', weight: 3.8, sector: 'Healthcare', performance: { '1Y': 6.8 } },
    { symbol: 'LIN', name: 'Linde plc', weight: 3.5, sector: 'Materials', performance: { '1Y': 11.2 } }
  ]
};

// Portfolio factor data
export const portfolioFactors = {
  'TECH': {
    factors: [
      { name: 'Growth', score: 85, benchmark: 65 },
      { name: 'Value', score: 42, benchmark: 58 },
      { name: 'Quality', score: 78, benchmark: 62 },
      { name: 'Momentum', score: 72, benchmark: 55 },
      { name: 'Volatility', score: 68, benchmark: 50 }
    ]
  },
  'DIVG': {
    factors: [
      { name: 'Growth', score: 58, benchmark: 65 },
      { name: 'Value', score: 72, benchmark: 58 },
      { name: 'Quality', score: 85, benchmark: 62 },
      { name: 'Momentum', score: 52, benchmark: 55 },
      { name: 'Volatility', score: 35, benchmark: 50 }
    ]
  },
  'SUSTN': {
    factors: [
      { name: 'Growth', score: 65, benchmark: 65 },
      { name: 'Value', score: 62, benchmark: 58 },
      { name: 'Quality', score: 82, benchmark: 62 },
      { name: 'Momentum', score: 58, benchmark: 55 },
      { name: 'Volatility', score: 45, benchmark: 50 }
    ]
  }
};

// Portfolio holdings data with history
export const portfolioHoldingsData = {
  tech: {
    dates: ['2023-12-31', '2023-09-30', '2023-06-30'],
    holdings: {
      '2023-12-31': [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', weight: 12.5, shares: 1250, price: 193.42, marketValue: 241775, change: 'up' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 11.8, shares: 580, price: 376.04, marketValue: 218103.2, change: 'same' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services', weight: 9.5, shares: 950, price: 139.01, marketValue: 132059.5, change: 'up' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', weight: 8.7, shares: 820, price: 153.42, marketValue: 125804.4, change: 'same' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', weight: 7.2, shares: 180, price: 496.42, marketValue: 89355.6, change: 'up' },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', weight: 6.8, shares: 310, price: 353.96, marketValue: 109727.6, change: 'same' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', weight: 5.3, shares: 320, price: 248.48, marketValue: 79513.6, change: 'down' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', weight: 4.2, shares: 120, price: 596.37, marketValue: 71564.4, change: 'same' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', weight: 3.9, shares: 250, price: 251.12, marketValue: 62780, change: 'up' },
        { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', weight: 3.5, shares: 1050, price: 46.66, marketValue: 48993, change: 'down' }
      ],
      '2023-09-30': [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', weight: 11.8, shares: 1150, price: 171.21, marketValue: 196891.5, change: 'same' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 11.5, shares: 580, price: 315.75, marketValue: 183135, change: 'up' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services', weight: 9.2, shares: 900, price: 131.86, marketValue: 118674, change: 'same' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', weight: 8.7, shares: 820, price: 127.12, marketValue: 104238.4, change: 'same' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', weight: 6.5, shares: 150, price: 434.99, marketValue: 65248.5, change: 'up' },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', weight: 6.8, shares: 310, price: 301.32, marketValue: 93409.2, change: 'up' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', weight: 5.8, shares: 350, price: 212.19, marketValue: 74266.5, change: 'same' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', weight: 4.2, shares: 120, price: 509.90, marketValue: 61188, change: 'same' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', weight: 3.7, shares: 230, price: 227.33, marketValue: 52285.9, change: 'same' },
        { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', weight: 3.8, shares: 1100, price: 35.97, marketValue: 39567, change: 'down' }
      ],
      '2023-06-30': [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', weight: 11.8, shares: 1150, price: 193.97, marketValue: 223065.5, change: 'same' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 11.0, shares: 550, price: 340.54, marketValue: 187297, change: 'same' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Communication Services', weight: 9.2, shares: 900, price: 119.70, marketValue: 107730, change: 'up' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', weight: 8.7, shares: 820, price: 130.36, marketValue: 106895.2, change: 'up' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', weight: 5.9, shares: 120, price: 422.01, marketValue: 50641.2, change: 'new' },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Communication Services', weight: 6.5, shares: 290, price: 286.98, marketValue: 83224.2, change: 'up' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', weight: 5.8, shares: 350, price: 261.77, marketValue: 91619.5, change: 'same' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', weight: 4.2, shares: 120, price: 489.13, marketValue: 58695.6, change: 'up' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', weight: 3.7, shares: 230, price: 211.26, marketValue: 48589.8, change: 'same' },
        { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', weight: 4.0, shares: 1200, price: 33.44, marketValue: 40128, change: 'same' }
      ]
    }
  },
  divg: {
    dates: ['2023-12-31', '2023-09-30', '2023-06-30'],
    holdings: {
      '2023-12-31': [
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 8.5, shares: 320, price: 376.04, marketValue: 120332.8, change: 'same' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', weight: 7.2, shares: 580, price: 156.74, marketValue: 90909.2, change: 'same' },
        { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', weight: 6.8, shares: 640, price: 145.15, marketValue: 92896, change: 'up' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', weight: 6.5, shares: 520, price: 169.05, marketValue: 87906, change: 'same' },
        { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', weight: 5.8, shares: 210, price: 346.54, marketValue: 72773.4, change: 'up' },
        { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services', weight: 5.2, shares: 1350, price: 37.70, marketValue: 50895, change: 'same' },
        { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', weight: 4.8, shares: 1850, price: 28.79, marketValue: 53261.5, change: 'down' },
        { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples', weight: 4.5, shares: 950, price: 58.93, marketValue: 55983.5, change: 'up' },
        { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples', weight: 4.3, shares: 320, price: 169.11, marketValue: 54115.2, change: 'same' },
        { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', weight: 4.1, shares: 450, price: 109.02, marketValue: 49059, change: 'same' }
      ],
      '2023-09-30': [
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 8.5, shares: 320, price: 315.75, marketValue: 101040, change: 'same' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', weight: 7.2, shares: 580, price: 155.75, marketValue: 90335, change: 'up' },
        { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', weight: 6.5, shares: 620, price: 145.50, marketValue: 90210, change: 'same' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', weight: 6.5, shares: 520, price: 145.10, marketValue: 75452, change: 'same' },
        { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', weight: 5.5, shares: 200, price: 306.19, marketValue: 61238, change: 'same' },
        { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services', weight: 5.2, shares: 1350, price: 32.41, marketValue: 43753.5, change: 'same' },
        { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', weight: 5.0, shares: 1900, price: 33.10, marketValue: 62890, change: 'same' },
        { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples', weight: 4.3, shares: 900, price: 55.98, marketValue: 50382, change: 'same' },
        { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples', weight: 4.3, shares: 320, price: 169.50, marketValue: 54240, change: 'same' },
        { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', weight: 4.1, shares: 450, price: 102.95, marketValue: 46327.5, change: 'up' }
      ],
      '2023-06-30': [
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 8.5, shares: 320, price: 340.54, marketValue: 108972.8, change: 'up' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', weight: 7.0, shares: 560, price: 165.52, marketValue: 92691.2, change: 'same' },
        { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', weight: 6.5, shares: 620, price: 152.93, marketValue: 94816.6, change: 'same' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials', weight: 6.5, shares: 520, price: 145.44, marketValue: 75628.8, change: 'up' },
        { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary', weight: 5.5, shares: 200, price: 310.28, marketValue: 62056, change: 'same' },
        { symbol: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services', weight: 5.2, shares: 1350, price: 37.19, marketValue: 50206.5, change: 'same' },
        { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', weight: 5.0, shares: 1900, price: 36.68, marketValue: 69692, change: 'down' },
        { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples', weight: 4.3, shares: 900, price: 60.14, marketValue: 54126, change: 'same' },
        { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Staples', weight: 4.3, shares: 320, price: 185.22, marketValue: 59270.4, change: 'same' },
        { symbol: 'MRK', name: 'Merck & Co. Inc.', sector: 'Healthcare', weight: 4.0, shares: 430, price: 115.36, marketValue: 49604.8, change: 'same' }
      ]
    }
  },
  sustn: {
    dates: ['2023-12-31', '2023-09-30', '2023-06-30'],
    holdings: {
      '2023-12-31': [
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 7.8, shares: 290, price: 376.04, marketValue: 109051.6, change: 'same' },
        { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', weight: 6.5, shares: 1850, price: 50.52, marketValue: 93462, change: 'same' },
        { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary', weight: 5.9, shares: 750, price: 108.57, marketValue: 81427.5, change: 'same' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', weight: 5.2, shares: 120, price: 596.37, marketValue: 71564.4, change: 'up' },
        { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', weight: 4.8, shares: 120, price: 526.78, marketValue: 63213.6, change: 'same' },
        { symbol: 'V', name: 'Visa Inc.', sector: 'Financials', weight: 4.5, shares: 250, price: 260.07, marketValue: 65017.5, change: 'up' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', weight: 4.3, shares: 240, price: 251.12, marketValue: 60268.8, change: 'same' },
        { symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Staples', weight: 4.1, shares: 90, price: 658.82, marketValue: 59293.8, change: 'same' },
        { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', weight: 3.8, shares: 480, price: 110.07, marketValue: 52833.6, change: 'up' },
        { symbol: 'LIN', name: 'Linde plc', sector: 'Materials', weight: 3.5, shares: 120, price: 410.71, marketValue: 49285.2, change: 'same' }
      ],
      '2023-09-30': [
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 7.8, shares: 290, price: 315.75, marketValue: 91567.5, change: 'same' },
        { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', weight: 6.5, shares: 1850, price: 53.74, marketValue: 99419, change: 'up' },
        { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary', weight: 5.9, shares: 750, price: 95.62, marketValue: 71715, change: 'same' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', weight: 5.0, shares: 115, price: 509.90, marketValue: 58638.5, change: 'same' },
        { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', weight: 4.8, shares: 120, price: 504.27, marketValue: 60512.4, change: 'same' },
        { symbol: 'V', name: 'Visa Inc.', sector: 'Financials', weight: 4.3, shares: 230, price: 229.27, marketValue: 52732.1, change: 'same' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', weight: 4.3, shares: 240, price: 227.33, marketValue: 54559.2, change: 'same' },
        { symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Staples', weight: 4.1, shares: 90, price: 565.94, marketValue: 50934.6, change: 'up' },
        { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', weight: 3.7, shares: 460, price: 97.11, marketValue: 44670.6, change: 'same' },
        { symbol: 'LIN', name: 'Linde plc', sector: 'Materials', weight: 3.5, shares: 120, price: 373.13, marketValue: 44775.6, change: 'same' }
      ],
      '2023-06-30': [
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', weight: 7.8, shares: 290, price: 340.54, marketValue: 98756.6, change: 'up' },
        { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', weight: 6.3, shares: 1800, price: 51.82, marketValue: 93276, change: 'same' },
        { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Discretionary', weight: 5.9, shares: 750, price: 98.64, marketValue: 73980, change: 'same' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', weight: 5.0, shares: 115, price: 489.13, marketValue: 56249.95, change: 'up' },
        { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', weight: 4.8, shares: 120, price: 475.33, marketValue: 57039.6, change: 'same' },
        { symbol: 'V', name: 'Visa Inc.', sector: 'Financials', weight: 4.3, shares: 230, price: 237.48, marketValue: 54620.4, change: 'same' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', weight: 4.3, shares: 240, price: 211.26, marketValue: 50702.4, change: 'up' },
        { symbol: 'COST', name: 'Costco Wholesale Corp.', sector: 'Consumer Staples', weight: 4.0, shares: 85, price: 538.38, marketValue: 45762.3, change: 'same' },
        { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare', weight: 3.7, shares: 460, price: 108.93, marketValue: 50107.8, change: 'same' },
        { symbol: 'LIN', name: 'Linde plc', sector: 'Materials', weight: 3.5, shares: 120, price: 380.23, marketValue: 45627.6, change: 'same' }
      ]
    }
  }
};

// Portfolio factor data
export const portfolioFactorData = {
  tech: {
    factors: [
      { name: 'Growth', exposure: 1.45, benchmark: 0.65 },
      { name: 'Value', exposure: -0.85, benchmark: 0.58 },
      { name: 'Quality', exposure: 0.95, benchmark: 0.62 },
      { name: 'Momentum', exposure: 1.15, benchmark: 0.55 },
      { name: 'Volatility', exposure: 0.75, benchmark: 0.50 }
    ]
  },
  divg: {
    factors: [
      { name: 'Growth', exposure: 0.25, benchmark: 0.65 },
      { name: 'Value', exposure: 1.25, benchmark: 0.58 },
      { name: 'Quality', exposure: 1.45, benchmark: 0.62 },
      { name: 'Momentum', exposure: -0.15, benchmark: 0.55 },
      { name: 'Volatility', exposure: -0.85, benchmark: 0.50 }
    ]
  },
  sustn: {
    factors: [
      { name: 'Growth', exposure: 0.65, benchmark: 0.65 },
      { name: 'Value', exposure: 0.45, benchmark: 0.58 },
      { name: 'Quality', exposure: 1.35, benchmark: 0.62 },
      { name: 'Momentum', exposure: 0.25, benchmark: 0.55 },
      { name: 'Volatility', exposure: -0.35, benchmark: 0.50 }
    ]
  }
}; 