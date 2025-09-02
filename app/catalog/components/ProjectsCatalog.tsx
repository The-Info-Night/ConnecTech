"use client";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    id: 1,
    title: "Project 1",
    description: "A fantastic description for project 1.",
    image: "/logo.png",
  },
  {
    id: 2,
    title: "Project 2",
    description: "A short and sweet description for project 2.",
    image: "/next.svg",
  },
  {
    id: 3,
    title: "Project 3",
    description: "A descriptive description for project 3.",
    image: "/vercel.svg",
  },
];

export default function ProjectsCatalog() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">
        Developer Catalog
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            imageSrc={project.image}
          />
        ))}
      </div>
    </div>
  );
}