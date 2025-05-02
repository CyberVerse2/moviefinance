import { ProjectCard } from "@/app/components/project-card"
import { projects } from "@/data/projects"

export default function Home() {
  // Remove unused variables

  return (
    <div>
      <div className="p-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <span className="bg-red-600 h-5 w-1 rounded mr-2 shadow-stacked-sm"></span>
            Discover Projects
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
