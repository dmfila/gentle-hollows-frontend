// @material-ui/icons
import DashboardIcon from "@material-ui/icons/Dashboard";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

// core components/views for Admin layout
import Dashboard from "components/Dashboard";
import Connected from "components/Connected";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: DashboardIcon,
    component: Dashboard
  },
  {
    path: "/connected",
    name: "Connected",
    icon: LibraryBooksIcon,
    component: Connected
  }
];

export default dashboardRoutes;
