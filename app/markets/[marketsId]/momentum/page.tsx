'use client';

import { useState } from 'react';
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
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';

// Mock data for charts
const mockMonthlyData = [
  { date: '2021-04', industry: 134.72, benchmark: 4181.17, relative: 0.95 },
  { date: '2021-05', industry: 140.18, benchmark: 4204.11, relative: 0.98 },
  { date: '2021-06', industry: 145.82, benchmark: 4297.50, relative: 1.02 },
  { date: '2021-07', industry: 148.56, benchmark: 4395.26, relative: 0.96 },
  { date: '2021-08', industry: 152.64, benchmark: 4522.68, relative: 0.98 },
  { date: '2021-09', industry: 148.12, benchmark: 4307.54, relative: 1.03 },
  { date: '2021-10', industry: 154.86, benchmark: 4605.38, relative: 0.97 },
  { date: '2021-11', industry: 161.94, benchmark: 4567.00, relative: 1.08 },
  { date: '2021-12', industry: 175.88, benchmark: 4766.18, relative: 1.05 },
  { date: '2022-01', industry: 159.22, benchmark: 4515.55, relative: 1.02 },
  { date: '2022-02', industry: 162.74, benchmark: 4373.94, relative: 1.07 },
  { date: '2022-03', industry: 171.82, benchmark: 4530.41, relative: 1.09 },
  { date: '2022-04', industry: 155.60, benchmark: 4131.93, relative: 1.12 },
  { date: '2022-05', industry: 147.44, benchmark: 4132.15, relative: 1.06 },
  { date: '2022-06', industry: 136.04, benchmark: 3785.38, relative: 1.04 },
  { date: '2022-07', industry: 158.36, benchmark: 4130.29, relative: 1.09 },
  { date: '2022-08', industry: 152.16, benchmark: 3955.00, relative: 1.15 },
  { date: '2022-09', industry: 134.46, benchmark: 3585.62, relative: 1.18 },
  { date: '2022-10', industry: 147.70, benchmark: 3871.98, relative: 1.10 },
  { date: '2022-11', industry: 145.12, benchmark: 4080.11, relative: 1.02 },
  { date: '2022-12', industry: 130.32, benchmark: 3839.50, relative: 1.01 },
  { date: '2023-01', industry: 150.56, benchmark: 4076.60, relative: 1.05 },
  { date: '2023-02', industry: 147.22, benchmark: 3970.15, relative: 1.08 },
  { date: '2023-03', industry: 159.28, benchmark: 4109.31, relative: 1.11 },
  { date: '2023-04', industry: 167.58, benchmark: 4169.48, relative: 1.15 },
  { date: '2023-05', industry: 173.50, benchmark: 4179.83, relative: 1.18 },
  { date: '2023-06', industry: 186.68, benchmark: 4450.38, relative: 1.19 },
  { date: '2023-07', industry: 193.34, benchmark: 4588.96, relative: 1.20 },
  { date: '2023-08', industry: 180.36, benchmark: 4395.99, relative: 1.18 },
  { date: '2023-09', industry: 175.48, benchmark: 4288.05, relative: 1.17 },
  { date: '2023-10', industry: 168.64, benchmark: 4193.80, relative: 1.15 },
  { date: '2023-11', industry: 188.52, benchmark: 4567.80, relative: 1.18 },
  { date: '2023-12', industry: 193.24, benchmark: 4769.83, relative: 1.16 },
  { date: '2024-01', industry: 181.82, benchmark: 4845.65, relative: 1.07 },
  { date: '2024-02', industry: 182.74, benchmark: 5096.27, relative: 1.03 },
  { date: '2024-03', industry: 178.14, benchmark: 5254.35, relative: 0.97 },
];

const mockYearlyData = [
  { year: '2014', return: 38.8, benchmarkReturn: 13.7 },
  { year: '2015', return: -2.2, benchmarkReturn: 1.4 },
  { year: '2016', return: 10.5, benchmarkReturn: 11.9 },
  { year: '2017', return: 42.2, benchmarkReturn: 21.8 },
  { year: '2018', return: -4.4, benchmarkReturn: -4.4 },
  { year: '2019', return: 72.9, benchmarkReturn: 31.5 },
  { year: '2020', return: 76.3, benchmarkReturn: 18.4 },
  { year: '2021', return: 30.6, benchmarkReturn: 28.7 },
  { year: '2022', return: -24.8, benchmarkReturn: -18.1 },
  { year: '2023', return: 44.2, benchmarkReturn: 24.2 },
  { year: '2024 YTD', return: 7.4, benchmarkReturn: 10.2 },
];

const keyStats = [
  { label: '1M Return', value: '+3.2%' },
  { label: '3M Return', value: '+10.8%' },
  { label: '6M Return', value: '+12.4%' },
  { label: 'YTD Return', value: '+7.4%' },
  { label: '1Y Return', value: '+38.1%' },
  { label: '3Y Return', value: '+112.7%' },
  { label: 'Beta (3Y)', value: '1.08' },
  { label: 'Correlation (3Y)', value: '0.78' },
  { label: 'Volatility (3Y)', value: '25.4%' },
  { label: 'Sharpe Ratio (3Y)', value: '1.65' },
];

type Props = {
  params: {
    marketsId: string;
  };
};

export default function MarketsMomentumPage({ params }: Props) {
  const [showRelative, setShowRelative] = useState(false);
  const marketsId = params.marketsId.charAt(0).toUpperCase() + params.marketsId.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content (8 columns) */}
      <div className="lg:col-span-8 lg:border-r lg:pr-8">
        {/* Monthly Performance Chart */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {showRelative ? 'Relative Performance' : 'Price Performance vs Benchmark'}
            </h2>
            <div className="flex gap-2">
              <Button
                variant={!showRelative ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowRelative(false)}
              >
                Absolute
              </Button>
              <Button
                variant={showRelative ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowRelative(true)}
              >
                Relative
              </Button>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {!showRelative ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="industry"
                      name={marketsId}
                      stroke="#2563eb"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="S&P 500"
                      stroke="#64748b"
                      strokeWidth={2}
                    />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey="relative"
                    name="Relative Performance"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Performance Chart */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Annual Performance vs Benchmark</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockYearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar
                  dataKey="return"
                  name={marketsId}
                  fill="#2563eb"
                />
                <Bar
                  dataKey="benchmarkReturn"
                  name="S&P 500"
                  fill="#64748b"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column (4 columns) */}
      <div className="lg:col-span-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
          <div className="space-y-4">
            {keyStats.map((stat) => (
              <div
                key={stat.label}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <span className="text-gray-600">{stat.label}</span>
                <span className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 