import "./Login.css";
export default function Login() {
  return (
    <>
      <div className="primary-container">
        <div className="login">
          <h1>Login</h1>
          <form className="form-container">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="Enter email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
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
