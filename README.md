# Stock Analysis Website

A professional stock analysis website built with Next.js, Tailwind CSS, shadcn/ui, and Recharts.

## Features

- Individual stock overview pages with detailed analysis
- Quality metrics with AROIC visualization
- Momentum comparison with benchmarks
- Valuation snapshots with historical context
- Investment scorecard
- Company information and latest news

## Site Map

```
/                                # Homepage with market overview and featured stocks
│
├── /stock                       # Equities main page with stock listings and filters
│   │
│   └── /[symbol]                # Individual stock container page
│       ├── /overview            # Stock overview with key metrics, price chart, and summary
│       ├── /financials          # Financial statements, ratios, and growth metrics
│       ├── /valuation           # Valuation metrics, historical multiples, and fair value estimates
│       ├── /momentum            # Price momentum, technical indicators, and relative strength
│       ├── /operation           # Business operations, margins, efficiency metrics, and ROIC analysis
│       ├── /peers               # Peer comparison with competitive positioning and relative metrics
│       ├── /risk                # Risk metrics, volatility analysis, and downside protection
│       └── /modelling           # Financial models, projections, and scenario analysis
│
├── /markets                     # Markets overview showing all sectors with company counts
│   │
│   └── /[marketsId]             # Individual market/sector page
│       ├── /overview            # Sector overview with key metrics and constituent stocks
│       ├── /valuation           # Sector valuation metrics and historical trends
│       ├── /momentum            # Sector momentum and relative performance
│       ├── /operation           # Sector operational metrics and efficiency analysis
│       └── /peers               # Comparison with other sectors and relative positioning
│
├── /screener                    # Stock screening tool with customizable filters
│   └── (Results display with sortable columns and savable screens)
│
├── /portfolio                   # Portfolio management dashboard with allocation overview
│   │
│   └── /[ticker]                # Individual portfolio view
│       ├── /                    # Portfolio summary with key metrics and allocation
│       ├── /holdings            # Detailed holdings list with performance metrics
│       └── /performance         # Performance analysis with charts and benchmarking
│
├── /macro                       # Macroeconomic analysis dashboard
│   └── (Economic indicators, central bank policies, inflation metrics)
│
├── /charting                    # Advanced charting tools with technical indicators
│   └── (Interactive charts with drawing tools and pattern recognition)
│
├── /analysis                    # Investment analysis tools and research reports
│   └── (Fundamental analysis frameworks, industry reports)
│
└── /article                     # Financial articles and news hub
    │
    └── /[slug]                  # Individual article page with full content
```

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/pages` - Next.js pages
- `/components` - Reusable React components
  - `/ui` - shadcn/ui components
  - `/layout` - Layout components
- `/styles` - Global styles and Tailwind CSS configuration
- `/lib` - Utility functions and helpers

## Development

- Use `npm run dev` to start the development server
- Use `npm run build` to create a production build
- Use `npm run start` to start the production server
- Use `npm run lint` to run ESLint

## License

MIT 