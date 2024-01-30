import { useContext } from "react";
import { AuthContext } from "../Auth/Auth";

export default function LogOut() {
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");

    localStorage.removeItem("token");
    window.location.href = "login";
    // localStorage.removeItem("isLoggedIn");
    // localStorage.removeItem("userRole");
    // onLogout();
  };
  return (
    <>
      <button onClick={handleLogout}>Log Out</button>
    </>
  );
}
