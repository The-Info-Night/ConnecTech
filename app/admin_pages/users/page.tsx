import SideNavbar from "../../components/SideNavbar";
import UsersAdminPage from "./users";

export default function AdminUsersPage() {
  return (
    <div>
      <SideNavbar />
      <section id="admin_users">
        <UsersAdminPage />
      </section>
    </div>
  );
}


