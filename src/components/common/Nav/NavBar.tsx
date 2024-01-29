import { useMatch, useResolvedPath } from "react-router-dom";
import "./NavStyle.css";

export default function NavBar({
  isLoggedIn,
  userRole,
}: {
  isLoggedIn: boolean;
  userRole: string;
}) {
  console.log("This is userRole NAV: ", userRole);
  console.log("This is isLoggedIn NAV: ", isLoggedIn);
  return (
    <div className="nav">
      <a href="home" className="site-name">
        Automation
      </a>
      <ul>
        <CustomLink to="home" name="Home" />
        <CustomLink to="about" name="About" />

        {!isLoggedIn && <CustomLink to="login" name="Login" />}
        {isLoggedIn && userRole === "admin" && (
          <CustomLink to="register-teacher" name="Register Teacher" />
        )}
        {isLoggedIn && userRole === "teacher" && (
          <CustomLink to="register-teacher" name="Register Student" />
        )}
        {isLoggedIn && <CustomLink to="logout" name="Logout" />}
      </ul>
    </div>
  );
}

type CustomLinkProps = {
  to: string;
  name: string;
  [key: string]: string;
};

function CustomLink({ to, name, ...props }: CustomLinkProps) {
  console.log("This is to: ", to);
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <a href={to} {...props}>
        {name}
      </a>
    </li>
  );
}
