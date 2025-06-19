'use client';

import PortfolioLayout from '@/app/components/layout/PortfolioLayout';
import HoldingsTab from '../holdings';

export default function HoldingsPage({ params }: { params: { ticker: string } }) {
  return (
    <PortfolioLayout>
      <HoldingsTab ticker={params.ticker} />
    </PortfolioLayout>
  );
} 