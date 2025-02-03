import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import SupplierDashboard from "./pages/SupplierDashboard/SupplierDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const updateAuthState = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", updateAuthState);
    return () => window.removeEventListener("storage", updateAuthState);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />

      <Route
        path="/login"
        element={
          token
            ? role === "fornecedor"
              ? <Navigate to="/supplier-dashboard" />
              : <Navigate to="/customer-dashboard" />
            : <Login />
        }
      />
      <Route
        path="/register"
        element={
          token
            ? role === "fornecedor"
              ? <Navigate to="/supplier-dashboard" />
              : <Navigate to="/customer-dashboard" />
            : <Register />
        }
      />

      <Route element={<ProtectedRoute role="fornecedor" />}>
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
      </Route>

      <Route element={<ProtectedRoute role="cliente" />}>
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
