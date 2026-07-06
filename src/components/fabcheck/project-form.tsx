import type { Project } from "@/types/project";

type ProjectFormProps = {
  project: Project;
  updateProject: <K extends keyof Project>(key: K, value: Project[K]) => void;
  goToAssets: () => void;
};

export function ProjectForm({
  project,
  updateProject,
  goToAssets,
}: ProjectFormProps) {
  return (
    <div className="mx-auto mt-10 max-w-4xl space-y-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-black">Contact Information</h2>

        <p className="mt-2 text-zinc-500">
          Who should our production team contact if there are questions?
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-zinc-700">
              Contact Name
            </label>
            <input
              value={project.contactName}
              onChange={(e) => updateProject("contactName", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
              placeholder="Name"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-zinc-700">Email</label>
            <input
              type="email"
              value={project.contactEmail}
              onChange={(e) => updateProject("contactEmail", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
              placeholder="email@company.com"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-zinc-700">
              Phone Number
            </label>
            <input
              value={project.contactPhone}
              onChange={(e) => updateProject("contactPhone", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
              placeholder="(555) 555-5555"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-black">Project Information</h2>

        <p className="mt-2 text-zinc-500">
          Give your FabCheck package a name and tell us a little about the
          project.
        </p>

        <form className="mt-8 grid gap-6">
          <div>
            <label className="text-sm font-bold text-zinc-700">
              Project Name
            </label>
            <input
              value={project.name}
              onChange={(e) => updateProject("name", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
              placeholder="Ex: CES Booth, Product Launch Wall..."
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-zinc-700">
                Company
              </label>
              <input
                value={project.company}
                onChange={(e) => updateProject("company", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
                placeholder="Company / brand name"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-700">
                Event Type
              </label>
              <select
                value={project.eventType}
                onChange={(e) => updateProject("eventType", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
              >
                <option>Trade Show Booth</option>
                <option>Scenic Backdrop</option>
                <option>Brand Activation</option>
                <option>Retail Display</option>
                <option>Photo Moment</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold text-zinc-700">
                Event City / Venue
              </label>
              <input
                value={project.venue}
                onChange={(e) => updateProject("venue", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
                placeholder="Atlanta, GA / GWCC"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-700">
                Target Budget
              </label>
              <select
                value={project.budget}
                onChange={(e) => updateProject("budget", e.target.value)}
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-900 outline-none focus:border-orange-400"
              >
                <option>Not sure yet</option>
                <option>Under $10k</option>
                <option>$10k–$25k</option>
                <option>$25k–$50k</option>
                <option>$50k+</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              Changes update your FabCheck package automatically.
            </p>

            <button
              type="button"
              onClick={goToAssets}
              className="rounded-full bg-orange-400 px-8 py-4 font-black uppercase italic text-black transition hover:scale-105 hover:bg-orange-300"
            >
              Upload Assets →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}