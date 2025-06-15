'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketsRedirect({ 
  params 
}: { 
  params: { marketsId: string } 
}) {
  const router = useRouter();
  const marketsId = params.marketsId;

  useEffect(() => {
    router.replace(`/markets/${marketsId}/overview`);
  }, [router, marketsId]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting to overview...</p>
      </div>
    </div>
  );
} 