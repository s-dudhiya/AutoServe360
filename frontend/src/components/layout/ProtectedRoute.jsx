import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ role, redirectPath = "/login", children }) => {
  // Get user and the new loading state from the context
  const { user, loading } = useAuth();
  const location = useLocation();

  // While the authentication state is loading, don't render anything.
  // This prevents the redirect from happening before we've checked localStorage.
  if (loading) {
    return null; // or a loading spinner component
  }

  // Once loading is false, we can safely check for the user.
  if (!user) {
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
