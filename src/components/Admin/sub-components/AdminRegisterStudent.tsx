import { useContext, useEffect, useState } from "react";
import customAxios from "../../../apis/axios";
import { AuthContext } from "../../common/Auth/Auth";
import { AxiosError } from "axios";

interface IStudent {
  name: string;
}

export default function RegisterStudent({ api }: { api: string }) {
  const [teacherList, setTeacherList] = useState<IStudent[]>([]);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  console.log("teacherList", api);
  useEffect(() => {
    const listAllTeacherApi = "/admin/get-all-student";
    const token = localStorage.getItem("token");
    const fetchTeachers = async () => {
      try {
        const response = await customAxios.get(listAllTeacherApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("This is response of Students", response.data.data);
        setTeacherList(response.data.data);
      } catch (error) {
        if (
          error instanceof AxiosError &&
          error.response?.data.message == "jwt expired"
        ) {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          alert(error.response.data.message);
        }
      }
    };

    fetchTeachers();
  }, [setUserRole, setIsLoggedIn]);

  return (
    <>
      <h1>Register Teacher Page</h1>
      {teacherList.map((teacher, index) => (
        <div key={index}>
          <p>{teacher.name}</p>
          {/* Display other teacher properties as needed */}
        </div>
      ))}
    </>
  );
}
