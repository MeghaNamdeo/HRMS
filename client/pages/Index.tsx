import { Navigate } from "react-router-dom";

// Index page redirects to the home page
export default function Index() {
  return <Navigate to="/" replace />;
}
