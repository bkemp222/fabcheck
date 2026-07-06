type PackageCardProps = {
  label: string;
  value: string;
};

export function PackageCard({ label, value }: PackageCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
      <p className="mt-1 font-bold text-white/80">{value}</p>
    </div>
  );
}