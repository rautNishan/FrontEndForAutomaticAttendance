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
import StudentDataModal from "./PopUpModal/AdminStudentRegisterModal";
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
  name: string;
  college_id: string;
  faculty: string;
  email: string;
  password: string;
}
export default function RegisterStudent({ api }: { api: string }) {
  console.log("This is API: ", api);
  const token = localStorage.getItem("token");
  const [studentList, setStudentList] = useState<ITeacher[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<ITeacher | null>(null);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null || "");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isDeleteModel, setIsDeleteModalOpen] = useState(false);
  const [searchValues, setSearchValues] = useState(null || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudent, setTotalStudent] = useState(0);
  const studentPerPage = 5;

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
        console.log(response.data.data.totalCount);
        setTotalStudent(response.data.data.totalCount);
        console.log("This is Response: ", response.data.data.teachers);
        setStudentList(response.data.data.teachers);
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
  }, [setUserRole, setIsLoggedIn, currentPage, setTotalStudent]);

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

      setStudentList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchTeacher();
    }
  }, [searchValues]);
  //Closing Model
  const closeModel = () => {
    setSelectedStudent(null);
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
  const handleDelete = (student: ITeacher) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTeacher = async () => {
    const id = selectedStudent?._id;
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
  const handleEdit = (student: ITeacher) => {
    setIsUpdate(true);
    setSelectedStudent(student);
    setIsTeacherModelComponentOpen(true);
  };

  //Save
  const handleSave = async (incomingData: ITeacher) => {
    console.log("This is Incoming Data: ", incomingData);
    console.log("This is Selected Teacher: ", selectedStudent?._id);
    incomingData.faculty = incomingData.faculty.toUpperCase();
    const apiToUpdateTeacher = `/admin/update-teacher/${selectedStudent?._id}`;
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

  //Add Teacher
  const addTeacher = () => {
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
            <p>
              <strong>Total Teachers: {totalStudent}</strong>
            </p>
            <div className="sub_header">
              <button
                title="Register Student"
                className="add_new"
                onClick={addTeacher}
              >
                <FontAwesomeIcon className="add-icon" icon={faCirclePlus} />
                Register Student
              </button>
              <input
                placeholder="Search Student"
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
                {studentList.map((student) => (
                  <tr key={student.name}>
                    {/* key={faculty.name} */}
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>
                      {" "}
                      <strong>{student.faculty}</strong>
                    </td>
                    <td>
                      <strong>{student.email}</strong>
                    </td>
                    <td>
                      <strong>{student.college_id}</strong>
                    </td>
                    {/* <td>{faculty.teacherCount}</td> 
                  <td>{faculty.studentCount}</td>  */}
                    <td>
                      <button
                        className="edit_button"
                        title="Edit Faculty"
                        onClick={() =>
                          handleEdit({
                            _id: student._id,
                            name: student.name,
                            college_id: student.college_id,
                            faculty: student.faculty,
                            email: student.email,
                            password: "",
                          })
                        }
                      >
                        <FontAwesomeIcon className="icon" icon={faEdit} />
                      </button>
                      <button
                        title="Delete Student"
                        className="delete_button"
                        onClick={() =>
                          handleDelete({
                            name: student.name,
                            college_id: student.college_id,
                            _id: student._id,
                            faculty: student.faculty,
                            email: student.email,
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
      {totalStudent > studentPerPage && (
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
                  currentPage === Math.ceil(totalStudent / studentPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage < Math.ceil(totalStudent / studentPerPage) &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={
                  currentPage === Math.ceil(totalStudent / studentPerPage)
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
        <StudentDataModal
          onClose={closeModel}
          onSave={isUpdate ? handleSave : handelTeacherRegister}
          isUpdate={isUpdate}
          initialData={isUpdate ? selectedStudent : null}
        />
      )}

      {isDeleteModel && <div className="modal-backdrop" />}
      {isDeleteModel && selectedStudent && (
        <ConfirmModal
          data={selectedStudent}
          onClose={() => setIsDeleteModalOpen(false)}
          onSave={handleDeleteTeacher}
        />
      )}
    </>
  );
}
