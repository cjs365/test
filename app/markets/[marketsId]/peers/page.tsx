'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Button } from '@/components/ui/button';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ComparisonView = 'operations' | 'valuation' | 'momentum' | 'growth' | 'risk';
type OperationsLayout = 'stacked' | 'sideBySide';
type MomentumPeriod = '1M' | '3M' | '6M' | 'YTD';

// Define market identifiers
type MarketId = 'software_us' | 'software_eu' | 'semiconductors_us' | 'semiconductors_eu' | 'hardware_us' | 'hardware_eu' | 'biotech_us' | 'biotech_eu' | 'pharma_us' | 'pharma_eu' | 'banks_us' | 'banks_eu';

type MarketMetrics = {
  [K in MarketId]: number;
};

type Market = {
  id: MarketId;
  name: string;
  country: string;
  industry: string;
};

type OperationalData = {
  aroic: {
    LFY: MarketMetrics;
    NTM: MarketMetrics;
  };
  assetGrowth: {
    LFY: MarketMetrics;
    NTM: MarketMetrics;
  };
};

type ValuationDataPoint = {
  date: string;
} & MarketMetrics;

type ValuationData = {
  evEE: ValuationDataPoint[];
  evIC: ValuationDataPoint[];
  pe: ValuationDataPoint[];
};

type YearlyPerfDataPoint = {
  year: string;
} & MarketMetrics;

type MomentumData = {
  monthlyPerf: {
    [K in MomentumPeriod]: MarketMetrics;
  };
  yearlyPerf: YearlyPerfDataPoint[];
};

// Add growth data structure
type GrowthData = {
  revenue: {
    LFY: MarketMetrics;
    NTM: MarketMetrics;
    CAGR5Y: MarketMetrics;
  };
  earnings: {
    LFY: MarketMetrics;
    NTM: MarketMetrics;
    CAGR5Y: MarketMetrics;
  };
  reinvestmentRate: {
    LFY: MarketMetrics;
    NTM: MarketMetrics;
  };
};

// Add risk data structure
type RiskData = {
  beta: MarketMetrics;
  volatility: MarketMetrics;
  debtToEquity: MarketMetrics;
  interestCoverage: MarketMetrics;
  liquidityRatio: MarketMetrics;
};

// Mock market data
const mockMarkets: Market[] = [
  { id: 'software_us', name: 'Software', country: 'United States', industry: 'Software' },
  { id: 'software_eu', name: 'Software', country: 'Europe', industry: 'Software' },
  { id: 'semiconductors_us', name: 'Semiconductors', country: 'United States', industry: 'Semiconductors' },
  { id: 'semiconductors_eu', name: 'Semiconductors', country: 'Europe', industry: 'Semiconductors' },
  { id: 'hardware_us', name: 'Computer Hardware', country: 'United States', industry: 'Hardware' },
  { id: 'hardware_eu', name: 'Computer Hardware', country: 'Europe', industry: 'Hardware' },
  { id: 'biotech_us', name: 'Biotechnology', country: 'United States', industry: 'Biotech' },
  { id: 'biotech_eu', name: 'Biotechnology', country: 'Europe', industry: 'Biotech' },
  { id: 'pharma_us', name: 'Pharmaceuticals', country: 'United States', industry: 'Pharma' },
  { id: 'pharma_eu', name: 'Pharmaceuticals', country: 'Europe', industry: 'Pharma' },
  { id: 'banks_us', name: 'Banks', country: 'United States', industry: 'Banks' },
  { id: 'banks_eu', name: 'Banks', country: 'Europe', industry: 'Banks' },
];

// Mock operational metrics data
const mockOperationalData: OperationalData = {
  aroic: {
    LFY: {
      software_us: 28.5, software_eu: 24.4, semiconductors_us: 32.6, semiconductors_eu: 29.9, 
      hardware_us: 26.3, hardware_eu: 23.1, biotech_us: 18.9, biotech_eu: 16.5,
      pharma_us: 22.3, pharma_eu: 19.8, banks_us: 15.2, banks_eu: 12.8
    },
    NTM: {
      software_us: 29.8, software_eu: 25.6, semiconductors_us: 34.2, semiconductors_eu: 31.5, 
      hardware_us: 27.8, hardware_eu: 24.3, biotech_us: 19.5, biotech_eu: 17.2,
      pharma_us: 23.6, pharma_eu: 20.9, banks_us: 16.1, banks_eu: 13.5
    }
  },
  assetGrowth: {
    LFY: {
      software_us: 12.4, software_eu: 10.8, semiconductors_us: 15.2, semiconductors_eu: 13.5, 
      hardware_us: 9.2, hardware_eu: 8.1, biotech_us: 14.5, biotech_eu: 12.8,
      pharma_us: 8.5, pharma_eu: 7.2, banks_us: 6.3, banks_eu: 5.4
    },
    NTM: {
      software_us: 13.5, software_eu: 11.9, semiconductors_us: 16.8, semiconductors_eu: 14.8, 
      hardware_us: 9.8, hardware_eu: 8.6, biotech_us: 15.9, biotech_eu: 13.7,
      pharma_us: 9.1, pharma_eu: 7.8, banks_us: 6.8, banks_eu: 5.9
    }
  }
};

