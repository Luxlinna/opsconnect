import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Guide from "../pages/guide/page";
import Partners from "../pages/partners/page";
import Contact from "../pages/contact/page";
import Dashboard from "../pages/dashboard/page";
import PartnerProfile from "../pages/partner-profile/page";
import Demo from "../pages/demo/page";
import Login from "../pages/login/page";
import Register from "../pages/register/page";
import ForgotPassword from "../pages/forgot-password/page";
import ResetPassword from "../pages/reset-password/page";
import AdminDashboard from "../pages/admin/page";
import AuthGuard from "../components/feature/AuthGuard";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/demo", element: <Demo /> },
  { path: "/guide", element: <Guide /> },
  { path: "/contact", element: <Contact /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  {
    path: "/dashboard",
    element: <AuthGuard><Dashboard /></AuthGuard>,
  },
  {
    path: "/partner-profile",
    element: <AuthGuard><PartnerProfile /></AuthGuard>,
  },
  {
    path: "/partners",
    element: <AuthGuard><Partners /></AuthGuard>,
  },
  {
    path: "/admin",
    element: <AuthGuard require="admin"><AdminDashboard /></AuthGuard>,
  },
  { path: "*", element: <NotFound /> },
];

export default routes;
