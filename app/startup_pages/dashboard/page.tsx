import StartUpDashboardPage from "./dashboard";
import SideNavbar from "../../components/SideNavbar";

export default function DashboardPage() {
  return (
    <div>
      <SideNavbar />
      <section id="startup_dashboard">
        <StartUpDashboardPage />
      </section>
    </div>
  );
}
