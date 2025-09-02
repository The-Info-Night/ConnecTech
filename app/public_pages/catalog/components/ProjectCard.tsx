"use client";
import Image from "next/image";

interface ProjectCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

export default function ProjectCard({
  imageSrc,
  title,
  description,
}: ProjectCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105">
      <div className="relative h-48">
        <Image
          src={imageSrc}
          alt={`Image for ${title}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}