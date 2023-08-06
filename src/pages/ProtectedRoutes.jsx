import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { LOGIN } from "../config/app-route";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated !== undefined) {
    if (!isAuthenticated) {
      return <Navigate to={LOGIN} />;
    }

    return (
      <div>
        <Outlet />
      </div>
    );
  }
}
