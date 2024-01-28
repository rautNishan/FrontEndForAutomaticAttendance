import { Route, Routes } from "react-router-dom";
import NavBar from "../common/Nav/NavBar";
import Home from "../common/home/Home";
import About from "../common/About/About";
import Login from "../common/login/Login";
import PageNotFound from "../common/PageNotFound/PageNotFound";
import RegisterTeacher from "./sub-components/AdminRegisterTeacher";
import { useEffect, useState } from "react";
import LogOut from "../common/LogOut/LogOut";

export default function Admin() {
  const adminLoginApi = "http://192.168.1.9:3000/admin/login";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userRole = "admin";
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // window.location.reload();
    }
  }, []);
  const handleLogout = () => {
    setIsLoggedIn(false);
    // window.location.reload();
  };
  
  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} userRole={userRole} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login api={adminLoginApi} />} />
          <Route path="/register-teacher" element={<RegisterTeacher />} />
          <Route path="/logout" element={<LogOut onLogout={handleLogout} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}
