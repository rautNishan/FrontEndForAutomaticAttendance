import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import customAxios from "../../../../apis/axios";
import { AuthContext } from "../../../common/Auth/Auth";
import "./StudentProfile.css";
interface UserObject {
  college_id: string;
  email: string;
  faculty: string;
  name: string;
  section: string[];
  _id: string;
}
export default function StudentProfile() {
  const token = localStorage.getItem("token");
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [userObject, setUserObject] = useState<UserObject>({
    name: "",
    email: "",
    faculty: "",
    section: [],
    college_id: "",
    _id: "",
  });
  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const getAllSectionsApi = `/student/profile`;
        const response = await customAxios.get(getAllSectionsApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        setUserObject(response.data.data);
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response?.data.message == "JWT EXPIRED"
        ) {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          alert(error.response.data.message);
        }
      }
    };

    fetchPersonalData();
  }, [token, setIsLoggedIn, setUserRole, setUserObject]);

  return (
    <>
      <div className="profile-container">
        <div className="info">
          <h1>
            Name: <span>{userObject.name}</span>
          </h1>
        </div>

        <div className="info">
          <h1>
            Email: <span>{userObject.email}</span>
          </h1>
        </div>
        <div className="info">
          <h1>
            Faculty: <span>{userObject.faculty}</span>
          </h1>
        </div>
        <div className="info">
          <h1>
            Sections: <span>{userObject.section.join(", ")}</span>
          </h1>
        </div>
        <div className="info">
        <h1>
          CollegeID: <span>{userObject.college_id}</span>
        </h1>
        </div>
      </div>
    </>
  );
}
