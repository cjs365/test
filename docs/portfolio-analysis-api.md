
## Data Inputs

- a dic for ric and weight e.g. {"AAPL.US": 6.4, "ORCL.US": 80, ...}
- Benchmark ric: SPXTR

- Time Period (e.g., YTD, 1Y, 3Y, 5Y)


### 2. Performance Attribution

**Description:** Shows how portfolio performance is attributed to different factors and decisions.

**Data Structure:**
```json
{
  "factorAttributionData": [
    { "name": "Quality", "allocation": 45, "selection": -20, "interaction": 8 },
    { "name": "Valuation", "allocation": -32, "selection": 15, "interaction": -5 },
    { "name": "Momentum", "allocation": 58, "selection": 62, "interaction": 10 },
    { "name": "Risk", "allocation": -18, "selection": -12, "interaction": -4 },
    { "name": "Growth", "allocation": 12, "selection": 35, "interaction": 5 }
  ],
  "factorExposureData": [
    { "name": "Quality", "exposure": 0.6 },
    { "name": "Valuation", "exposure": -0.4 },
    { "name": "Momentum", "exposure": 0.85 },
    { "name": "Risk", "exposure": -0.25 },
    { "name": "Growth", "exposure": 0.15 }
  ],
  "factorProfileData": {
    "Valuation": "Medium-High",
    "Growth": "Low",
    "Quality": "High",
    "Momentum": "High",
    "Risk": "Low"
  },
  "factorReturnTable": [
    {
      "factor": "Quality",
      "benchmark": "+4.2%",
      "exposure": "+0.6σ",
      "exposureDirection": "positive",
      "attribution": "+33bp"
    },
    {
      "factor": "Valuation",
      "benchmark": "-1.8%",
      "exposure": "-0.4σ",
      "exposureDirection": "negative",
      "attribution": "-12bp"
    },
    {
      "factor": "Momentum",
      "benchmark": "+7.5%",
      "exposure": "+0.85σ",
      "exposureDirection": "positive",
      "attribution": "+130bp"
    },
    {
      "factor": "Risk",
      "benchmark": "+2.1%",
      "exposure": "-0.25σ",
      "exposureDirection": "negative",
      "attribution": "-34bp"
    },
    {
      "factor": "Growth",
      "benchmark": "+3.5%",
      "exposure": "+0.15σ",
      "exposureDirection": "positive",
      "attribution": "+18bp"
    }
  ]
}
```

- **allocation**: Factor allocation effect in basis points
- **selection**: Stock selection effect within factor in basis points
- **interaction**: Combined impact effect in basis points
- **exposure**: Factor exposure in standard deviations
- **exposureDirection**: Direction of exposure (positive/negative)
- **benchmark**: Factor return in the benchmark
- **attribution**: Performance attribution in basis points

### 3. Scenario Analysis & Stress Testing

**Description:** Shows portfolio performance under different market scenarios.

**Data Structure:**
```json
{
  "predefinedScenarios": ["COVID Crash", "GFC", "Fed Rate Shock", "Oil Spike", "USD Rally"],
  "scenarioPnLData": [
    {
      "scenario": "COVID Crash",
      "return": "-18.7%",
      "varShift": "+85%",
      "factors": [
        { "name": "Momentum", "color": "green" },
        { "name": "Risk", "color": "amber" }
      ]
    },
    {
      "scenario": "GFC",
      "return": "-24.3%",
      "varShift": "+120%",
      "factors": [
        { "name": "Beta", "color": "purple" },
        { "name": "Credit Spread", "color": "sky" }
      ]
    }
  ],
  "customFactorStress": {
    "factor": "Momentum",
    "shockSize": "+2σ",
    "returnImpact": "-4.6%",
    "benchmarkImpact": "-2.1%",
    "topAffectedHoldings": ["NVDA", "AMZN", "TSLA"],
    "factorExposurePercentage": "52%"
  }
}
```

- **scenario**: Name of the predefined stress scenario
- **return**: Expected portfolio return under scenario
- **varShift**: Value-at-Risk shift under scenario
- **factors**: Key factors affected by scenario
- **shockSize**: Size of shock for custom factor stress
- **returnImpact**: Expected return impact from factor shock
- **benchmarkImpact**: Benchmark return impact from factor shock
- **topAffectedHoldings**: Most affected holdings from stress

### 4. AI Portfolio Insights

**Description:** Provides AI-generated insights about portfolio factor exposures and performance.

**Data Structure:**
```json
{
  "aiInsights": {
    "positioningDescription": "quality-momentum blend with growth tilt",
    "keyDrivers": [
      {
        "factor": "Momentum",
        "exposure": "+0.85σ",
        "contribution": "+130bp",
        "assessment": "key driver of outperformance"
      },
      {
        "factor": "Quality",
        "exposure": "+0.6σ",
        "contribution": "+33bp",
        "assessment": "positively contributed"
      },
      {
        "factor": "Valuation",
        "exposure": "-0.4σ",
        "contribution": "-12bp",
        "assessment": "detracted slightly"
      }
    ],
    "recommendations": [
      "Consider reducing exposure to Risk stocks which underperformed"
    ]
  }
}
```

- **positioningDescription**: Overall portfolio positioning summary
- **keyDrivers**: Factors with significant impact on performance
- **exposure**: Factor exposure in standard deviations
- **contribution**: Performance contribution in basis points
- **assessment**: Assessment of the factor's impact
- **recommendations**: Suggested portfolio adjustments

### 5. Portfolio Return & Risk Snapshot

**Description:** Provides key performance and risk metrics for the portfolio.

