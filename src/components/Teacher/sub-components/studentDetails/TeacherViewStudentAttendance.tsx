import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../common/Auth/Auth";
import customAxios from "../../../../apis/axios";
import { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import TeacherEditAttendanceModal from "./TeacherEditPopUpModal";
export interface IAttendance {
  _id: string;
  attendance_date: string;
  createdAt: string;
  section: string[];
  student_id: string;
  student_name: string;
  status: string;
  timeTable: {
    subject: string;
    startTime: string;
    endTime: string;
  };
  updatedAt: string;
}

export default function TeacherViewIndividualStudentDetails() {
  const { student } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  console.log("student", student);
  const [attendanceList, setAttendanceList] = useState<IAttendance[]>([]);
  const [selectedAttendance, setSelectedAttendance] =
    useState<IAttendance | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [isOpenEditAttendanceModal, setIsOpenEditAttendanceModal] =
    useState(false);
  const [message, setMessage] = useState("");
  const [searchValues, setSearchValues] = useState(null || "");
  const [successMessage, setSuccessMessage] = useState("");
  const dataPerPage = 5;
  console.log("This is Total Count: ", totalCount);

  const handleEditAttendance = (attendance: IAttendance) => {
    setSelectedAttendance(attendance);
    setIsOpenEditAttendanceModal(true);
  };
  //Get student Attendance Details
  useEffect(() => {
    const token = localStorage.getItem("token");
    const studentAttendanceList = `/teacher/get-student-attendance/${student}/?page=${currentPage}`;
    // const studentProfile= `/teacher/get-student-profile/${student}`;
    const fetchAttendanceData = async () => {
      try {
        const response = await customAxios.get(studentAttendanceList, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("This is Response:", response.data.data.totalCount);

        if (response.data.data.totalCount === 0) {
          setMessage(`No Attendance found for this student`);
        }
        setTotalCount(response.data.data.totalCount);
        setAttendanceList(response.data.data.result);
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
    fetchAttendanceData();
  }, [setUserRole, setIsLoggedIn, student, currentPage]);
  console.log("attendanceList", attendanceList);

  // Search attendance when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const searchTeacher = async () => {
      console.log("This is Search Value: ", searchValues);
      const response = await customAxios.get(
        `teacher/get-student-attendance/${student}?attendance_date=${searchValues}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data.result;
      console.log("This is Response Data: ", responseData);

      console.log("This is Search Value: ", searchValues);

      console.log("Second UseEffect");
      setAttendanceList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchTeacher();
    }
  }, [searchValues, student, currentPage]);

  const save = async (attendanceStatus: string) => {
    const token = localStorage.getItem("token");
    if (selectedAttendance) {
      selectedAttendance.status = attendanceStatus;
    }
    try {
      await customAxios.patch(
        "/teacher/update-student-attendance",
        selectedAttendance,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the attendanceList state
      setAttendanceList((prevList) => {
        return prevList.map((attendance) =>
          attendance._id === selectedAttendance?._id
            ? selectedAttendance
            : attendance
        );
      });
      setSuccessMessage("Attendance Updated Successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 1200);

      setIsOpenEditAttendanceModal(false);
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

  return (
    <>
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
              {totalCount > 0 ? (
                <strong>Attendance Count: {totalCount}</strong>
              ) : null}
            </p>
            <div className="sub_header">
              {totalCount > 0 && attendanceList[0].student_name}
              <input
                placeholder="Search By Date"
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
                  <th>Subject</th>
                  <th>Attendance Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Presented Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.length <=0 ? (
                  <tr>
                    <td colSpan={3}>{message}</td>
                  </tr>
                ) : (
                  attendanceList.map((attendance, index) => {
                    const date = new Date(attendance.attendance_date);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
                    const day = String(date.getDate()).padStart(2, "0");
                    const formattedDate = `${year}-${month}-${day}`;
                    const updatedAtDate = new Date(attendance.updatedAt);
                    const updatedHour = String(
                      updatedAtDate.getHours()
                    ).padStart(2, "0");
                    const updatedMinute = String(
                      updatedAtDate.getMinutes()
                    ).padStart(2, "0");
                    const updatedSecond = String(
                      updatedAtDate.getSeconds()
                    ).padStart(2, "0");
                    const formattedUpdatedAtTime = `${updatedHour}:${updatedMinute}:${updatedSecond}`;

                    return (
                      <tr key={index}>
                        <td>{attendance.timeTable.subject}</td>
                        <td>{formattedDate}</td>
                        <td>{attendance.timeTable.startTime}</td>
                        <td>{attendance.timeTable.endTime}</td>
                        <td>{attendance.status}</td>
                        <td>
                          {attendance.status === "ABSENT"
                            ? "-"
                            : formattedUpdatedAtTime}
                        </td>
                        <td>
                          <button
                            className="edit_button"
                            title="Edit Faculty"
                            onClick={() => {
                              handleEditAttendance(attendance);
                            }}
                          >
                            <FontAwesomeIcon className="icon" icon={faEdit} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {totalCount >= dataPerPage && (
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
                  currentPage === Math.ceil(totalCount / dataPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage < Math.ceil(totalCount / dataPerPage) &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === Math.ceil(totalCount / dataPerPage)}
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
      {isOpenEditAttendanceModal && <div className="modal-backdrop" />}
      {isOpenEditAttendanceModal && selectedAttendance && (
        <TeacherEditAttendanceModal
          onSave={save}
          onClose={() => {
            setIsOpenEditAttendanceModal(false);
            window.location.href = `/teacher/student-detail/${student}`;
          }}
        />
      )}
    </>
  );
}
