import { Navigate } from "react-router-dom";

// Redirect to home page
export default function Index() {
  return <Navigate to="/home" replace />;
}
