import AdminDashboardPage from "./dashboard";
import SideNavbar from "../../components/SideNavbar";
import Charts from "./test";

export default function DashboardPage() {
  return (
    <div>
      <SideNavbar />
      <section id="admin_dashboard">
        <AdminDashboardPage />
      </section>
    </div>
  );
}