"use client";

import { useEffect, useState } from "react";
import { PrintPackage } from "@/components/fabcheck/print-package";
import type { Project } from "@/types/project";

type PrintData = {
  project: Project;
  progress: number;
};

export default function PrintPage() {
  const [printData, setPrintData] = useState<PrintData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fabcheck-print-project");

    if (!saved) return;

    setPrintData(JSON.parse(saved));
  }, []);

  if (!printData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-black">
        <p className="font-bold">No FabCheck package found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <PrintPackage
        project={printData.project}
        progress={printData.progress}
        setIsPrintMode={() => {
          window.close();
        }}
      />
    </main>
  );
}