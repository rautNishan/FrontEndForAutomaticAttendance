import { Route, Routes } from "react-router-dom";
import Admin from "./components/Admin/Admin";
import Teacher from "./components/Teacher/Teacher";
import { AuthProvider } from "./components/common/Auth/Auth";
import "./index.css";
import PageNotFound from "./components/common/PageNotFound/PageNotFound";
function App() {
  const userRole = localStorage.getItem("userRole");
  console.log("This is userRole in App: ", userRole);

  return (
    <>
      <AuthProvider>
        <Routes>
          {userRole === "admin" || userRole === "" ? (
            <Route path="/admin/*" element={<Admin />} />
          ) : (
            <Route path="/admin/*" element={<PageNotFound />} />
          )}
          {userRole === "teacher" || userRole === "" ? (
            <Route path="/teacher/*" element={<Teacher />} />
          ) : (
            <Route path="/teacher/*" element={<PageNotFound />} />
          )}
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
