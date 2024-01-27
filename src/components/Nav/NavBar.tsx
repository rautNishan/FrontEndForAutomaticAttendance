import "./NavStyle.css";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
export default function NavBar() {
  return (
    <>
      <div className="nav">
        <Link to="/" className="site-name">
          Automation
        </Link>
        <ul>
          <CustomLink to="/" name="Home">
            Home
          </CustomLink>
          <CustomLink to="/about" name="About">
            About
          </CustomLink>
          <CustomLink to="/login" name="Login">
            Login
          </CustomLink>
        </ul>
      </div>
    </>
  );
}

type CustomLinkProps = {
  to: string;
  name: string;
  [key: string]: string;
};

function CustomLink({ to, name, ...props }: CustomLinkProps) {
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });
    console.log(isActive);
    
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {name}
      </Link>
    </li>
  );
}
