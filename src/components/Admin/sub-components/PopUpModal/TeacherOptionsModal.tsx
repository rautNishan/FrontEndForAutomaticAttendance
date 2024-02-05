import { useContext, useEffect, useState } from "react";
import "./ModalCssForAdmin/RegisterModal.css";
import customAxios from "../../../../apis/axios";
import { AxiosError } from "axios";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../../common/Auth/Auth";
import "../css/Faculty.css";
interface ModalProps {
  onClose: () => void;
  onSave: (id: string) => void;
}
interface ITeacher {
  _id?: string;
  name: string;
  college_id: string;
  faculty: string;
  email: string;
  password: string;
}

export default function TeacherOptionModal({ onClose, onSave }: ModalProps) {
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValues, setSearchValues] = useState(null || "");
  const [teacherList, setTeacherList] = useState<ITeacher[]>([]);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const teachersPerPage = 5;
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

  const addSection = async (_id: string) => {
    onSave(_id);
  };
  return (
    <>
      <div className="popup-modal-container">
        <div className="popup-options-modal ">
          <div className="table">
            <div className="table_header">
              <p>
                <strong>Total Teachers: {totalTeachers}</strong>
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
          {totalTeachers > teachersPerPage && (
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
                      currentPage === Math.ceil(totalTeachers / teachersPerPage)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() =>
                      currentPage <
                        Math.ceil(totalTeachers / teachersPerPage) &&
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
          <button className="delete_button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
