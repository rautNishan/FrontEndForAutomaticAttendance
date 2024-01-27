import About from "./components/About/About";
import NavBar from "./components/Nav/NavBar";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Home from "./components/home/Home";
import Login from "./components/login/Login";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
