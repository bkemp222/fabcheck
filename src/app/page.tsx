import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#171515] text-white">
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.18),transparent_45%)]" />

  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(245,158,11,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.25)_1px,transparent_1px)] [background-size:48px_48px]" />

  <div className="relative z-10 text-center">
    <Image
      src="/images/branding/fabcheck-logo.svg"
      alt="FabCheck"
      width={420}
      height={180}
      priority
      className="mx-auto mb-10 h-auto w-full max-w-[800px] animate-[fadeIn_.6s_ease]"
    />

    <p className="mt-6 text-xl font-bold uppercase tracking-[0.18em] text-white md:text-2xl">
      From <span className="text-orange-400">Imagination</span> to{" "}
      <span className="text-orange-400">Fabrication</span>
    </p>

    <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/80 md:text-md">
      Upload your renderings, AI concepts, brand assets, or design files.
      FabCheck turns your vision into a fabrication-ready project built,
      delivered, and installed by Get Up Creative.
    </p>

    <a
      href="/launch"
      className="mt-10 inline-flex rounded-full bg-orange-400 px-10 py-4 text-lg font-black uppercase italic tracking-wide text-black transition hover:scale-105"
    >
      Launch FabCheck
    </a>

  </div>

</section>
    </main>
  );
}