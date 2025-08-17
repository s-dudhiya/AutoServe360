import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook

const ProtectedRoute = ({ role, redirectPath = "/login", children }) => {
  const { user } = useAuth(); // Get user from the central context
  const location = useLocation();

  // 1. Check if the user is logged in at all
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after a
    // successful login.
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  // 2. Check if the logged-in user has the required role
  if (user.role !== role) {
    // If the role doesn't match, you can redirect to a generic
    // "unauthorized" page or back to the login page.
    return <Navigate to={redirectPath} replace />;
  }

  // If the user is authenticated and has the correct role, render the children.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
