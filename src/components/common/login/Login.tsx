import "./Login.css";
export default function Login({ api }: { api: string }) {
  console.log("This is API : ", api); 
  return (
    <>
      <div className="primary-container">
        <div className="login">
          <h1>Login</h1>
          <form className="form-container">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="text" id="username" placeholder="Enter email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter password"
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
