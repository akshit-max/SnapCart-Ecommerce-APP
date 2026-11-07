import Layout from "./Layout";
import AdminMenu from "./AdminMenu";
import UserMenu from "./UserMenu";

// sidebar + content layout shared by all dashboard pages
const DashboardLayout = ({ title, admin = false, children }) => {
  return (
    <Layout title={title}>
      <div className="container py-3">
        <div className="row g-4">
          <div className="col-md-3">{admin ? <AdminMenu /> : <UserMenu />}</div>
          <div className="col-md-9">{children}</div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardLayout;