// Mock valuation metrics data
const mockValuationData: ValuationData = {
  evEE: [
    { date: '2023-Q1', software_us: 18.2, software_eu: 15.4, semiconductors_us: 20.8, semiconductors_eu: 19.5, hardware_us: 16.3, hardware_eu: 14.8, biotech_us: 12.5, biotech_eu: 11.2, pharma_us: 14.5, pharma_eu: 13.2, banks_us: 10.8, banks_eu: 9.5 },
    { date: '2023-Q2', software_us: 19.5, software_eu: 16.2, semiconductors_us: 22.1, semiconductors_eu: 20.8, hardware_us: 17.1, hardware_eu: 15.5, biotech_us: 13.1, biotech_eu: 11.8, pharma_us: 15.2, pharma_eu: 13.8, banks_us: 11.4, banks_eu: 10.1 },
    { date: '2023-Q3', software_us: 20.8, software_eu: 17.1, semiconductors_us: 23.4, semiconductors_eu: 22.1, hardware_us: 17.8, hardware_eu: 16.2, biotech_us: 13.8, biotech_eu: 12.5, pharma_us: 15.9, pharma_eu: 14.5, banks_us: 12.1, banks_eu: 10.8 },
    { date: '2023-Q4', software_us: 22.1, software_eu: 18.0, semiconductors_us: 24.7, semiconductors_eu: 23.4, hardware_us: 18.5, hardware_eu: 16.9, biotech_us: 14.5, biotech_eu: 13.2, pharma_us: 16.6, pharma_eu: 15.2, banks_us: 12.8, banks_eu: 11.5 }
  ],
  evIC: [
    { date: '2023-Q1', software_us: 22.5, software_eu: 19.8, semiconductors_us: 25.1, semiconductors_eu: 23.8, hardware_us: 20.1, hardware_eu: 18.2, biotech_us: 15.4, biotech_eu: 13.8, pharma_us: 17.8, pharma_eu: 16.2, banks_us: 13.5, banks_eu: 12.2 },
    { date: '2023-Q2', software_us: 23.8, software_eu: 20.5, semiconductors_us: 26.4, semiconductors_eu: 25.1, hardware_us: 21.0, hardware_eu: 19.1, biotech_us: 16.2, biotech_eu: 14.5, pharma_us: 18.5, pharma_eu: 16.9, banks_us: 14.2, banks_eu: 12.9 },
    { date: '2023-Q3', software_us: 25.1, software_eu: 21.2, semiconductors_us: 27.7, semiconductors_eu: 26.4, hardware_us: 21.9, hardware_eu: 20.0, biotech_us: 17.0, biotech_eu: 15.2, pharma_us: 19.2, pharma_eu: 17.6, banks_us: 14.9, banks_eu: 13.6 },
    { date: '2023-Q4', software_us: 26.4, software_eu: 22.0, semiconductors_us: 29.0, semiconductors_eu: 27.7, hardware_us: 22.8, hardware_eu: 20.9, biotech_us: 17.8, biotech_eu: 15.9, pharma_us: 19.9, pharma_eu: 18.3, banks_us: 15.6, banks_eu: 14.3 }
  ],
  pe: [
    { date: '2023-Q1', software_us: 25.8, software_eu: 22.5, semiconductors_us: 28.4, semiconductors_eu: 26.2, hardware_us: 23.5, hardware_eu: 21.2, biotech_us: 18.9, biotech_eu: 16.8, pharma_us: 20.5, pharma_eu: 18.9, banks_us: 15.2, banks_eu: 13.8 },
    { date: '2023-Q2', software_us: 27.2, software_eu: 23.8, semiconductors_us: 29.7, semiconductors_eu: 27.5, hardware_us: 24.8, hardware_eu: 22.5, biotech_us: 19.8, biotech_eu: 17.7, pharma_us: 21.8, pharma_eu: 20.2, banks_us: 16.5, banks_eu: 15.1 },
    { date: '2023-Q3', software_us: 28.6, software_eu: 25.1, semiconductors_us: 31.0, semiconductors_eu: 28.8, hardware_us: 26.1, hardware_eu: 23.8, biotech_us: 20.7, biotech_eu: 18.6, pharma_us: 23.1, pharma_eu: 21.5, banks_us: 17.8, banks_eu: 16.4 },
    { date: '2023-Q4', software_us: 30.0, software_eu: 26.4, semiconductors_us: 32.3, semiconductors_eu: 30.1, hardware_us: 27.4, hardware_eu: 25.1, biotech_us: 21.6, biotech_eu: 19.5, pharma_us: 24.4, pharma_eu: 22.8, banks_us: 19.1, banks_eu: 17.7 }
  ]
};

// Mock momentum data
const mockMomentumData: MomentumData = {
  monthlyPerf: {
    '1M': { software_us: 5.2, software_eu: 4.8, semiconductors_us: 6.5, semiconductors_eu: 5.8, hardware_us: 4.2, hardware_eu: 3.9, biotech_us: 3.5, biotech_eu: 2.9, pharma_us: 3.8, pharma_eu: 3.2, banks_us: 2.8, banks_eu: 2.5 },
    '3M': { software_us: 12.5, software_eu: 11.2, semiconductors_us: 15.8, semiconductors_eu: 14.2, hardware_us: 10.5, hardware_eu: 9.8, biotech_us: 8.9, biotech_eu: 7.5, pharma_us: 9.5, pharma_eu: 8.2, banks_us: 7.2, banks_eu: 6.5 },
    '6M': { software_us: 22.8, software_eu: 19.5, semiconductors_us: 28.5, semiconductors_eu: 25.2, hardware_us: 20.1, hardware_eu: 18.2, biotech_us: 16.8, biotech_eu: 14.5, pharma_us: 17.5, pharma_eu: 15.2, banks_us: 13.8, banks_eu: 12.5 },
    'YTD': { software_us: 28.5, software_eu: 25.4, semiconductors_us: 34.2, semiconductors_eu: 30.8, hardware_us: 24.2, hardware_eu: 22.8, biotech_us: 20.5, biotech_eu: 17.8, pharma_us: 21.2, pharma_eu: 18.5, banks_us: 16.5, banks_eu: 15.2 }
  },
  yearlyPerf: [
    { year: '2021', software_us: 38.5, software_eu: 34.2, semiconductors_us: 45.2, semiconductors_eu: 40.8, hardware_us: 33.2, hardware_eu: 30.8, biotech_us: 27.5, biotech_eu: 24.2, pharma_us: 28.8, pharma_eu: 25.5, banks_us: 22.8, banks_eu: 20.5 },
    { year: '2022', software_us: 28.2, software_eu: 25.1, semiconductors_us: 32.5, semiconductors_eu: 29.8, hardware_us: 24.8, hardware_eu: 22.5, biotech_us: 20.2, biotech_eu: 17.8, pharma_us: 21.5, pharma_eu: 19.2, banks_us: 16.5, banks_eu: 15.2 },
    { year: '2023', software_us: 42.8, software_eu: 38.5, semiconductors_us: 48.5, semiconductors_eu: 44.2, hardware_us: 37.5, hardware_eu: 35.2, biotech_us: 32.1, biotech_eu: 28.5, pharma_us: 33.8, pharma_eu: 30.5, banks_us: 26.8, banks_eu: 24.5 },
    { year: '2024 YTD', software_us: 15.2, software_eu: 13.8, semiconductors_us: 18.5, semiconductors_eu: 16.8, hardware_us: 14.2, hardware_eu: 12.5, biotech_us: 11.5, biotech_eu: 10.2, pharma_us: 12.2, pharma_eu: 11.0, banks_us: 9.8, banks_eu: 8.5 }
  ]
};

