import "./NavStyle.css";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="nav">
      <Link to="" className="site-name">
        Automation
      </Link>
      <ul>
        <CustomLink to="" name="Home" />
        <CustomLink to="about" name="About" />
        <CustomLink to="login" name="Login" />
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
  console.log("This is To : ", to);
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {name}
      </Link>
    </li>
  );
}