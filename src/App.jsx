import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublicSignPage from "./pages/PublicSignPage";
import SignRequest from "./pages/SignRequest";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <>
    <Navbar />
    <Routes>
       
      <Route path="/" element={<Navigate to={isAuth ? "/dashboard" : "/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/sign/:docId" element={<PublicSignPage />} />

      <Route path="/request-sign" element={<SignRequest />} />
    </Routes>
    </>
    
  );
}

export default App;
