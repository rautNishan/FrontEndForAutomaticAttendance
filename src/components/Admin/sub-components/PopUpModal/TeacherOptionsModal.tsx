import { useContext, useEffect, useState } from "react";
import "./ModalCssForAdmin/RegisterModal.css";
import customAxios from "../../../../apis/axios";
import axios, { AxiosError } from "axios";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../../common/Auth/Auth";
import "../css/UserOption.css";
interface ISectionEdit {
  _id: string;
  section: string;
}
interface ModalProps {
  role: string;
  selectedSection: ISectionEdit;
  onClose: () => void;
}
interface ITeacher {
  _id?: string;
  name: string;
  college_id: string;
  faculty: string;
  email: string;
  password: string;
}

export default function AssignOptionModal({
  role,
  selectedSection,
  onClose,
}: ModalProps) {
  const [totalUser, setTotalUser] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValues, setSearchValues] = useState(null || "");
  const [teacherList, setTeacherList] = useState<ITeacher[]>([]);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [successMessage, setSuccessMessage] = useState(null || "");
  const [errorMessage, setErrorMessage] = useState(null);

  const teachersPerPage = 5;

  useEffect(() => {
    let listAllUserAccordingToSectionApi: string = "";
    console.log("This is Role", role);

    if (role === "student") {
      listAllUserAccordingToSectionApi = `/admin/get-all-nonSection-${role}?page=${currentPage}`;
    } else {
      listAllUserAccordingToSectionApi = `/admin/get-all-${role}?page=${currentPage}`;
    }
    const token = localStorage.getItem("token");
    console.log(
      "This is List All User Api: ",
      listAllUserAccordingToSectionApi
    );
    const fetchTeachers = async () => {
      try {
        const response = await customAxios.get(
          listAllUserAccordingToSectionApi,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("This is response.data.data: ", response.data.data);
        setTotalUser(response.data.data.totalCount);
        console.log(
          "This is Response after request: ",
          response.data.data.teachers
        );
        setTeacherList(response.data.data.teachers);
      } catch (error) {
        // setUserRole("");
        // setIsLoggedIn(false);
        // localStorage.removeItem("token");
        if (error instanceof AxiosError && error.response) {
          alert(error.response.data.message);
        }
      }
    };
    fetchTeachers();
  }, [setUserRole, setIsLoggedIn, currentPage, setTotalUser, role]);

  // Search teachers when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    let listAllUserAccordingToSection: string = "";
    if (role === "student") {
      listAllUserAccordingToSection = `/admin/get-all-nonSection-${role}?search_key=${searchValues}`;
    } else {
      listAllUserAccordingToSection = `/admin/get-all-${role}?search_key=${searchValues}`;
    }
    const searchTeacher = async () => {
      const response = await customAxios.get(listAllUserAccordingToSection, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = response.data.data.teachers;
      console.log("This is Search");

      setTeacherList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchTeacher();
    }
  }, [searchValues, role]);

  const addSection = async (id: string) => {
    try {
      const response = await customAxios.patch(
        `admin/update-${role}/${id}`,
        { section: selectedSection?.section },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("This is Response: ", response.data);
      setSuccessMessage("Assigned Successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message == "JWT EXPIRED") {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
          alert(error.response.data.message);
        }
        const responseToBeSent = error.response?.data.message;
        console.log("This is Error: ", responseToBeSent);
        setErrorMessage(responseToBeSent);
        setTimeout(() => {
          setErrorMessage(null);
        }, 1000);
      }
    }
  };
  return (
    <>
      <div className="popup-modal-container">
        <div className="popup-options-modal ">
          <div className="table_container">
            {errorMessage && (
              <div className="error_container">
                <div className="error_message">
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
                  <strong>Total {role}: {totalUser}</strong>
                </p>
                <div className="sub_header">
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
                      <th>Name</th>
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
                            title="Assign Teacher to Section"
                            onClick={() => addSection(teacher._id || "")}
                          >
                            <FontAwesomeIcon
                              className="icon"
                              icon={faCirclePlus}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {totalUser > teachersPerPage && (
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
                        currentPage === Math.ceil(totalUser / teachersPerPage)
                          ? "disabled"
                          : ""
                      }`}
                      onClick={() =>
                        currentPage < Math.ceil(totalUser / teachersPerPage) &&
                        setCurrentPage(currentPage + 1)
                      }
                      disabled={
                        currentPage === Math.ceil(totalUser / teachersPerPage)
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
