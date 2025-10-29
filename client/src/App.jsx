// RIGHT
import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OTP from "./pages/OTP";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OTP />} />
    </Routes>
  );
}

export default App;