// Update share price performance data to monthly
const mockSharePriceData = [
  // 2021
  { date: '2021-01', software_us: 100, software_eu: 100, semiconductors_us: 100, semiconductors_eu: 100, hardware_us: 100, hardware_eu: 100, biotech_us: 100, biotech_eu: 100, pharma_us: 100, pharma_eu: 100, banks_us: 100, banks_eu: 100 },
  { date: '2021-06', software_us: 112, software_eu: 108, semiconductors_us: 115, semiconductors_eu: 110, hardware_us: 108, hardware_eu: 105, biotech_us: 106, biotech_eu: 103, pharma_us: 105, pharma_eu: 102, banks_us: 104, banks_eu: 102 },
  { date: '2021-12', software_us: 125, software_eu: 118, semiconductors_us: 132, semiconductors_eu: 125, hardware_us: 120, hardware_eu: 115, biotech_us: 115, biotech_eu: 110, pharma_us: 112, pharma_eu: 108, banks_us: 110, banks_eu: 106 },
  // 2022
  { date: '2022-01', software_us: 122, software_eu: 115, semiconductors_us: 130, semiconductors_eu: 122, hardware_us: 118, hardware_eu: 112, biotech_us: 112, biotech_eu: 108, pharma_us: 110, pharma_eu: 106, banks_us: 108, banks_eu: 104 },
  { date: '2022-06', software_us: 135, software_eu: 128, semiconductors_us: 145, semiconductors_eu: 138, hardware_us: 130, hardware_eu: 125, biotech_us: 125, biotech_eu: 120, pharma_us: 122, pharma_eu: 118, banks_us: 118, banks_eu: 115 },
  { date: '2022-12', software_us: 148, software_eu: 140, semiconductors_us: 160, semiconductors_eu: 152, hardware_us: 142, hardware_eu: 136, biotech_us: 138, biotech_eu: 132, pharma_us: 135, pharma_eu: 130, banks_us: 130, banks_eu: 125 },
  // 2023
  { date: '2023-01', software_us: 150, software_eu: 142, semiconductors_us: 162, semiconductors_eu: 155, hardware_us: 145, hardware_eu: 138, biotech_us: 140, biotech_eu: 135, pharma_us: 138, pharma_eu: 132, banks_us: 132, banks_eu: 128 },
  { date: '2023-02', software_us: 155, software_eu: 148, semiconductors_us: 168, semiconductors_eu: 160, hardware_us: 150, hardware_eu: 142, biotech_us: 145, biotech_eu: 140, pharma_us: 142, pharma_eu: 136, banks_us: 136, banks_eu: 132 },
  { date: '2023-03', software_us: 160, software_eu: 152, semiconductors_us: 175, semiconductors_eu: 168, hardware_us: 155, hardware_eu: 148, biotech_us: 150, biotech_eu: 145, pharma_us: 148, pharma_eu: 142, banks_us: 140, banks_eu: 136 },
  { date: '2023-04', software_us: 165, software_eu: 158, semiconductors_us: 182, semiconductors_eu: 175, hardware_us: 160, hardware_eu: 152, biotech_us: 155, biotech_eu: 150, pharma_us: 152, pharma_eu: 148, banks_us: 145, banks_eu: 140 },
  { date: '2023-05', software_us: 170, software_eu: 162, semiconductors_us: 188, semiconductors_eu: 180, hardware_us: 165, hardware_eu: 158, biotech_us: 160, biotech_eu: 155, pharma_us: 158, pharma_eu: 152, banks_us: 150, banks_eu: 145 },
  { date: '2023-06', software_us: 175, software_eu: 168, semiconductors_us: 195, semiconductors_eu: 188, hardware_us: 170, hardware_eu: 162, biotech_us: 165, biotech_eu: 160, pharma_us: 162, pharma_eu: 158, banks_us: 155, banks_eu: 150 },
  { date: '2023-07', software_us: 180, software_eu: 172, semiconductors_us: 202, semiconductors_eu: 195, hardware_us: 175, hardware_eu: 168, biotech_us: 170, biotech_eu: 165, pharma_us: 168, pharma_eu: 162, banks_us: 160, banks_eu: 155 },
  { date: '2023-08', software_us: 185, software_eu: 178, semiconductors_us: 208, semiconductors_eu: 200, hardware_us: 180, hardware_eu: 172, biotech_us: 175, biotech_eu: 170, pharma_us: 172, pharma_eu: 168, banks_us: 165, banks_eu: 160 },
  { date: '2023-09', software_us: 190, software_eu: 182, semiconductors_us: 215, semiconductors_eu: 208, hardware_us: 185, hardware_eu: 178, biotech_us: 180, biotech_eu: 175, pharma_us: 178, pharma_eu: 172, banks_us: 170, banks_eu: 165 },
  { date: '2023-10', software_us: 195, software_eu: 188, semiconductors_us: 222, semiconductors_eu: 215, hardware_us: 190, hardware_eu: 182, biotech_us: 185, biotech_eu: 180, pharma_us: 182, pharma_eu: 178, banks_us: 175, banks_eu: 170 },
  { date: '2023-11', software_us: 200, software_eu: 192, semiconductors_us: 228, semiconductors_eu: 220, hardware_us: 195, hardware_eu: 188, biotech_us: 190, biotech_eu: 185, pharma_us: 188, pharma_eu: 182, banks_us: 180, banks_eu: 175 },
  { date: '2023-12', software_us: 205, software_eu: 198, semiconductors_us: 235, semiconductors_eu: 228, hardware_us: 200, hardware_eu: 192, biotech_us: 195, biotech_eu: 190, pharma_us: 192, pharma_eu: 188, banks_us: 185, banks_eu: 180 }
];

