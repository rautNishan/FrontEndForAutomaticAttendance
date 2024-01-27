import { Route, Routes } from "react-router-dom";
import "./index.css";
import Admin from "./components/Admin/Admin";
function App() {
  return (
    <>
      <Routes>
      <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </>
  );
}

export default App;
