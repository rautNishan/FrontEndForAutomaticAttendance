import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "../common/Auth/Auth";
import LogOut from "../common/LogOut/LogOut";
import NavBar from "../common/Nav/NavBar";
import PageNotFound from "../common/PageNotFound/PageNotFound";
import Home from "../common/home/Home";
import Login from "../common/login/Login";
import TeacherProfile from "./sub-components/profile/TeacherProfile";

export default function Teacher() {
  const adminLoginApi = "/teacher/login";
  const { userRole, isLoggedIn } = useContext(AuthContext);
  // const { isLoggedIn, setIsLoggedIn, setUserRole } = useContext(AuthContext);
  // useEffect(() => {
  //   const verifyToken = async () => {
  //     const token = localStorage.getItem("token");
  //     console.log("token", token);
  //     if (token) {
  //       try {
  //         const response = await customAxios.get("/auth/verify", {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });
  //         if (response.data.valid) {
  //           setIsLoggedIn(true);
  //         } else {
  //           console.log("Invalid token", response.data.message);

  //           setIsLoggedIn(false);
  //           setUserRole("");
  //           localStorage.removeItem("token");
  //           if (response.data.message) {
  //             alert(response.data.message);
  //           }
  //           window.location.href = "login";
  //         }
  //       } catch (error) {
  //         console.error("Error during token verification:", error);
  //       }
  //     }
  //   };

  //   verifyToken();
  // }, [setIsLoggedIn, setUserRole]);

  //For LogOut Handling
  // const handleLogout = () => {
  //   setIsLoggedIn(false);
  //   setUserRole("");
  //   // window.location.reload();
  // };

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} userRole={userRole} />
      <div className="container">
        <Routes>
          {!isLoggedIn ? (
            <Route path="/home" element={<Home user="Teacher" />} />
          ) : null}
          {isLoggedIn && <Route path="/profile" element={<TeacherProfile />} />}
          {!isLoggedIn ? (
            <Route
              path="/login"
              element={<Login api={adminLoginApi} role="teacher" />}
            />
          ) : null}
          <Route path="/logout" element={<LogOut />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}
