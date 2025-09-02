import AdminDashboardPage from "./dashboard";
import SideNavbar from "../../components/SideNavbar";

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
