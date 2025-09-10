"use client";
import ProjectsCatalog from "./components/ProjectsCatalog";
import SideNavbar from "../../components/SideNavbar";

export default function CatalogHome() {
  return (
    <div
      className="font-sans min-h-screen w-full"
      style={{
        background: `
          linear-gradient(110deg,
            #F18585 0%,
            #F49C9C 10%,
            #F6AEAE 26%,
            #F8CACF 48%,
            #EED5FB 72%,
            #CB90F1 88%,
            #C174F2 100%)
        `,
      }}
    >
      <SideNavbar />
      <main
        className="flex flex-col items-center justify-center min-h-[70vh] w-full py-16 transition-all duration-300"
        style={{ paddingLeft: "var(--side-navbar-width, 14rem)" }}
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
