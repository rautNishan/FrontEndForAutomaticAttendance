import { useState } from "react";

// import { useNavigate } from "react-router-dom";

import axios from "axios"; // This is the axios library
import customAxios from "../../../apis/axios";
import "./Login.css";

export default function Login({ api, role }: { api: string; role: string }) {
  console.log("THis is Api: ", api);
  let redirectAfterLogin = "";
  switch (role) {
    case "admin":
      redirectAfterLogin = "dash";
      break;
    case "teacher":
      redirectAfterLogin = "profile";
      break;
    case "student":
      redirectAfterLogin = "my-attendance";
      break;
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    try {
      const res = await customAxios.post(api, { email, password });
      localStorage.setItem("token", res.data.data);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
      window.location.href = redirectAfterLogin;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errors = err.response?.data.message;
        if (Array.isArray(errors)) {
          errors.forEach((error: string) => {
            if (error.includes("email")) setEmailError(error);
            if (error.includes("password")) setPasswordError(error);
          });
        } else if (typeof errors === "string") {
          setGeneralError(errors);
        }
      } else {
        setEmailError("An error occurred");
        setPasswordError("An error occurred");
        setGeneralError("An error occurred");
      }
    }
  };

  return (
    <>
      <div className="primary-container">
        <div className="general-error-message">
          {generalError && <p className="error-message">{generalError}</p>}
        </div>
        <div className="login">
          <h1>Login</h1>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              {emailError && <p className="error-message">{emailError}</p>}
              <input
                type="text"
                id="username"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
