import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoaderSpinnerProps {
  className?: string;
  message?: string;
}

export default function LoaderSpinner({ className, message = 'Đang tải...' }: LoaderSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center h-full py-8', className)}>
      <Loader2 className="w-6 h-6 animate-spin text-gray-500 mb-2" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
