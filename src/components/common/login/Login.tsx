import axios from "axios";
import "./Login.css";
import { useState } from "react";
export default function Login({ api }: { api: string }) {
  console.log("This is Api", api);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log("This is Email and Password: ", email, password);
      console.log("This is Api: ", api);

      const response = await axios.post(api, { email, password });
      console.log("This is Response Data: ", response.data);
    } catch (error) {
      console.error("This is error: ", error);
    }
  };
  return (
    <>
      <div className="primary-container">
        <div className="login">
          <h1>Login</h1>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="username"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
