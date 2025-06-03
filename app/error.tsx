'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-gray)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--dark-gray)] mb-4">Something went wrong!</h2>
        <p className="text-[var(--dark-gray)] mb-8">
          We apologize for the inconvenience. Please try again later.
        </p>
        <Button
          onClick={reset}
          className="bg-[var(--button-color)] hover:bg-[var(--accent-color)]"
        >
          Try again
        </Button>
      </div>
    </div>
  );
} 