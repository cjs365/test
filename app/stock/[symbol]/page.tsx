'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    symbol: string;
  };
};

export default function StockRedirectPage({ params }: Props) {
  redirect(`/stock/${params.symbol}/overview`);
} 