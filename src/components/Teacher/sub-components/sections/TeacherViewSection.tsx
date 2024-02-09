import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../common/Auth/Auth";
import customAxios from "../../../../apis/axios";
import { AxiosError } from "axios";
import "../css/teacher.css";
import { Link } from "react-router-dom";

interface Section {
  _id: string;
  section: string;
  studentCounts: number;
  teacherCounts: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export function TeacherViewSection() {
  const token = localStorage.getItem("token");
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [searchValues, setSearchValues] = useState(null || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionList, setSectionList] = useState<Section[]>([]);
  const sectionPerPage = 5;
  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const getSectionDataOfParticularTeacherApi = `/teacher/get-all-section-related-to-teacher?page=${currentPage}`;
        const response = await customAxios.get(
          getSectionDataOfParticularTeacherApi,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSectionList(response.data.data);
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
  }, [token, setIsLoggedIn, setUserRole, currentPage]);

  // Search teacher or student when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const searchStudentAccordingToSection = async () => {
      const response = await customAxios.get(
        `/teacher/get-all-section-related-to-teacher/?section=${searchValues}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data;

      setSectionList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchStudentAccordingToSection();
    }
  }, [searchValues]);

  return (
    <>
      <div className="table_container">
        <div className="table">
          {/* {sectionList.length === 0 ? (
            <p className="error">No Section Found for this teacher</p>
          ) : ( */}
          <>
            <div className="table_header">
              <input
                placeholder="Search Section"
                value={searchValues}
                onChange={(e) => setSearchValues(e.target.value)}
                required
              />
            </div>
            <div className="table_body">
              <table>
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Student Count</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionList.map((section, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{section.section}</strong>
                      </td>
                      <td>
                        <strong>{section.studentCounts}</strong>
                      </td>
                      <td>
                        <Link
                          className="view-details-link"
                          title={`View Section ${section.section} Details`}
                          to={`/teacher/section-details/${section.section}`}
                        >
                          <strong>View Details</strong>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
          {/* )} */}
        </div>
      </div>
      {sectionList.length >= sectionPerPage && (
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
                  currentPage === Math.ceil(sectionList.length / sectionPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage <
                    Math.ceil(sectionList.length / sectionPerPage) &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={
                  currentPage === Math.ceil(sectionList.length / sectionPerPage)
                }
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
