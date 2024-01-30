import { useContext, useEffect, useState } from "react";
import customAxios from "../../../apis/axios";
import { AuthContext } from "../../common/Auth/Auth";
import { AxiosError } from "axios";

interface Teacher {
  name: string;
}

export default function RegisterTeacher({ api }: { api: string }) {
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  console.log("teacherList", api);
  useEffect(() => {
    const listAllTeacherApi = "/admin/get-all-teacher";
    const token = localStorage.getItem("token");
    console.log("This is token: ", token);
    const fetchTeachers = async () => {
      try {
        const response = await customAxios.get(listAllTeacherApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("This is response", response.data.data);

        setTeacherList(response.data.data);
      } catch (error) {
        setUserRole("");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        if (error instanceof AxiosError && error.response) {
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
