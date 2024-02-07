import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import customAxios from "../../../../apis/axios";
import { AuthContext } from "../../../common/Auth/Auth";

interface UserObject {
  college_id: string;
  email: string;
  faculty: string;
  name: string;
  section: string[];
  _id: string;
}
export default function TeacherProfile() {
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
        const getAllSectionsApi = `/teacher/profile`;
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
      <h1>This is Teacher Profile</h1>
      <h1>Name: {userObject.name}</h1>
      <h1>Email: {userObject.email}</h1>
      <h1>Faculty: {userObject.faculty}</h1>
      <h1>Sections: {userObject.section}</h1>
      <h1>CollegeID: {userObject.college_id}</h1>
    </>
  );
}
