import axios from "axios";
import { useEffect, useState } from "react";
import "./Login.css";

export default function Login({ api }: { api: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(() =>
    JSON.parse(localStorage.getItem("token") || "null")
  );
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    try {
      const res = await axios.post(api, { email, password });
      setToken(res.data);
      window.location.reload()
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
