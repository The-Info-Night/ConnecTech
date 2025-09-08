import SideNavbar from "../../components/SideNavbar";
import CatalogMessages from "./catalogMessages";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <SideNavbar />
      <main className="flex-1 overflow-auto px-4 py-8">
        <header className="max-w-4xl mx-auto mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-center lg:text-left">Messages</h1>
          <p className="text-neutral-400 mt-1 max-w-md text-center lg:text-left">
            View and manage your conversations.
          </p>
        </header>

        <section id="messaging" className="max-w-4xl mx-auto">
          <CatalogMessages />
        </section>
      </main>
    </div>
  );
}
