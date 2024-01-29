import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import About from "../common/About/About";
import { AuthContext } from "../common/Auth/Auth";
import LogOut from "../common/LogOut/LogOut";
import NavBar from "../common/Nav/NavBar";
import PageNotFound from "../common/PageNotFound/PageNotFound";
import Home from "../common/home/Home";
import Login from "../common/login/Login";
import RegisterTeacher from "./sub-components/AdminRegisterTeacher";

export default function Admin() {
  const adminLoginApi = "http://192.168.1.9:3000/admin/login";
  const { isLoggedIn, setIsLoggedIn, userRole, setUserRole } =
    useContext(AuthContext);

  // const [Update, setUpdate] = useState(0);
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   console.log("This is token: ", token);
  //   if (token) {
  //     const decodedToken = jwtDecode(token);
  //     console.log("This is decoded token: ", decodedToken);
  //     const currentTime = Date.now() / 1000; // Convert to seconds
  //     if (decodedToken.exp) {
  //       if (decodedToken.exp > currentTime) {
  //         setIsLoggedIn(true);
  //       } else {
  //         setIsLoggedIn(false);
  //         localStorage.removeItem("token"); // Remove expired token
  //         setUpdate(Update + 1);
  //       }
  //     }
  //   }
  // }, [Update, setIsLoggedIn]);

  //For LogOut Handling
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");

    // window.location.reload();
  };

  return (
    <>
      <NavBar isLoggedIn={isLoggedIn} userRole={userRole} />
      <div className="container">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />

          {!isLoggedIn ? (
            <Route
              path="/login"
              element={<Login api={adminLoginApi} role="admin" />}
            />
          ) : null}
          {isLoggedIn &&(
            <Route
              path="/register-teacher"
              element={<RegisterTeacher api={"admin/register-teacher"} />}
            />
          )}
          <Route path="/logout" element={<LogOut onLogout={handleLogout} />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}