**Data Structure:**
```json
{
  "keyMetrics": [
    { "id": "1", "name": "YTD Return", "value": "8.5%" },
    { "id": "2", "name": "Excess Return", "value": "2.3%" },
    { "id": "3", "name": "Sharpe Ratio", "value": "0.82" },
    { "id": "4", "name": "Information Ratio", "value": "0.67" },
    { "id": "5", "name": "Alpha", "value": "2.1%" },
    { "id": "6", "name": "Beta", "value": "1.05" },
    { "id": "7", "name": "Tracking Error", "value": "3.4%" },
    { "id": "8", "name": "Max Drawdown", "value": "-12.3%" }
  ]
}
```

- **name**: Metric name
- **value**: Metric value formatted for display
- **id**: Unique identifier for the metric

### 6. Top Holdings

**Description:** Shows portfolio's top holdings with factor exposures.

**Data Structure:**
```json
{
  "topHoldings": [
    {
      "ticker": "AAPL",
      "name": "Apple Inc",
      "weight": "7.2%",
      "active": "+2.1%",
      "factors": [
        { "name": "Quality", "color": "blue" },
        { "name": "Momentum", "color": "green" }
      ]
    },
    {
      "ticker": "MSFT",
      "name": "Microsoft",
      "weight": "6.8%",
      "active": "+1.5%",
      "factors": [
        { "name": "Momentum", "color": "green" },
        { "name": "Valuation", "color": "purple" }
      ]
    }
  ]
}
```

- **ticker**: Stock ticker symbol
- **name**: Company name
- **weight**: Portfolio weight percentage
- **active**: Active weight relative to benchmark
- **factors**: Key factor exposures of the holding
- **color**: Color code for factor visualization

### 7. Similar Stocks

**Description:** Identifies stocks with similar factor exposures to the portfolio.

How to write the function: 
Use clustering algorithms to group similar exposure profiles:

Hierarchical clustering + HRP: Estimate correlations between exposure vectors, cluster using hierarchical methods, and optionally use Hierarchical Risk Parity to allocate by cluster risk

🎯 5. Identify “Similar Stocks” from Clusters
Nearest neighbor search: Within the clusters most similar to the user’s existing holdings, calculate distance metrics (e.g. Mahalanobis or Euclidean) between exposure vectors and cluster centroids.

Select top matches: Choose the top N stocks (e.g., 5–10) with smallest distance to representative holdings clusters.

**Data Structure:**
```json
{
  "similarStocks": [
    {
      "ticker": "TXN",
      "name": "Texas Instruments",
      "similarity": "97%",
      "sector": "Tech",
      "keyFactorMatch": "High Quality, Risk",
      "factorExposures": {
        "Quality": 0.8,
        "Valuation": -0.3,
        "Momentum": 0.4,
        "Risk": 0.7,
        "Growth": 0.1
      }
    },
    {
      "ticker": "ROP",
      "name": "Roper Technologies",
      "similarity": "95%",
      "sector": "Industrials",
      "keyFactorMatch": "Quality, Momentum",
      "factorExposures": {
        "Quality": 0.75,
        "Valuation": -0.5,
        "Momentum": 0.9,
        "Risk": 0.2,
        "Growth": 0.4
      }
    }
  ],
  "comparisonData": {
    "TXN": [
      { "name": "Quality", "portfolio": 0.6, "stock": 0.8 },
      { "name": "Valuation", "portfolio": -0.4, "stock": -0.3 },
      { "name": "Momentum", "portfolio": 0.85, "stock": 0.4 },
      { "name": "Risk", "portfolio": -0.25, "stock": 0.7 },
      { "name": "Growth", "portfolio": 0.15, "stock": 0.1 }
    ],
    "comparisonAnalysis": "<span class='font-medium'>TXN</span> has stronger <span class='font-medium'>Quality</span> and <span class='font-medium'>Risk</span> exposure than your portfolio, but weaker <span class='font-medium'>Momentum</span> exposure. Consider adding this stock to increase your quality factor exposure."
  }
}
```

- **ticker**: Stock ticker symbol
- **name**: Company name
- **similarity**: Similarity percentage to portfolio
- **sector**: Stock sector
- **keyFactorMatch**: Key factors matching portfolio
- **factorExposures**: Detailed factor exposures
- **comparisonData**: Comparison between portfolio and stock
- **comparisonAnalysis**: Analysis of comparison results


## API Endpoints

Based on the data needs, the following API endpoints should be implemented:

1. `GET /api/v1/portfolio-analysis/portfolios` - Get available portfolios
2. `GET /api/v1/portfolio-analysis/benchmarks` - Get available benchmarks
3. `GET /api/v1/portfolio-analysis/time-periods` - Get available time periods
4. `GET /api/v1/portfolio-analysis/{portfolioId}/{benchmarkId}/{timePeriod}` - Get full analysis
5. `GET /api/v1/portfolio-analysis/{portfolioId}/attribution` - Get attribution data
6. `GET /api/v1/portfolio-analysis/{portfolioId}/factor-exposures` - Get factor exposures
7. `GET /api/v1/portfolio-analysis/{portfolioId}/scenario-analysis` - Get scenario analysis
8. `GET /api/v1/portfolio-analysis/{portfolioId}/top-holdings` - Get top holdings
9. `GET /api/v1/portfolio-analysis/{portfolioId}/similar-stocks` - Get similar stocks
11. `POST /api/v1/portfolio-analysis/stress-test` - Run custom stress test

Each endpoint should return data in the JSON format specified in the corresponding section above. 