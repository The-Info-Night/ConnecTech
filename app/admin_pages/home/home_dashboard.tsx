"use client";
export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-white dark:bg-black">
      <main className="flex flex-col items-center justify-center min-h-[70vh] py-16 ml-0 md:ml-56 transition-all duration-300"
        style={{ marginLeft: "var(--side-navbar-width, 14rem)" }}
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Welcome to Connectech Admin Home Page!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Select a section from the navigation bar to get started.
        </p>
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
