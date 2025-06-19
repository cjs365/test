# Clarval - Financial Analysis Platform

## Overview
Clarval is a comprehensive financial analysis platform that provides tools for stock valuation, portfolio analysis, and market screening.

## Features
- Stock analysis with fundamental data
- Portfolio management and performance tracking
- Market screener with customizable criteria
- Valuation models and scenario analysis

## Getting Started

### Prerequisites
- Node.js 18.x or higher

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/clarval.git
cd clarval
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Architecture
The application uses local mock data for demonstration purposes. All mock data is stored in the `mock-data` folder:

- `mock-data/portfolio/`: Portfolio data and services
- `mock-data/screener/`: Screener data and utilities
- `mock-data/stock/`: Stock data and financial information

For financial data, the application will first try to use the official API if available (e.g., `/api/v1/stock/[symbol]/financial`). If the API is not available, it will fall back to the mock data.

## API Endpoints

### Portfolio Endpoints
- `GET /api/v1/portfolios`: Get all portfolios with categories and risk levels
- `GET /api/v1/portfolios/:ticker`: Get a specific portfolio by ticker
- `GET /api/v1/portfolios/:ticker/holdings`: Get holdings data for a portfolio
- `GET /api/v1/portfolios/:ticker/factors`: Get factor data for a portfolio

### Stock Endpoints
- `GET /api/v1/stock/:symbol/financial`: Get financial report data for a stock
- `GET /api/v1/stock/:symbol/modelling`: Get valuation data for a stock
- `POST /api/v1/stock/:symbol/modelling/calculate`: Calculate valuation for a stock
- `POST /api/v1/stock/:symbol/sensitivity`: Generate sensitivity analysis for a stock

## Tech Stack
- Next.js for the frontend and API routes
- React for UI components
- Recharts for data visualization
- Tailwind CSS for styling

## License
This project is licensed under the MIT License - see the LICENSE file for details. 