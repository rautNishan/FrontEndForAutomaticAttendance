import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./NavStyle.css";

export default function NavBar({
  isLoggedIn,
  userRole,
}: {
  isLoggedIn: boolean;
  userRole: string;
}) {
  let rootNav = "home";
  switch (userRole) {
    case "admin":
      rootNav = "dash";
      break;
    case "teacher":
      rootNav = "profile";
      break;
    case "student":
      rootNav = "my-attendance";
      break;
    case "":
      rootNav = "home";
      break;
  }
  return (
    <div className="nav">
      <a href={rootNav} className="site-name">
        AUTOMATION
      </a>
      <ul>
        {!isLoggedIn && <CustomLink to="home" name="Home" />}
        {/* {!isLoggedIn && <CustomLink to="about" name="About" />} */}
        {!isLoggedIn && <CustomLink to="login" name="Login" />}
        {isLoggedIn && userRole === "admin" && (
          <CustomLink to="dash" name="Dashboard" />
        )}
        {isLoggedIn && userRole === "admin" && (
          <CustomLink to="faculty" name="Faculties" />
        )}
        {isLoggedIn && userRole === "admin" && (
          <CustomLink to="section" name="Sections" />
        )}
        {isLoggedIn && userRole === "teacher" && (
          <CustomLink to="profile" name="Profile" />
        )}
        {isLoggedIn && userRole === "teacher" && (
          <CustomLink to="section" name="Sections" />
        )}
        {isLoggedIn && userRole === "admin" && (
          <CustomLink to="register-teacher" name="Register Teacher" />
        )}
        {isLoggedIn && userRole === "admin" && (
          <CustomLink to="register-student" name="Register Student" />
        )}
        {isLoggedIn && userRole === "student" && (
          <CustomLink to="profile" name="Profile" />
        )}
        {isLoggedIn && userRole === "student" && (
          <CustomLink to="my-attendance" name="My-Attendance" />
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

// function CustomLink({ to, name, ...props }: CustomLinkProps) {
//   console.log("This is to: ", to);
//   const resolvePath = useResolvedPath(to);
//   const isActive = useMatch({ path: resolvePath.pathname, end: true });
//   return (
//     <li className={isActive ? "active" : ""}>
//       <a href={to} {...props}>
//         {name}
//       </a>
//     </li>
//   );
// }

function CustomLink({ to, name, ...props }: CustomLinkProps) {
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
