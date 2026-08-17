interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
}

export default function StatsCard({ title, value, change, changeType = "neutral", icon }: StatsCardProps) {
  return (
    <div className="bg-surface-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {change && (
          <p className={`mt-1 text-xs font-medium ${
            changeType === "positive" ? "text-accent-600" :
            changeType === "negative" ? "text-red-500" :
            "text-text-muted"
          }`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}