// Mock growth data
const mockGrowthData: GrowthData = {
  revenue: {
    LFY: {
      software_us: 15.2, software_eu: 13.5, semiconductors_us: 18.5, semiconductors_eu: 16.8, 
      hardware_us: 10.5, hardware_eu: 9.2, biotech_us: 22.5, biotech_eu: 19.8,
      pharma_us: 12.5, pharma_eu: 10.8, banks_us: 8.5, banks_eu: 7.2
    },
    NTM: {
      software_us: 16.8, software_eu: 14.5, semiconductors_us: 20.2, semiconductors_eu: 18.5, 
      hardware_us: 11.2, hardware_eu: 9.8, biotech_us: 24.5, biotech_eu: 21.2,
      pharma_us: 13.8, pharma_eu: 11.5, banks_us: 9.2, banks_eu: 7.8
    },
    CAGR5Y: {
      software_us: 17.5, software_eu: 15.2, semiconductors_us: 19.8, semiconductors_eu: 18.2, 
      hardware_us: 12.5, hardware_eu: 10.8, biotech_us: 23.5, biotech_eu: 20.5,
      pharma_us: 14.2, pharma_eu: 12.5, banks_us: 9.8, banks_eu: 8.5
    }
  },
  earnings: {
    LFY: {
      software_us: 18.5, software_eu: 16.2, semiconductors_us: 22.5, semiconductors_eu: 20.2, 
      hardware_us: 14.5, hardware_eu: 12.8, biotech_us: 25.5, biotech_eu: 22.8,
      pharma_us: 15.8, pharma_eu: 13.5, banks_us: 10.5, banks_eu: 9.2
    },
    NTM: {
      software_us: 20.2, software_eu: 17.8, semiconductors_us: 24.5, semiconductors_eu: 22.2, 
      hardware_us: 15.8, hardware_eu: 13.5, biotech_us: 27.5, biotech_eu: 24.8,
      pharma_us: 17.2, pharma_eu: 14.8, banks_us: 11.5, banks_eu: 10.2
    },
    CAGR5Y: {
      software_us: 19.5, software_eu: 17.2, semiconductors_us: 23.5, semiconductors_eu: 21.5, 
      hardware_us: 15.2, hardware_eu: 13.2, biotech_us: 26.5, biotech_eu: 23.8,
      pharma_us: 16.5, pharma_eu: 14.2, banks_us: 11.2, banks_eu: 9.8
    }
  },
  reinvestmentRate: {
    LFY: {
      software_us: 45.2, software_eu: 42.5, semiconductors_us: 48.5, semiconductors_eu: 46.2, 
      hardware_us: 38.5, hardware_eu: 36.2, biotech_us: 52.5, biotech_eu: 49.8,
      pharma_us: 40.5, pharma_eu: 38.2, banks_us: 32.5, banks_eu: 30.2
    },
    NTM: {
      software_us: 46.8, software_eu: 44.2, semiconductors_us: 50.2, semiconductors_eu: 47.8, 
      hardware_us: 40.2, hardware_eu: 37.8, biotech_us: 54.5, biotech_eu: 51.5,
      pharma_us: 42.2, pharma_eu: 39.8, banks_us: 34.2, banks_eu: 31.8
    }
  }
};

// Mock risk data
const mockRiskData: RiskData = {
  beta: {
    software_us: 1.25, software_eu: 1.18, semiconductors_us: 1.42, semiconductors_eu: 1.35, 
    hardware_us: 1.15, hardware_eu: 1.08, biotech_us: 1.52, biotech_eu: 1.45,
    pharma_us: 0.95, pharma_eu: 0.88, banks_us: 1.05, banks_eu: 0.98
  },
  volatility: {
    software_us: 22.5, software_eu: 20.8, semiconductors_us: 28.5, semiconductors_eu: 26.2, 
    hardware_us: 19.5, hardware_eu: 18.2, biotech_us: 32.5, biotech_eu: 30.2,
    pharma_us: 18.5, pharma_eu: 17.2, banks_us: 20.5, banks_eu: 19.2
  },
  debtToEquity: {
    software_us: 0.45, software_eu: 0.52, semiconductors_us: 0.38, semiconductors_eu: 0.45, 
    hardware_us: 0.55, hardware_eu: 0.62, biotech_us: 0.35, biotech_eu: 0.42,
    pharma_us: 0.58, pharma_eu: 0.65, banks_us: 1.25, banks_eu: 1.35
  },
  interestCoverage: {
    software_us: 12.5, software_eu: 10.8, semiconductors_us: 15.2, semiconductors_eu: 13.5, 
    hardware_us: 9.5, hardware_eu: 8.2, biotech_us: 8.5, biotech_eu: 7.2,
    pharma_us: 11.5, pharma_eu: 9.8, banks_us: 6.5, banks_eu: 5.8
  },
  liquidityRatio: {
    software_us: 2.5, software_eu: 2.2, semiconductors_us: 2.8, semiconductors_eu: 2.5, 
    hardware_us: 2.2, hardware_eu: 1.9, biotech_us: 3.2, biotech_eu: 2.9,
    pharma_us: 2.4, pharma_eu: 2.1, banks_us: 1.5, banks_eu: 1.3
  }
};

// Create a sortable market item component
function SortableMarketItem({ market, onRemove }: { market: MarketId, onRemove: (market: MarketId) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: market });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  // Find the market details
  const marketDetails = mockMarkets.find(m => m.id === market);
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
    >
      <span>{marketDetails?.industry} ({marketDetails?.country})</span>
      <button
        onClick={() => onRemove(market)}
        className="text-gray-500 hover:text-gray-700 ml-1"
      >
        ×
      </button>
    </div>
  );
}

type Props = {
  params: {
    marketsId: string;
  };
};

