import SideNavbar from "../../components/SideNavbar";
import CatalogMessages from "./catalogMessages";

export default function MessagesPage() {
  return (
    <div>
      <SideNavbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="text-neutral-500 mt-1">View and manage your conversations.</p>
        </header>
        <section id="messaging">
          <CatalogMessages />
        </section>
      </main>
    </div>
  );
}
