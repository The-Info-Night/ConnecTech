import SideNavbar from "../../components/SideNavbar";
import CatalogMessages from "./catalogMessages";

export default function MessagesPage() {
  return (
    <div
      className="min-h-screen w-full flex font-sans"
      style={{
        background:
          "linear-gradient(180deg, #F18585 0%, #F49C9C 18%, #F6AEAE 34%, #F8CACF 50%, #EED5FB 56%, #E4BEF8 72%, #D5A8F2 85%, #CB90F1 94%, #C174F2 100%)",
      }}
    >
      <SideNavbar />
      <main className="flex-1 overflow-auto px-4 py-8">
        <header className="max-w-4xl mx-auto mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#7A3192] text-center lg:text-left drop-shadow-lg">
            Messages
          </h1>
          <p className="text-[#b358ed] mt-1 max-w-md text-center lg:text-left">
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
