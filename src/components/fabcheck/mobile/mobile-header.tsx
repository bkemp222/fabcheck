"use client";

type MobileHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function MobileHeader({
  title,
  subtitle,
  action,
}: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-30 border-b border-black/5 bg-[#F5F2EC]/90 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          {subtitle && (
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
              {subtitle}
            </p>
          )}

          <h1 className="mt-1 text-4xl font-black italic uppercase">
            {title}
          </h1>
        </div>

        {action}
      </div>
    </div>
  );
}