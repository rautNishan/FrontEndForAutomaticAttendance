import { Route, Routes } from "react-router-dom";
import NavBar from "../common/Nav/NavBar";
import Home from "../common/home/Home";
import About from "../common/About/About";
import Login from "../common/login/Login";
import PageNotFound from "../common/PageNotFound/PageNotFound";

export default function Admin() {
  return (
    <>
      <NavBar/>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login api='hero/admin/login'/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}