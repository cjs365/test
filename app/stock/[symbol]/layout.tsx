'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function StockLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { symbol: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const symbol = params.symbol.toLowerCase();

  useEffect(() => {
    // Redirect only on exact match to avoid unnecessary redirects
    if (pathname === `/stock/${symbol}`) {
      // Use replace to avoid adding to browser history
      router.replace(`/stock/${symbol}/overview`, { scroll: false });
    }
  }, [pathname, router, symbol]);

  return <>{children}</>;
} 