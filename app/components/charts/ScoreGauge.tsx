'use client';

type ScoreGaugeProps = {
  score: number;  // 0-100
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function ScoreGauge({ score, label, size = 'md' }: ScoreGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'h-1 text-xs';
      case 'lg':
        return 'h-2 text-sm';
      default:
        return 'h-1.5 text-xs';
    }
  };

  const sizeClasses = getSizeClasses(size);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className={`font-medium ${sizeClasses}`}>{label}</span>
        <span className={`font-mono ${sizeClasses}`}>{score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`${getColor(score)} rounded-full ${sizeClasses}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
} 