import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "../common/Auth/Auth";
import LogOut from "../common/LogOut/LogOut";
import NavBar from "../common/Nav/NavBar";
import PageNotFound from "../common/PageNotFound/PageNotFound";
import Home from "../common/home/Home";
import Login from "../common/login/Login";
import "./Admin.css";
import AdminDashBoard from "./sub-components/AdminDashBoard";
import Faculties from "./sub-components/AdminFaculties";
import RegisterStudent from "./sub-components/AdminRegisterStudent";
import RegisterTeacher from "./sub-components/AdminRegisterTeacher";
import Section from "./sub-components/AdminSection";
export default function Admin() {
  const adminLoginApi = "/admin/login";
  const { isLoggedIn, userRole } = useContext(AuthContext);
  return (
    <>
      <header>
        <NavBar isLoggedIn={isLoggedIn} userRole={userRole} />
      </header>

      <div className="container">
        <Routes>
          {!isLoggedIn ? (
            <Route path="/home" element={<Home user="Admin" />} />
          ) : null}
          {isLoggedIn && <Route path="faculty" element={<Faculties />} />}
          {isLoggedIn && <Route path="section" element={<Section />} />}
          {isLoggedIn && <Route path="dash" element={<AdminDashBoard />} />}
          {!isLoggedIn ? (
            <Route
              path="/login"
              element={<Login api={adminLoginApi} role="admin" />}
            />
          ) : null}
          {isLoggedIn && (
            <Route
              path="/register-teacher"
              element={<RegisterTeacher api={"admin/register-teacher"} />}
            />
          )}
          {isLoggedIn && (
            <Route
              path="/register-student"
              element={<RegisterStudent api={"admin/register-student"} />}
            />
          )}

          {isLoggedIn && <Route path="/logout" element={<LogOut />} />}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}
