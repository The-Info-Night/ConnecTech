import SideNavbar from "../../components/SideNavbar";
import CatalogMessages from "./catalogMessages";

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F18585] via-[#CB90F1] to-[#EED5FB]">
      <SideNavbar />
      <div className="lg:ml-20 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6" style={{ color: "#7A3192" }}>
            Messages
          </h1>
          <CatalogMessages />
        </div>
      </div>
    </div>
  );
}
