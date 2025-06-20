# API Endpoints Documentation

This document provides details about all API endpoints available in the application.

## Table of Contents

- [API Endpoints Documentation](#api-endpoints-documentation)
  - [Table of Contents](#table-of-contents)
  - [AI Valuation API](#ai-valuation-api)
    - [GET /api/ai-valuation](#get-apiai-valuation)
  - [Screener API](#screener-api)
    - [GET /api/v1/screener/metrics](#get-apiv1screenermetrics)
    - [GET /api/v1/screener/columns](#get-apiv1screenercolumns)
    - [GET /api/v1/screener/screens](#get-apiv1screenerscreens)
    - [POST /api/v1/screener/screens](#post-apiv1screenerscreens)
    - [GET /api/v1/screener/views](#get-apiv1screenerviews)
    - [POST /api/v1/screener/views](#post-apiv1screenerviews)
    - [PUT /api/v1/screener/views/[id]](#put-apiv1screenerviewsid)
    - [POST /api/v1/screener/results](#post-apiv1screenerresults)
  - [Portfolio API](#portfolio-api)
    - [GET /api/v1/portfolios](#get-apiv1portfolios)
    - [GET /api/v1/portfolios/[ticker]](#get-apiv1portfoliosticker)
    - [GET /api/v1/portfolios/[ticker]/holdings](#get-apiv1portfoliostickerholdings)
    - [GET /api/v1/portfolios/[ticker]/performance](#get-apiv1portfoliostickerperformance)
    - [GET /api/v1/portfolios/[ticker]/factors](#get-apiv1portfoliostickerfactors)
  - [Stock Valuation API](#stock-valuation-api)
    - [GET /api/v1/stock-valuation/[symbol]](#get-apiv1stock-valuationsymbol)
    - [POST /api/v1/stock-valuation/[symbol]/calculate](#post-apiv1stock-valuationsymbolcalculate)
  - [Financial Data API](#financial-data-api)
    - [GET /api/v1/stock/financial](#get-apiv1stockfinancial)

## AI Valuation API

### GET /api/ai-valuation

Generates AI-powered valuation analysis and scenario data for a stock.

**Request Parameters:**
| Parameter | Type   | Required | Description             |
|-----------|--------|----------|-------------------------|
| symbol    | string | Yes      | Stock symbol (e.g. AAPL) |

**Response Schema:**
```json
{
  "status": "success",
  "symbol": "AAPL",
  "valuation": "## AAPL Valuation Analysis\n\n### Company Overview\nApple Inc. designs, manufactures, and markets smartphones...",
  "scenario": {
    "revenue_gr": {
      "2023": 8.0,
      "2024": 7.0,
      "2025": 6.0,
      "2026": 5.0,
      "2027": 4.0
    },
    "earnings_margin": {
      "2023": 20.0,
      "2024": 20.5,
      "2025": 21.0,
      "2026": 21.5,
      "2027": 22.0
    },
    "ic_gr": {
      "2023": 5.0,
      "2024": 4.5,
      "2025": 4.0,
      "2026": 3.5,
      "2027": 3.0
    }
  }
}
```

**Error Responses:**
```json
{
  "status": "error",
  "message": "Symbol is required"
}
```

```json
{
  "status": "error",
  "message": "Failed to generate AI valuation"
}
```

## Screener API

### GET /api/v1/screener/metrics

Retrieves available metrics for stock screening.

**Request Parameters:**
| Parameter     | Type    | Required | Description                                |
|---------------|---------|----------|--------------------------------------------|
| category      | string  | No       | Filter metrics by category                 |
| search        | string  | No       | Search term for filtering metrics          |
| groupByCategory | boolean | No     | Group results by category (default: false) |

**Response Schema (without grouping):**
```json
{
  "metrics": [
    {
      "id": "dividend-yield",
      "name": "Dividend Yield",
      "category": "Dividends",
      "description": "Annual dividends per share divided by price per share",
      "unit": "%",
      "formula": "Annual Dividend / Share Price",
      "isHigherBetter": true
    }
  ]
}
```

**Response Schema (with grouping):**
```json
{
  "categories": [
    {
      "category": "Dividends",
      "metrics": [
        {
          "id": "dividend-yield",
          "name": "Dividend Yield",
          "category": "Dividends",
          "description": "Annual dividends per share divided by price per share",
          "unit": "%",
          "formula": "Annual Dividend / Share Price",
          "isHigherBetter": true
        }
      ]
    }
  ]
}
```

### GET /api/v1/screener/columns

Retrieves available columns for the screener results table.

**Request Parameters:**
| Parameter      | Type    | Required | Description                               |
|----------------|---------|----------|-------------------------------------------|
| search         | string  | No       | Search term for filtering columns         |
| groupByCategory | boolean | No      | Group results by category (default: false) |

**Response Schema (without grouping):**
```json
{
  "columns": ["Symbol", "Name", "Dividend Yield", "P/E Ratio", "Market Cap", "Beta"]
}
```

**Response Schema (with grouping):**
```json
{
  "categories": [
    {
      "category": "Basic Info",
      "columns": ["Symbol", "Name"]
    },
    {
      "category": "Valuation",
      "columns": ["P/E Ratio", "Dividend Yield", "Market Cap", "Price"]
    }
  ]
}
```

### GET /api/v1/screener/screens

Retrieves saved screening configurations.

**Response Schema:**
```json
{
  "screens": [
    {
      "id": 1,
      "name": "High Dividend Stocks",
      "description": "US stocks with dividend yield > 4% and P/E < 20",
      "criteria": [
        { "metric": "Dividend Yield", "operator": "greater_than", "value1": 4 },
        { "metric": "P/E Ratio", "operator": "less_than", "value1": 20 }
      ],
      "country": "US",
      "sector": null
    }
  ]
}
```

### POST /api/v1/screener/screens

Saves a new screening configuration.

**Request Payload:**
```json
{
  "name": "Growth Tech Companies",
  "description": "Technology sector with high revenue growth",
  "criteria": [
    { "metric": "Revenue Growth", "operator": "greater_than", "value1": 20 },
    { "metric": "Market Cap", "operator": "greater_than", "value1": 1000 }
  ],
  "country": "US",
  "sector": "technology"
}
```

**Response Schema:**
```json
{
  "success": true,
  "screen": {
    "id": 4,
    "name": "Growth Tech Companies",
    "description": "Technology sector with high revenue growth",
    "criteria": [
      { "metric": "Revenue Growth", "operator": "greater_than", "value1": 20 },
      { "metric": "Market Cap", "operator": "greater_than", "value1": 1000 }
    ],
    "country": "US",
    "sector": "technology"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Name, criteria, and country are required"
}
```

### GET /api/v1/screener/views

Retrieves saved column configurations for the screener results table.

**Response Schema:**
```json
{
  "views": [
    {
      "id": 1,
      "name": "Default View",
      "columns": ["Symbol", "Name", "Dividend Yield", "P/E Ratio", "Market Cap", "Beta"]
    },
    {
      "id": 2,
      "name": "Growth Metrics",
      "columns": ["Symbol", "Name", "Revenue Growth", "EPS Growth", "Price", "Volume"]
    }
  ]
}
```

### POST /api/v1/screener/views

Saves a new column configuration for the screener results table.

**Request Payload:**
```json
{
  "name": "Custom View",
  "columns": ["Symbol", "Name", "Beta", "Volume", "Market Cap"]
}
```

**Response Schema:**
```json
{
  "success": true,
  "view": {
    "id": 4,
    "name": "Custom View",
    "columns": ["Symbol", "Name", "Beta", "Volume", "Market Cap"]
  }
}
```

### PUT /api/v1/screener/views/[id]

Updates an existing column configuration.

**Request Payload:**
```json
{
  "name": "Updated View",
  "columns": ["Symbol", "Name", "P/E Ratio", "EPS Growth", "Revenue Growth"]
}
```

**Response Schema:**
```json
{
  "success": true,
  "view": {
    "id": 2,
    "name": "Updated View",
    "columns": ["Symbol", "Name", "P/E Ratio", "EPS Growth", "Revenue Growth"]
  }
}
```

### POST /api/v1/screener/results

Runs a stock screen with the specified criteria and returns matching stocks.

**Request Payload:**
```json
{
  "criteria": [
    { "metric": "Dividend Yield", "operator": "greater_than", "value1": 4 },
    { "metric": "P/E Ratio", "operator": "less_than", "value1": 20 }
  ],
  "country": "US",
  "sector": null
}
```

**Response Schema:**
```json
{
  "results": [
    {
      "symbol": "TEN",
      "name": "Tsakos Energy Navigation Ltd.",
      "metrics": {
        "Dividend Yield": 10.0,
        "P/E Ratio": 3.7,
        "Market Cap": 543.5,
        "Beta": -0.15
      }
    },
    {
      "symbol": "KREF",
      "name": "KKR Real Estate Finance Trust Inc.",
      "metrics": {
        "Dividend Yield": 9.8,
        "P/E Ratio": 8.2,
        "Market Cap": 789.3,
        "Beta": 0.45
      }
    }
  ]
}
```

## Portfolio API

### GET /api/v1/portfolios

Retrieves a list of available portfolios.

**Request Parameters:**
| Parameter  | Type   | Required | Description                |
|------------|--------|----------|----------------------------|
| category   | string | No       | Filter by portfolio category |
| riskLevel  | string | No       | Filter by risk level       |

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tech-growth",
      "name": "Tech Growth Leaders",
      "ticker": "TGRT",
      "description": "High-growth technology companies with strong competitive advantages",
      "category": "Technology",
      "riskLevel": "High",
      "performance": {
        "ytd": "+28.4%",
        "oneYear": "+32.7%",
        "threeYear": "+21.5%",
        "fiveYear": "+19.8%"
      }
    }
  ]
}
```

### GET /api/v1/portfolios/[ticker]

Retrieves detailed information for a specific portfolio.

**Path Parameters:**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| ticker    | string | Yes      | Portfolio ticker (e.g. TGRT) |

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "id": "tech-growth",
    "name": "Tech Growth Leaders",
    "ticker": "TGRT",
    "market": "US",
    "description": "High-growth technology companies with strong competitive advantages",
    "category": "Technology",
    "riskLevel": "High",
    "performance": {
      "ytd": "+28.4%",
      "oneYear": "+32.7%",
      "threeYear": "+21.5%",
      "fiveYear": "+19.8%"
    },
    "chartData": [
      { "year": 2019, "value": 100 },
      { "year": 2020, "value": 142 },
      { "year": 2021, "value": 198 },
      { "year": 2022, "value": 176 },
      { "year": 2023, "value": 245 },
      { "year": 2024, "value": 324 }
    ],
    "holdings": ["NVDA", "MSFT", "GOOGL", "AMZN", "META", "AAPL", "ADBE", "CRM", "TSM", "AVGO"]
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Portfolio ticker is required"
}
```

```json
{
  "success": false,
  "error": "Portfolio not found"
}
```

### GET /api/v1/portfolios/[ticker]/holdings

Retrieves detailed holdings information for a specific portfolio.

**Path Parameters:**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| ticker    | string | Yes      | Portfolio ticker (e.g. TGRT) |

**Request Parameters:**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| date      | string | No       | Holdings as of date (format: YYYY-MM-DD) |

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "dates": ["2024-06-30", "2024-03-31", "2023-12-31", "2023-09-30", "2023-06-30"],
    "currentDate": "2024-06-30",
    "holdings": [
      {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "sector": "Information Technology",
        "weight": 8.5,
        "shares": 16500,
        "price": 123.45,
        "marketValue": 2036925,
        "change": "new"
      },
      {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "sector": "Information Technology",
        "weight": 7.8,
        "shares": 14200,
        "price": 432.65,
        "marketValue": 1874625,
        "change": "up"
      }
    ]
  }
}
```

### GET /api/v1/portfolios/[ticker]/performance

Retrieves performance data for a specific portfolio.

**Path Parameters:**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| ticker    | string | Yes      | Portfolio ticker (e.g. TGRT) |

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "chartData": [
      { "date": "2019-01", "portfolio": 100, "benchmark": 100 },
      { "date": "2019-04", "portfolio": 110, "benchmark": 105 }
    ],
    "monthlyReturns": [
      { "month": "Jan", "portfolio": 3.2, "benchmark": 2.1 },
      { "month": "Feb", "portfolio": 1.8, "benchmark": 1.5 }
    ],
    "metrics": {
      "alpha": 2.3,
      "beta": 1.15,
      "sharpe": 1.85,
      "volatility": 15.2,
      "maxDrawdown": -14.5,
      "trackingError": 4.8,
      "informationRatio": 1.2
    },
    "returns": {
      "1M": { "portfolio": 3.5, "benchmark": 2.8, "difference": 0.7 },
      "3M": { "portfolio": 8.2, "benchmark": 6.5, "difference": 1.7 }
    }
  }
}
```

### GET /api/v1/portfolios/[ticker]/factors

Retrieves factor exposure data for a specific portfolio.

**Path Parameters:**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| ticker    | string | Yes      | Portfolio ticker (e.g. TGRT) |

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "date": "2024-06-30",
    "factors": [
      { "name": "Value", "exposure": 0.35, "contribution": -0.48 },
      { "name": "Size", "exposure": -0.52, "contribution": -0.21 },
      { "name": "Momentum", "exposure": 0.95, "contribution": 2.45 },
      { "name": "Quality", "exposure": 0.68, "contribution": 1.75 },
      { "name": "Volatility", "exposure": 0.75, "contribution": -0.92 },
      { "name": "Growth", "exposure": 1.25, "contribution": 3.21 }
    ]
  }
}
```

## Stock Valuation API

### GET /api/v1/stock-valuation/[symbol]

Retrieves financial data for stock valuation modeling.

**Path Parameters:**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| symbol    | string | Yes      | Stock symbol (e.g. AAPL)  |

**Response Schema:**
```json
{
  "status": "success",
  "ric": "AAPL",
  "data": {
    "total_revenue": { "2018": 265595, "2019": 260174, ... },
    "revenue_gr": { "2018": 15.86, "2019": -2.04, ... },
    "economic_earnings": { "2018": 59531, "2019": 55256, ... },
    "earnings_margin": { "2018": 22.41, "2019": 21.24, ... },
    "aroic": { "2018": 32.10, "2019": 31.46, ... },
    "ic": { "2018": 185441, "2019": 175693, ... },
    "ic_gr": { "2018": 5.10, "2019": -5.26, ... },
    "ic_change": { "2018": 9000, "2019": -9748, ... }
  },
  "headers": [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028],
  "valuation_parameters": {
    "Shareholder ratio": 100,
    "Discount rate": 8,
    "Total debt": 120000,
    "Market investment": 10000,
    "Current market cap (mn)": 2900,
    "Interim conversion": 0.33
  }
}
```

### POST /api/v1/stock-valuation/[symbol]/calculate

Calculates a stock valuation based on the provided data.

**Path Parameters:**
| Parameter | Type   | Required | Description               |
|-----------|--------|----------|---------------------------|
| symbol    | string | Yes      | Stock symbol (e.g. AAPL)  |

**Request Payload:**
```json
{
  "valuation_data": {
    "total_revenue": { "2018": 265595, ... },
    "revenue_gr": { "2018": 15.86, ... },
    "economic_earnings": { "2018": 59531, ... },
    "earnings_margin": { "2018": 22.41, ... },
    "aroic": { "2018": 32.10, ... },
    "ic": { "2018": 185441, ... },
    "ic_gr": { "2018": 5.10, ... },
    "ic_chg": { "2018": 9000, ... }
  },
  "valuation_parameters": {
    "Shareholder ratio": 100,
    "Discount rate": 8,
    "Total debt": 120000,
    "Market investment": 10000,
    "Current market cap (mn)": 2900,
    "Interim conversion": 0.33
  }
}
```

**Response Schema:**
```json
{
  "status": "success",
  "ric": "AAPL",
  "result": {
    "Enterprise Value": 3200000,
    "Calculated upside": 10.34
  }
}
```

## Financial Data API

### GET /api/v1/stock/financial

Retrieves financial statement data for a stock.

**Request Parameters:**
| Parameter  | Type   | Required | Description                                  |
|------------|--------|----------|----------------------------------------------|
| symbol     | string | Yes      | Stock symbol (e.g. AAPL)                     |
| reportType | string | Yes      | Type of report ('income', 'balance', or 'cash_flow') |

**Response Schema:**
```json
{
  "status": "success",
  "ric": "AAPL",
  "data": [
    {
      "name": "Gross Profit",
      "values": {
        "2020": 104956,
        "2021": 152836,
        "2022": 170782,
        "2023": 169148,
        "2024": 180683
      },
      "isBold": true
    },
    {
      "name": "Operating Income/Expenses",
      "values": {
        "2020": -38668,
        "2021": -43887,
        "2022": -51345,
        "2023": -54847,
        "2024": -57467
      }
    }
  ]
}
```

**Error Responses:**
```json
{
  "error": "Symbol parameter is required"
}
```

```json
{
  "error": "Valid reportType parameter is required (income, balance, or cash_flow)"
}
```
