import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#171515] text-white">
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-2">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.18),transparent_45%)]" />

  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(245,158,11,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.25)_1px,transparent_1px)] [background-size:48px_48px]" />

  <div className="relative z-0 text-center">
    <Image
      src="/images/branding/fabcheck-logo.svg"
      alt="FabCheck"
      width={420}
      height={180}
      priority
      className="mx-auto mb-8 h-auto w-auto max-w-[250px] animate-[fadeIn_.6s_ease]"
    />

    <p className="mx-auto mt-4 max-w-2xl text-lg leading-6 text-white/80 md:text-md">
      Upload your AI-generated concept render for a tradeshow booth or brand activation. 
      FabCheck will analyze your design and provide a realistic fabrication estimate in minutes.
    </p>

        <p className="mx-auto mt-4 max-w-2xl text-xs leading-4 text-white/80 md:text-md">
      FabCheck is intended to provide an early-stage fabrication budget estimate to help 
      with planning. A formal quote will be based on a detailed review of your project's 
      final scope and requirements.
    </p>

    <a
      href="/launch"
      className="mt-10 inline-flex rounded-full bg-[#ffa431] px-10 py-4 text-lg font-black uppercase italic tracking-wide text-black transition hover:scale-105"
    >
      Launch FabCheck
    </a>

  </div>

</section>
    </main>
  );
}