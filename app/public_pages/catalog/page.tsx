"use client";
import Image from "next/image";
import { useState } from "react";
import ProjectsCatalog from "./components/ProjectsCatalog";
import SideNavbar from "../../components/SideNavbar";

export default function catalog_home() {
  return (
    <div className="font-sans min-h-screen" style={{ backgroundColor: "#1A1D21" }}>
      <SideNavbar />
      {/* Main content placeholder */}
      <main className="flex flex-col items-center justify-center min-h-[70vh] py-16 ml-0 md:ml-56 transition-all duration-300"
      style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
      >
      <ProjectsCatalog />
      </main>
      <style jsx global>{`
      @media (min-width: 768px) {
        :root {
        --side-navbar-width: 14rem;
        }
      }
      @media (max-width: 767px) {
        :root {
        --side-navbar-width: 4rem;
        }
      }
      `}</style>
    </div>
  );
}