export default function MarketsPeersPage({ params }: Props) {
  const [selectedMarkets, setSelectedMarkets] = useState<MarketId[]>(['software_us', 'software_eu', 'semiconductors_us']);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<ComparisonView>('operations');
  const [operationsLayout, setOperationsLayout] = useState<OperationsLayout>('stacked');
  const [momentumPeriod, setMomentumPeriod] = useState<MomentumPeriod>('3M');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get unique countries and industries for filters
  const countries = useMemo(() => {
    return Array.from(new Set(mockMarkets.map(market => market.country)));
  }, []);

  const industries = useMemo(() => {
    return Array.from(new Set(mockMarkets.map(market => market.industry)));
  }, []);

  // Filter markets based on search term and filters
  const filteredMarkets = useMemo(() => {
    return mockMarkets.filter(market => {
      const matchesSearch = 
        market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        market.industry.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCountry = !selectedCountry || market.country === selectedCountry;
      const matchesIndustry = !selectedIndustry || market.industry === selectedIndustry;
      
      return matchesSearch && matchesCountry && matchesIndustry;
    });
  }, [searchTerm, selectedCountry, selectedIndustry]);

  const handleRemoveMarket = (marketToRemove: MarketId) => {
    setSelectedMarkets(prev => prev.filter(m => m !== marketToRemove));
  };

  const handleAddMarket = (marketToAdd: MarketId) => {
    if (!selectedMarkets.includes(marketToAdd)) {
      setSelectedMarkets(prev => [...prev, marketToAdd]);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setSelectedMarkets((markets) => {
        const oldIndex = markets.indexOf(active.id as MarketId);
        const newIndex = markets.indexOf(over.id as MarketId);
        return arrayMove(markets, oldIndex, newIndex);
      });
    }
  };

  const renderOperationsView = () => {
    if (operationsLayout === 'stacked') {
      const aroicData = selectedMarkets.map(market => {
        const marketDetails = mockMarkets.find(m => m.id === market);
        return {
          name: `${marketDetails?.industry} (${marketDetails?.country})`,
          LFY: mockOperationalData.aroic.LFY[market],
          NTM: mockOperationalData.aroic.NTM[market]
        };
      });

      const assetGrowthData = selectedMarkets.map(market => {
        const marketDetails = mockMarkets.find(m => m.id === market);
        return {
          name: `${marketDetails?.industry} (${marketDetails?.country})`,
          LFY: mockOperationalData.assetGrowth.LFY[market],
          NTM: mockOperationalData.assetGrowth.NTM[market]
        };
      });

      return (
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOperationsLayout('sideBySide')}
              className="text-xs"
            >
              Side by Side View
            </Button>
          </div>
          <div className="h-80">
            <h3 className="text-lg font-semibold mb-2">AROIC Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aroicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: any) => [`${value}%`, '']} />
                <Legend />
                <Bar dataKey="LFY" fill="#8884d8" name="LFY AROIC" />
                <Bar dataKey="NTM" fill="#82ca9d" name="NTM AROIC" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-80">
            <h3 className="text-lg font-semibold mb-2">Asset Growth Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: any) => [`${value}%`, '']} />
                <Legend />
                <Bar dataKey="LFY" fill="#8884d8" name="LFY Growth" />
                <Bar dataKey="NTM" fill="#82ca9d" name="NTM Growth" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    } else {
      // Side by side view - show individual charts for all selected markets
      const topMarkets = selectedMarkets;
      
      // Create historical trend data for each market
      const createHistoricalData = (market: MarketId, metric: 'aroic' | 'assetGrowth') => {
        // Create mock historical data points for the selected metric
        const years = Array.from({length: 10}, (_, i) => 2014 + i);
        
        // Base value and growth pattern based on the current LFY value
        const baseValue = metric === 'aroic' 
          ? mockOperationalData.aroic.LFY[market] 
          : mockOperationalData.assetGrowth.LFY[market];
        
        // Generate historical trend with some randomness but following a general upward trend
        return years.map(year => {
          // Calculate a value that generally increases over time but with some fluctuation
          const yearIndex = year - 2014;
          const growthFactor = 0.7 + (yearIndex / 10); // Gradually increases over time
          
          // Add some randomness to create a realistic looking chart
          const randomFactor = 0.85 + (Math.random() * 0.3); // Between 0.85 and 1.15
          
          // Calculate the value for this year
          const value = baseValue * (0.6 + (yearIndex * 0.025 * growthFactor)) * randomFactor;
          
          // For future years (estimates)
          const isEstimate = year > 2023;
          
          return {
            year: year > 2023 ? `FY${year - 2023}` : year.toString(),
            value: parseFloat(value.toFixed(1)),
            isEstimate
          };
        });
      };

      return (
        <div>
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOperationsLayout('stacked')}
              className="text-xs"
            >
              Stacked View
            </Button>
          </div>
          
          <div className={`grid grid-cols-1 ${
            topMarkets.length === 1 ? 'md:grid-cols-1' : 
            topMarkets.length === 2 ? 'md:grid-cols-2' : 
            'md:grid-cols-3'
          } gap-6`}>
            {topMarkets.map(market => {
              const marketDetails = mockMarkets.find(m => m.id === market);
              return (
                <div key={market} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {marketDetails?.industry} ({marketDetails?.country})
                  </h3>
                  
                  <div className="h-60 mb-6">
                    <h4 className="text-sm font-medium mb-2">AROIC Trend</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={createHistoricalData(market, 'aroic')}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value: any) => [`${value}%`, 'AROIC']} />
                        <Bar dataKey="value">
                          {createHistoricalData(market, 'aroic').map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={entry.isEstimate ? '#bfdbfe' : '#6b7280'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="h-60">
                    <h4 className="text-sm font-medium mb-2">Asset Growth Trend</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={createHistoricalData(market, 'assetGrowth')}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value: any) => [`${value}%`, 'Asset Growth']} />
                        <Bar dataKey="value">
                          {createHistoricalData(market, 'assetGrowth').map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={entry.isEstimate ? '#bfdbfe' : '#6b7280'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">AROIC (LFY)</div>
                      <div className="font-bold text-lg">
                        {mockOperationalData.aroic.LFY[market].toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">AROIC (NTM)</div>
                      <div className="font-bold text-lg">
                        {mockOperationalData.aroic.NTM[market].toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Asset Growth (LFY)</div>
                      <div className="font-bold text-lg">
                        {mockOperationalData.assetGrowth.LFY[market].toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Asset Growth (NTM)</div>
                      <div className="font-bold text-lg">
                        {mockOperationalData.assetGrowth.NTM[market].toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderValuationView = () => {
    // Create data for the three valuation metrics
    const createValuationChartData = (metric: 'evEE' | 'evIC' | 'pe') => {
      return mockValuationData[metric].map(dataPoint => {
        const newPoint: any = { date: dataPoint.date };
        selectedMarkets.forEach(market => {
          newPoint[market] = dataPoint[market];
        });
        return newPoint;
      });
    };

    const evEEData = createValuationChartData('evEE');
    const evICData = createValuationChartData('evIC');
    const peData = createValuationChartData('pe');

    // Calculate current values for each selected market
    const currentValues = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        id: market,
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        evEE: mockValuationData.evEE[mockValuationData.evEE.length - 1][market],
        evIC: mockValuationData.evIC[mockValuationData.evIC.length - 1][market],
        pe: mockValuationData.pe[mockValuationData.pe.length - 1][market]
      };
    });

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Current Valuation Metrics Table */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Current Valuation Metrics</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Market</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">EV/EBITDA</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">EV/IC</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">P/E</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentValues.map((market) => (
                  <tr key={market.id}>
                    <td className="py-2 px-3 text-sm text-gray-900 border-b">{market.name}</td>
                    <td className="py-2 px-3 text-sm text-gray-900 text-right border-b">{market.evEE.toFixed(1)}x</td>
                    <td className="py-2 px-3 text-sm text-gray-900 text-right border-b">{market.evIC.toFixed(1)}x</td>
                    <td className="py-2 px-3 text-sm text-gray-900 text-right border-b">{market.pe.toFixed(1)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EV/EBITDA Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">EV/EBITDA Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evEEData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip formatter={(value: any) => `${value.toFixed(1)}x`} />
              <Legend />
              {selectedMarkets.map((market, index) => {
                const marketDetails = mockMarkets.find(m => m.id === market);
                return (
                  <Line
                    key={market}
                    type="monotone"
                    dataKey={market}
                    name={`${marketDetails?.industry} (${marketDetails?.country})`}
                    stroke={`hsl(${index * 45}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EV/IC Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">EV/IC Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evICData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip formatter={(value: any) => `${value.toFixed(1)}x`} />
              <Legend />
              {selectedMarkets.map((market, index) => {
                const marketDetails = mockMarkets.find(m => m.id === market);
                return (
                  <Line
                    key={market}
                    type="monotone"
                    dataKey={market}
                    name={`${marketDetails?.industry} (${marketDetails?.country})`}
                    stroke={`hsl(${index * 45}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* P/E Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">P/E Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={peData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip formatter={(value: any) => `${value.toFixed(1)}x`} />
              <Legend />
              {selectedMarkets.map((market, index) => {
                const marketDetails = mockMarkets.find(m => m.id === market);
                return (
                  <Line
                    key={market}
                    type="monotone"
                    dataKey={market}
                    name={`${marketDetails?.industry} (${marketDetails?.country})`}
                    stroke={`hsl(${index * 45}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMomentumView = () => {
    // Filter share price data based on selected period
    const getFilteredSharePriceData = () => {
      const now = new Date('2023-12-31'); // Use last available data point as reference
      const monthsToShow = momentumPeriod === '1M' ? 1 : 
                          momentumPeriod === '3M' ? 3 :
                          momentumPeriod === '6M' ? 6 : 12; // YTD
      
      const cutoffDate = new Date(now);
      cutoffDate.setMonth(cutoffDate.getMonth() - monthsToShow);
      const cutoffString = cutoffDate.toISOString().slice(0, 7); // YYYY-MM format

      return mockSharePriceData.filter(d => d.date >= cutoffString);
    };

    // Get performance data for the selected period
    const periodPerformance = mockMomentumData.monthlyPerf[momentumPeriod];
    const performanceData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        performance: periodPerformance[market]
      };
    }).sort((a, b) => b.performance - a.performance); // Sort by performance descending

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Period Performance Bar Chart */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Market Performance</h3>
            <div className="flex gap-2">
              {(['1M', '3M', '6M', 'YTD'] as MomentumPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={momentumPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMomentumPeriod(period)}
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 'dataMax + 2']} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value: any) => [`${value}%`, 'Performance']} />
                <Bar dataKey="performance" fill="#3b82f6">
                  {performanceData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={index === 0 ? '#10b981' : index === performanceData.length - 1 ? '#ef4444' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Share Price Performance Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Share Price Performance (Indexed to 100)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={getFilteredSharePriceData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    const [year, month] = date.split('-');
                    return `${month}/${year.slice(2)}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`${value}`, 'Index']}
                  labelFormatter={(date) => {
                    const [year, month] = date.split('-');
                    return `${month}/${year}`;
                  }}
                />
                <Legend />
                {selectedMarkets.map((market, index) => {
                  const marketDetails = mockMarkets.find(m => m.id === market);
                  return (
                    <Line
                      key={market}
                      type="monotone"
                      dataKey={market}
                      name={`${marketDetails?.industry} (${marketDetails?.country})`}
                      stroke={`hsl(${index * 45}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={false}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Performance Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Yearly Performance</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMomentumData.yearlyPerf}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => `${value}%`} />
              <Legend />
              {selectedMarkets.map((market, index) => {
                const marketDetails = mockMarkets.find(m => m.id === market);
                return (
                  <Bar
                    key={market}
                    dataKey={market}
                    name={`${marketDetails?.industry} (${marketDetails?.country})`}
                    fill={`hsl(${index * 45}, 70%, 50%)`}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderGrowthView = () => {
    // Create data for the growth charts
    const revenueGrowthData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        LFY: mockGrowthData.revenue.LFY[market],
        NTM: mockGrowthData.revenue.NTM[market],
        CAGR5Y: mockGrowthData.revenue.CAGR5Y[market]
      };
    });

    const earningsGrowthData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        LFY: mockGrowthData.earnings.LFY[market],
        NTM: mockGrowthData.earnings.NTM[market],
        CAGR5Y: mockGrowthData.earnings.CAGR5Y[market]
      };
    });

    const reinvestmentRateData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        LFY: mockGrowthData.reinvestmentRate.LFY[market],
        NTM: mockGrowthData.reinvestmentRate.NTM[market]
      };
    });

    // Create growth matrix data (Revenue Growth vs Earnings Growth)
    const growthMatrixData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        revenueGrowth: mockGrowthData.revenue.CAGR5Y[market],
        earningsGrowth: mockGrowthData.earnings.CAGR5Y[market],
        reinvestmentRate: mockGrowthData.reinvestmentRate.LFY[market],
        market
      };
    });

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Growth Matrix Scatter Plot */}
        <div className="h-96">
          <h3 className="text-lg font-semibold mb-2">Growth Matrix (5Y CAGR)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="revenueGrowth" 
                name="Revenue Growth" 
                unit="%" 
                domain={['dataMin - 2', 'dataMax + 2']}
                label={{ value: 'Revenue Growth (%)', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="earningsGrowth" 
                name="Earnings Growth" 
                unit="%" 
                domain={['dataMin - 2', 'dataMax + 2']}
                label={{ value: 'Earnings Growth (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: any) => `${value}%`}
              />
              <Legend />
              <Scatter 
                name="Markets" 
                data={growthMatrixData} 
                fill="#8884d8"
              >
                {growthMatrixData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`hsl(${index * 45}, 70%, 50%)`}
                  />
                ))}
              </Scatter>
              {/* Reference line for equal growth */}
              <ReferenceLine
                segment={[
                  { x: 0, y: 0 },
                  { x: 30, y: 30 }
                ]}
                stroke="#666"
                strokeDasharray="3 3"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Growth Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Revenue Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              <Legend />
              <Bar dataKey="LFY" fill="#8884d8" name="LFY Revenue Growth" />
              <Bar dataKey="NTM" fill="#82ca9d" name="NTM Revenue Growth" />
              <Bar dataKey="CAGR5Y" fill="#ffc658" name="5Y CAGR" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Growth Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Earnings Growth</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={earningsGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              <Legend />
              <Bar dataKey="LFY" fill="#8884d8" name="LFY Earnings Growth" />
              <Bar dataKey="NTM" fill="#82ca9d" name="NTM Earnings Growth" />
              <Bar dataKey="CAGR5Y" fill="#ffc658" name="5Y CAGR" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Reinvestment Rate Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Reinvestment Rate</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reinvestmentRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any) => [`${value}%`, '']} />
              <Legend />
              <Bar dataKey="LFY" fill="#8884d8" name="LFY Reinvestment Rate" />
              <Bar dataKey="NTM" fill="#82ca9d" name="NTM Reinvestment Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderRiskView = () => {
    // Create data for the risk charts
    const betaVolatilityData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        beta: mockRiskData.beta[market],
        volatility: mockRiskData.volatility[market]
      };
    });

    const debtData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        debtToEquity: mockRiskData.debtToEquity[market],
        interestCoverage: mockRiskData.interestCoverage[market],
        liquidityRatio: mockRiskData.liquidityRatio[market]
      };
    });

    // Create risk matrix data (Beta vs Debt/Equity)
    const riskMatrixData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        beta: mockRiskData.beta[market],
        debtToEquity: mockRiskData.debtToEquity[market],
        volatility: mockRiskData.volatility[market],
        market
      };
    });

    // Create risk radar data
    const riskRadarData = selectedMarkets.map(market => {
      const marketDetails = mockMarkets.find(m => m.id === market);
      return {
        market,
        name: `${marketDetails?.industry} (${marketDetails?.country})`,
        data: [
          {
            subject: 'Beta',
            A: mockRiskData.beta[market],
            fullMark: 2
          },
          {
            subject: 'Volatility',
            A: mockRiskData.volatility[market] / 30, // Normalize to 0-2 scale
            fullMark: 2
          },
          {
            subject: 'Debt/Equity',
            A: mockRiskData.debtToEquity[market] / 0.75, // Normalize to 0-2 scale
            fullMark: 2
          },
          {
            subject: 'Interest Coverage',
            A: 2 - (mockRiskData.interestCoverage[market] / 15), // Inverse and normalize
            fullMark: 2
          },
          {
            subject: 'Liquidity',
            A: 2 - (mockRiskData.liquidityRatio[market] / 3), // Inverse and normalize
            fullMark: 2
          }
        ]
      };
    });

    return (
      <div className="grid grid-cols-1 gap-6">
        {/* Risk Matrix Scatter Plot */}
        <div className="h-96">
          <h3 className="text-lg font-semibold mb-2">Risk Matrix</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="beta" 
                name="Beta" 
                domain={[0.5, 2]}
                label={{ value: 'Beta', position: 'bottom', offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="debtToEquity" 
                name="Debt/Equity" 
                domain={[0, 'dataMax + 0.2']}
                label={{ value: 'Debt/Equity Ratio', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: any, name: string) => [
                  name === 'beta' ? value.toFixed(2) : value.toFixed(2),
                  name === 'beta' ? 'Beta' : 'Debt/Equity'
                ]}
              />
              <Legend />
              <Scatter 
                name="Markets" 
                data={riskMatrixData} 
                fill="#8884d8"
              >
                {riskMatrixData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`hsl(${index * 45}, 70%, 50%)`}
                  />
                ))}
              </Scatter>
              {/* Reference line for market beta = 1 */}
              <ReferenceLine x={1} stroke="#666" strokeDasharray="3 3" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Beta and Volatility Chart */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Market Risk Metrics</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={betaVolatilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: any, name: string) => [
                name === 'beta' ? value.toFixed(2) : value.toFixed(2),
                name === 'beta' ? 'Beta' : 'Volatility'
              ]} />
              <Legend />
              <Bar yAxisId="left" dataKey="beta" fill="#8884d8" name="Beta" />
              <Line yAxisId="right" type="monotone" dataKey="volatility" stroke="#ff7300" name="Volatility (%)" />
              <ReferenceLine yAxisId="left" y={1} stroke="#666" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Risk Metrics */}
        <div className="h-80">
          <h3 className="text-lg font-semibold mb-2">Financial Risk Metrics</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={debtData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="debtToEquity" fill="#8884d8" name="Debt/Equity" />
              <Bar yAxisId="right" dataKey="interestCoverage" fill="#82ca9d" name="Interest Coverage" />
              <Line yAxisId="left" type="monotone" dataKey="liquidityRatio" stroke="#ff7300" name="Liquidity Ratio" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Radar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskRadarData.map((item) => (
            <div key={item.market} className="h-64 border rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2 text-center">{item.name}</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={item.data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 2]} />
                  <Radar name={item.name} dataKey="A" stroke={`hsl(${riskRadarData.indexOf(item) * 45}, 70%, 50%)`} fill={`hsl(${riskRadarData.indexOf(item) * 45}, 70%, 50%)`} fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Content (9 columns) */}
      <div className="lg:col-span-9 space-y-6">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Market Comparison</h1>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={view === 'operations' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('operations')}
            >
              Operations
            </Button>
            <Button
              variant={view === 'valuation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('valuation')}
            >
              Valuation
            </Button>
            <Button
              variant={view === 'momentum' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('momentum')}
            >
              Momentum
            </Button>
            <Button
              variant={view === 'growth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('growth')}
            >
              Growth
            </Button>
            <Button
              variant={view === 'risk' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('risk')}
            >
              Risk
            </Button>
          </div>
        </div>

        {/* Selected Markets */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Selected Markets</h2>
            <div className="relative" ref={searchRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                Add Market
              </Button>
              
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg z-10">
                  <div className="p-3 border-b">
                    <input
                      type="text"
                      placeholder="Search markets..."
                      className="w-full p-2 border rounded"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <select 
                        className="p-2 border rounded"
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                      >
                        <option value="">All Countries</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      <select 
                        className="p-2 border rounded"
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                      >
                        <option value="">All Industries</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredMarkets.map((market) => (
                      <div
                        key={market.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => {
                          handleAddMarket(market.id);
                          setIsSearchOpen(false);
                        }}
                      >
                        <div>
                          <div>{market.industry}</div>
                          <div className="text-xs text-gray-500">{market.country}</div>
                        </div>
                        {selectedMarkets.includes(market.id) && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={selectedMarkets} strategy={horizontalListSortingStrategy}>
              <div className="flex flex-wrap gap-2">
                {selectedMarkets.map((market) => (
                  <SortableMarketItem
                    key={market}
                    market={market}
                    onRemove={handleRemoveMarket}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Content based on selected view */}
        <div className="bg-white p-4 rounded-lg shadow">
          {view === 'operations' && renderOperationsView()}
          {view === 'valuation' && renderValuationView()}
          {view === 'momentum' && renderMomentumView()}
          {view === 'growth' && renderGrowthView()}
          {view === 'risk' && renderRiskView()}
        </div>
      </div>

      {/* Right Sidebar (3 columns) */}
      <div className="lg:col-span-3">
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Key Industry Metrics</h3>
          <div className="space-y-4">
            {view === 'operations' && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">AROIC (Industry Average)</h4>
                  <p className="text-2xl font-bold">28.5%</p>
                  <p className="text-xs text-gray-500">vs 26.2% last year</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Asset Growth (5Y Avg)</h4>
                  <p className="text-2xl font-bold">12.8%</p>
                  <p className="text-xs text-gray-500">vs 11.5% last 5 years</p>
                </div>
              </>
            )}
            
            {view === 'valuation' && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">EV/EBITDA (Industry Average)</h4>
                  <p className="text-2xl font-bold">18.5x</p>
                  <p className="text-xs text-gray-500">vs 17.2x 5-year average</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">P/E (Industry Average)</h4>
                  <p className="text-2xl font-bold">25.3x</p>
                  <p className="text-xs text-gray-500">vs 22.8x 5-year average</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">EV/IC (Industry Average)</h4>
                  <p className="text-2xl font-bold">22.6x</p>
                  <p className="text-xs text-gray-500">vs 20.5x 5-year average</p>
                </div>
              </>
            )}
            
            {view === 'momentum' && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">YTD Performance</h4>
                  <p className="text-2xl font-bold">+28.5%</p>
                  <p className="text-xs text-gray-500">vs +22.1% benchmark</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">3Y Annualized Return</h4>
                  <p className="text-2xl font-bold">+18.2%</p>
                  <p className="text-xs text-gray-500">vs +15.5% benchmark</p>
                </div>
              </>
            )}

            {view === 'growth' && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Revenue Growth (5Y CAGR)</h4>
                  <p className="text-2xl font-bold">16.8%</p>
                  <p className="text-xs text-gray-500">vs 14.5% previous 5Y</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Earnings Growth (5Y CAGR)</h4>
                  <p className="text-2xl font-bold">19.2%</p>
                  <p className="text-xs text-gray-500">vs 16.8% previous 5Y</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Reinvestment Rate</h4>
                  <p className="text-2xl font-bold">45.5%</p>
                  <p className="text-xs text-gray-500">vs 42.3% 5Y average</p>
                </div>
              </>
            )}
            
            {view === 'risk' && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Average Beta</h4>
                  <p className="text-2xl font-bold">1.28</p>
                  <p className="text-xs text-gray-500">vs 1.15 5Y average</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Volatility</h4>
                  <p className="text-2xl font-bold">22.5%</p>
                  <p className="text-xs text-gray-500">vs 19.8% 5Y average</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Debt/Equity</h4>
                  <p className="text-2xl font-bold">0.48</p>
                  <p className="text-xs text-gray-500">vs 0.52 5Y average</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Valuation History</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">Current</p>
                <p className="font-bold">+15%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">5Y Avg</p>
                <p className="font-bold">+2%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">10Y Avg</p>
                <p className="font-bold">-5%</p>
              </div>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Current valuation is in the 65th percentile of historical range
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 