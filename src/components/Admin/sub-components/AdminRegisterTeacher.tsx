import { useContext, useEffect, useState } from "react";
import customAxios from "../../../apis/axios";
import { AuthContext } from "../../common/Auth/Auth";
import axios, { AxiosError } from "axios";
import {
  faCirclePlus,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./css/Faculty.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TeacherDataModal from "./PopUpModal/AdminRegisterModal";
import ConfirmModal from "../../common/Modal/ConfirmModel";
interface ITeacher {
  _id?: string;
  name: string;
  faculty: string;
  email: string;
  password: string;
}
// interface ITeacherDelete {
//   _id?: string;
//   name: string;
// }
interface ITeacherRegisterData {
  name: string;
  faculty: string;
  email: string;
  password: string;
}
export default function RegisterTeacher({ api }: { api: string }) {
  const token = localStorage.getItem("token");
  const [teacherList, setTeacherList] = useState<ITeacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null || "");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDeleteModel, setIsDeleteModalOpen] = useState(false);

  const [isTeacherModelComponentOpen, setIsTeacherModelComponentOpen] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  console.log(api);

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

  //Closing Model
  const closeModel = () => {
    setSelectedTeacher(null);
    setIsTeacherModelComponentOpen(false);
    setIsDeleteModalOpen(false);
  };

  //Add Teacher
  const addTeacher = () => {
    console.log("Add Teacher Called");
    setIsUpdate(false);
    setIsTeacherModelComponentOpen(true);
  };

  //Handel Register
  const handelTeacherRegister = async (teacher: ITeacherRegisterData) => {
    const token = localStorage.getItem("token");
    teacher.faculty = teacher.faculty.toUpperCase();
    const apiToRegisterTeacher = "/admin/register-teacher";
    try {
      const response = await customAxios.post(apiToRegisterTeacher, teacher, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("This is response: ", response.data);
      setIsTeacherModelComponentOpen(false);
      window.location.href = "register-teacher";
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.data.message == "JWT EXPIRED") {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          setIsTeacherModelComponentOpen(false);
        }
        setErrorMessage(error.response.data.message);
        setIsTeacherModelComponentOpen(false);
      }
    }
  };

  //Delete
  const handleDelete = (teacher: ITeacher) => {
    setSelectedTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTeacher = async () => {
    const id = selectedTeacher?._id;
    try {
      const response = await customAxios.delete(`/admin/delete-teacher/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("This is Response: ", response.data);
      setIsDeleteModalOpen(false);
      window.location.href = "register-teacher";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message == "JWT EXPIRED") {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
        const responseToBeSent = error.response?.data.message;
        setErrorMessage(responseToBeSent);
        setIsDeleteModalOpen(false);
      }
    }
  };

  //Edit
  const handleEdit = (teacher: ITeacher) => {
    setIsUpdate(true);
    setSelectedTeacher(teacher);
    setIsTeacherModelComponentOpen(true);
  };

  //Save
  const handleSave = async (incomingData: ITeacher) => {
    console.log("This is Incoming Data: ", incomingData);
    console.log("This is Selected Teacher: ", selectedTeacher?._id);
    incomingData.faculty = incomingData.faculty.toUpperCase();
    const apiToUpdateTeacher = `/admin/update-teacher/${selectedTeacher?._id}`;
    try {
      const response = await customAxios.patch(
        apiToUpdateTeacher,
        incomingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("This is response: ", response.data);
      setSuccessMessage("Success");
      setIsTeacherModelComponentOpen(false);
      setTimeout(() => {
        window.location.href = "register-teacher";
      }, 1200);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message == "JWT EXPIRED") {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
        const responseToBeSent = error.response?.data.message;
        setErrorMessage(responseToBeSent);
        setIsTeacherModelComponentOpen(false);
      }
    }
  };

  //Return
  return (
    <>
      <div className="table_container">
        {errorMessage && (
          <div className="error_container">
            <div className="error_message">
              {/* <p>{errorMessage}</p> */}
              <strong>{errorMessage}</strong>
            </div>

            <button
              className="close_button"
              onClick={() => {
                setErrorMessage(null);
                window.location.href = "register-teacher";
              }}
            >
              <span>&times;</span>
            </button>
          </div>
        )}

        {successMessage && (
          <div className="success_container">
            <div className="success_message">
              {/* <p>{errorMessage}</p> */}
              <strong>{successMessage}</strong>
            </div>
          </div>
        )}
        <div className="table">
          <div className="table_header">
            <p className="title">Register Teacher</p>
            <div className="sub_header">
              {/* <p>Filter By</p> */}
              <div className="filter-by">
                <p>Filter By</p>
                <select>
                  <option value="All">All</option>
                  <option value="Computing">Computing</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>
              <button
                title="Register Teacher"
                className="add_new"
                onClick={addTeacher}
              >
                <FontAwesomeIcon className="add-icon" icon={faCirclePlus} />
                Register Teacher
              </button>
            </div>
          </div>
          <div className="table_body">
            <table>
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Faculty</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teacherList.map((teacher) => (
                  <tr key={teacher.name}>
                    {/* key={faculty.name} */}
                    <td>
                      <strong>{teacher.name}</strong>
                    </td>
                    <td>
                      {" "}
                      <strong>{teacher.faculty}</strong>
                    </td>
                    <td>
                      <strong>{teacher.email}</strong>
                    </td>
                    {/* <td>{faculty.teacherCount}</td> 
                  <td>{faculty.studentCount}</td>  */}
                    <td>
                      <button
                        className="edit_button"
                        title="Edit Faculty"
                        onClick={() =>
                          handleEdit({
                            _id: teacher._id,
                            name: teacher.name,
                            faculty: teacher.faculty,
                            email: teacher.email,
                            password: "",
                          })
                        }
                      >
                        <FontAwesomeIcon className="icon" icon={faEdit} />
                      </button>
                      <button
                        title="Delete Teacher"
                        className="delete_button"
                        onClick={() =>
                          handleDelete({
                            name: teacher.name,
                            _id: teacher._id,
                            faculty: teacher.faculty,
                            email: teacher.email,
                            password: "",
                          })
                        }
                      >
                        <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isTeacherModelComponentOpen && <div className="modal-backdrop" />}
      {isTeacherModelComponentOpen && (
        <TeacherDataModal
          onClose={closeModel}
          onSave={isUpdate ? handleSave : handelTeacherRegister}
          isUpdate={isUpdate}
          initialData={isUpdate ? selectedTeacher : null}
        />
      )}

      {isDeleteModel && <div className="modal-backdrop" />}
      {isDeleteModel && selectedTeacher && (
        <ConfirmModal
          data={selectedTeacher}
          onClose={() => setIsDeleteModalOpen(false)}
          onSave={handleDeleteTeacher}
        />
      )}
    </>
  );
}
