'use client';

interface ConfidenceIndicatorProps {
  type: 'confidence' | 'completeness';
  value: number;
  label: string;
}

export default function ConfidenceIndicator({ value, label }: ConfidenceIndicatorProps) {
  const getColorClass = (value: number) => {
    if (value >= 80) return 'confidence-high';
    if (value >= 60) return 'confidence-medium';
    return 'confidence-low';
  };

  const getIcon = (value: number) => {
    if (value >= 80) return '🟢';
    if (value >= 60) return '🟡';
    return '🔴';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getColorClass(value)}`}>
        <span className="flex items-center space-x-1">
          <span>{getIcon(value)}</span>
          <span>{value}%</span>
        </span>
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
