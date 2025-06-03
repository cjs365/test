import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-gray)]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[var(--dark-gray)] mb-4">Page Not Found</h2>
        <p className="text-[var(--dark-gray)] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-[var(--button-color)] hover:bg-[var(--accent-color)]">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
} 