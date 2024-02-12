import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import customAxios from "../../../../apis/axios";
import { AuthContext } from "../../../common/Auth/Auth";
import "../css/Faculty.css";
interface ISectionEdit {
  _id: string;
  section: string;
}

interface ModalProps {
  role: string;
  sectionData: ISectionEdit;
  onClose: () => void;
  // onSave: (id: string) => void;
}
interface ITeacher {
  _id?: string;
  name: string;
  college_id: string;
  faculty: string;
  email: string;
  password: string;
}
export function UserSectionDetail({
  role,
  sectionData,
  onClose,
}: // onSave,
ModalProps) {
  const [userList, setUserList] = useState<ITeacher[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [searchValues, setSearchValues] = useState(null || "");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(null || "");
  const usersPerPage = 5;

  const deleteUserFromSection = (id: string) => {
    try {
      console.log("This is Role: ", role);
      const response = customAxios.patch(
        `admin/delete-${role}-section/${id}`,
        { section: sectionData?.section },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("This is Response: ", response);
      setUserList((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setTotalUsers(totalUsers - 1);
      setSuccessMessage("Deleted Successfully");
      setTimeout(() => {
        setSuccessMessage("");
        if (userList.length === 5 && (totalUsers - 1) % 5 === 0) {
          console.log("Yes length is 1 or 5");
          window.location.href = "register-teacher";
        }
      }, 1200);
      // setIsViewDetailsModal(false);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 401) {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          alert(error.response.data.message);
        }
      }
    }
  };

  //Get all teacher or students
  useEffect(() => {
    const listAllUserApi = `admin/get-all-${role}/${sectionData.section}?page=${currentPage}`;
    const token = localStorage.getItem("token");
    const fetchTeachers = async () => {
      try {
        const response = await customAxios.get(listAllUserApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data.totalCount);
        if (response.data.data.totalCount === 0) {
          setMessage(`No ${role} found in this section`);
        }
        setTotalUsers(response.data.data.totalCount);
        console.log("This is Response: ", response.data.data.teachers);
        setUserList(response.data.data.teachers);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          if (error.response.status === 401) {
            //401 is Unauthorized from my backend
            setUserRole("");
            setIsLoggedIn(false);
            localStorage.removeItem("token");
            alert(error.response.data.message);
          }
        }
      }
    };
    fetchTeachers();
  }, [
    setUserRole,
    setIsLoggedIn,
    currentPage,
    setTotalUsers,
    sectionData.section,
    role,
  ]);

  // Search teacher or student when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const searchTeacher = async () => {
      const response = await customAxios.get(
        `admin/get-all-${role}/${sectionData.section}?search_key=${searchValues}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data.teachers;
      console.log("This is Search");

      setUserList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchTeacher();
    }
  }, [searchValues, sectionData.section, role]);

  return (
    <>
      <div className="popup-modal-container">
        <div className="popup-options-modal ">
          <div className="table_container">
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
                  <strong>
                    Total {role}: {totalUsers}
                  </strong>
                </p>
                <div className="sub_header">
                  <input
                    placeholder={`Search ${role}`}
                    value={searchValues}
                    onChange={(e) => setSearchValues(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="error">{message}</p>
              <div className="table_body">
                <table>
                  <thead>
                    <tr>
                      <th>
                        {role === "teacher" ? "Teacher Name" : "Student Name"}
                      </th>
                      <th>Faculty</th>
                      <th>Email</th>
                      <th>College Id</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user) => (
                      <tr key={user.name}>
                        {/* key={faculty.name} */}
                        <td>
                          <strong>{user.name}</strong>
                        </td>
                        <td>
                          {" "}
                          <strong>{user.faculty}</strong>
                        </td>
                        <td>
                          <strong>{user.email}</strong>
                        </td>
                        <td>
                          <strong>{user.college_id}</strong>
                        </td>
                        {/* <td>{faculty.teacherCount}</td> 
                  <td>{faculty.studentCount}</td>  */}
                        <td>
                          <button
                            className="delete_button"
                            title="Delete teacher from section"
                            onClick={() =>
                              deleteUserFromSection(user._id || "")
                            }
                          >
                            <FontAwesomeIcon
                              className="icon"
                              icon={faTrashAlt}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalUsers >= usersPerPage && (
              <div className="pagination">
                <ul className="pagination-ul">
                  <li className="page-item">
                    <button
                      className={`page-link ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
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
                        currentPage === Math.ceil(totalUsers / usersPerPage)
                          ? "disabled"
                          : ""
                      }`}
                      onClick={() =>
                        currentPage < Math.ceil(totalUsers / usersPerPage) &&
                        setCurrentPage(currentPage + 1)
                      }
                      disabled={
                        currentPage === Math.ceil(totalUsers / usersPerPage)
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            )}
            <button className="delete_button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
