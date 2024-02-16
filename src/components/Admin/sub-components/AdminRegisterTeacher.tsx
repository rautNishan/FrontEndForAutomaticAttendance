import {
  faCirclePlus,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import customAxios from "../../../apis/axios";
import { AuthContext } from "../../common/Auth/Auth";
import ConfirmModal from "../../common/Modal/ConfirmModel";
import TeacherDataModal from "./PopUpModal/AdminTeacherRegisterModal";
import "./css/Faculty.css";
interface ITeacher {
  _id?: string;
  name: string;
  college_id: string;
  faculty: string;
  email: string;
  password: string;
}
// interface ITeacherDelete {
//   _id?: string;
//   name: string;
// }
interface ITeacherRegisterData {
  _id?: string;
  name: string;
  college_id: string;
  faculty: string;
  email: string;
  password: string;
}
export default function RegisterTeacher({ api }: { api: string }) {
  console.log("This is API: ", api);
  const token = localStorage.getItem("token");
  const [teacherList, setTeacherList] = useState<ITeacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null || "");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDeleteModel, setIsDeleteModalOpen] = useState(false);
  const [searchValues, setSearchValues] = useState(null || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const teachersPerPage = 5;

  const [isTeacherModelComponentOpen, setIsTeacherModelComponentOpen] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("" || null);

  useEffect(() => {
    const listAllTeacherApi = `/admin/get-all-teacher?page=${currentPage}`;
    const token = localStorage.getItem("token");
    console.log("This is List All Teacher Api: ", listAllTeacherApi);
    const fetchTeachers = async () => {
      try {
        const response = await customAxios.get(listAllTeacherApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(
          "Total Count of Teacher from Response:",
          response.data.data.totalCount
        );
        setTotalTeachers(response.data.data.totalCount);
        console.log("This is Response: ", response.data.data.teachers);
        setTeacherList(response.data.data.teachers);
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
  }, [setUserRole, setIsLoggedIn, currentPage, setTotalTeachers]);

  // Search teachers when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const searchTeacher = async () => {
      const response = await customAxios.get(
        `admin/get-all-teacher?search_key=${searchValues}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data.teachers;
      console.log("This is Search");

      setTeacherList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchTeacher();
    }
  }, [searchValues]);
  //Closing Model
  const closeModel = () => {
    setSelectedTeacher(null);
    setIsTeacherModelComponentOpen(false);
    setIsDeleteModalOpen(false);
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
      setIsTeacherModelComponentOpen(false);
      console.log("This is Total Teacher in Register: ", totalTeachers);
      setTotalTeachers(totalTeachers + 1);
      console.log(
        "This is Total TeacherList in Register after: ",
        teacherList.length
      );
      teacher._id = response.data.data._id;
      if (teacherList.length < 5 || totalTeachers === 0) {
        setTeacherList((prevTeachers) => [...prevTeachers, teacher]);
      }
      setSuccessMessage("New Teacher Registered Successfully");
      setTimeout(() => {
        setSuccessMessage("");
        // if (totalTeachers % 5 === 0) {
        //   // setTeacherList((prevTeachers) => [...prevTeachers, teacher]);
        //   // window.location.href = "register-teacher";
        // }
      }, 2000);
      // window.location.href = "register-teacher";
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
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      }
    }
  };

  console.log("This is Teacher List: ", teacherList);

  //Delete
  const handleDelete = (teacher: ITeacher) => {
    console.log("This is Teacher: ", teacher);
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
      setTeacherList((prevTeachers) =>
        prevTeachers.filter((teacher) => teacher._id !== id)
      );
      setTotalTeachers(totalTeachers - 1);
      // if ((totalTeachers - 1) % 5 === 0) {
      //   window.location.href = "register-teacher";
      // }
      setSuccessMessage("Deleted Successfully");
      setIsDeleteModalOpen(false);
      console.log("This is length of teacher: ", teacherList.length);
      console.log("This is Total Teachers: ", totalTeachers - 1);

      setTimeout(() => {
        setSuccessMessage("");
        if (teacherList.length === 5 && (totalTeachers - 1) % 5 === 0) {
          console.log("Yes length is 1 or 5");
          window.location.href = "register-teacher";
        }
      }, 2000);
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
      setTeacherList((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher._id === selectedTeacher?._id ? incomingData : teacher
        )
      );
      setSuccessMessage("Updated Success");
      setIsTeacherModelComponentOpen(false);
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
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

  //Add Teacher
  const addTeacher = () => {
    console.log("Add Teacher Called");
    setIsUpdate(false);
    setIsTeacherModelComponentOpen(true);
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
          </div>
        )}

        {successMessage && (
          <div className="success_container">
            <div className="success_message">
              <strong>{successMessage}</strong>
            </div>
          </div>
        )}
        <div className="table">
          <div className="table_header">
            <p>
              <strong>Total Teachers: {totalTeachers}</strong>
            </p>
            <div className="sub_header">
              <button
                title="Register Teacher"
                className="add_new"
                onClick={addTeacher}
              >
                <FontAwesomeIcon className="add-icon" icon={faCirclePlus} />
                Register Teacher
              </button>
              <input
                placeholder="Search Teacher"
                value={searchValues}
                onChange={(e) => setSearchValues(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="table_body">
            <table>
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Faculty</th>
                  <th>Email</th>
                  <th>College Id</th>
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
                    <td>
                      <strong>{teacher.college_id}</strong>
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
                            college_id: teacher.college_id,
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
                            _id: teacher._id,
                            name: teacher.name,
                            college_id: teacher.college_id,
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
      {totalTeachers >= teachersPerPage && (
        <div className="pagination">
          <ul className="pagination-ul">
            <li className="page-item">
              <button
                className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() =>
                  currentPage > 1 && setCurrentPage(currentPage - 1)
                }
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            <li className="page-item">
              <button
                className={`page-link ${
                  currentPage === Math.ceil(totalTeachers / teachersPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage < Math.ceil(totalTeachers / teachersPerPage) &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={
                  currentPage === Math.ceil(totalTeachers / teachersPerPage)
                }
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}

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
