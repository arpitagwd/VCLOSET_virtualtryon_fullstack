// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//     const { user } = useAuth();
//     const location = useLocation();

//     if (!user) {
//         const userConfirmed = window.confirm("You need to log in to access this page. Do you want to log in now?");
//         if (userConfirmed) {
//             return <Navigate to="/login" state={{ from: location }} replace />;
//         } else {
//             return null; // Stay on the current page
//         }
//     }

//     return children;
// };

// // export default ProtectedRoute;
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   const location = useLocation();

//   if (!user) {
//     console.log("User not logged in. Redirecting to login with state:", location.pathname);
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// }

// export default ProtectedRoute;
