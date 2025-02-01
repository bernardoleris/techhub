import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Se o usuário acessar `/`, ele será redirecionado para `/register` */}
      <Route path="/" element={<Navigate to="/register" />} />

      {/* Redireciona usuários logados para o dashboard */}
      <Route
        path="/login"
        element={localStorage.getItem("token") ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={localStorage.getItem("token") ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* Rotas protegidas: Apenas usuários logados podem acessar */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
