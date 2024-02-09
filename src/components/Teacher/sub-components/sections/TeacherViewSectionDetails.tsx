import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import customAxios from "../../../../apis/axios";
import { AuthContext } from "../../../common/Auth/Auth";
import { Link, useParams } from "react-router-dom";
// interface ISectionEdit {
//   _id: string;
//   section: string;
// }

// interface ModalProps {
//   role: string;
//   sectionData: ISectionEdit;
//   onClose: () => void;
//   // onSave: (id: string) => void;
// }
interface IStudent {
  _id?: string;
  name: string;
  college_id: string;
  faculty: string;
  email: string;
  section: string;
}
export function TeacherViewSectionDetails() {
  const [studentList, setStudentList] = useState<IStudent[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [searchValues, setSearchValues] = useState(null || "");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(null || "");
  const usersPerPage = 5;
  const { section } = useParams();
  //Get all students
  useEffect(() => {
    const listAllUserApi = `teacher/get-all-student/${section}?page=${currentPage}`;
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
          setMessage(`No Student found in this section`);
        }
        setTotalUsers(response.data.data.totalCount);
        console.log("This is Response: ", response.data.data.teachers);
        setStudentList(response.data.data.teachers);
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
  }, [setUserRole, setIsLoggedIn, currentPage, setTotalUsers, section]);

  // Search teacher or student when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const searchTeacher = async () => {
      const response = await customAxios.get(
        `teacher/get-all-student/${section}?search_key=${searchValues}`,
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
  }, [searchValues, section]);

  return (
    <>
      <div className="table">
        {successMessage && (
          <div className="success_message">
            <strong>{successMessage}</strong>

            <button
              className="close_button"
              onClick={() => {
                setSuccessMessage("");
              }}
            >
              <span>&times;</span>
            </button>
          </div>
        )}
        <div className="table_header">
          <p>
            <strong>Total Student: {totalUsers}</strong>
          </p>
          <div className="sub_header">
            <input
              placeholder={`Search Student`}
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
                <th>Student Name</th>
                <th>Faculty</th>
                <th>Email</th>
                <th>College Id</th>
                <th>View Student Details</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((user) => (
                <tr key={user.name}>
                  {/* key={faculty.name} */}
                  <td className="table-cell">
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
                  <td>
                    <Link
                      className="view-details-link"
                      title={`View Detail of  ${user.name}`}
                      to={`/teacher/student-detail/${user._id}`}
                    >
                      <strong>View Details</strong>
                    </Link>
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
                  currentPage === Math.ceil(totalUsers / usersPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage < Math.ceil(totalUsers / usersPerPage) &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
      {/* <button className="delete_button" onClick={onClose}>
            Close
          </button> */}
    </>
  );
}

// export function TeacherViewSectionDetails() {
//   return (
//     <>
//       <h1>Section Details</h1>
//     </>
//   );
// }
