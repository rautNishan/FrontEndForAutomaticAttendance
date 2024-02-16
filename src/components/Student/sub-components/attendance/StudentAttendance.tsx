import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../common/Auth/Auth";
import customAxios from "../../../../apis/axios";
import { AxiosError } from "axios";
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

export default function StudentAttendance() {
  const [currentPage, setCurrentPage] = useState(1);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [attendanceList, setAttendanceList] = useState<IAttendance[]>([]);

  const [totalCount, setTotalCount] = useState(0);
  useState(false);
  const [message, setMessage] = useState("");
  const [searchValues, setSearchValues] = useState(null || "");
  const dataPerPage = 5;
  console.log("This is Total Count: ", totalCount);

  //Get student Attendance Details
  useEffect(() => {
    const token = localStorage.getItem("token");
    const studentAttendanceList = `/student/get-student-attendance/?page=${currentPage}`;
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
  }, [setUserRole, setIsLoggedIn, currentPage]);
  console.log("attendanceList", attendanceList);

  // Search attendance when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const searchTeacher = async () => {
      console.log("This is Search Value: ", searchValues);
      const response = await customAxios.get(
        `student/get-student-attendance?attendance_date=${searchValues}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data.result;
      setAttendanceList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchTeacher();
    }
  }, [searchValues, currentPage]);

  return (
    <>
      <div className="table_container">
        <div className="table">
          <div className="table_header">
            <p>
              {totalCount > 0 ? (
                <strong>Attendance Count: {totalCount}</strong>
              ) : null}
            </p>
            <div className="sub_header">
              {totalCount > 0 &&
                attendanceList.length > 0 &&
                attendanceList[0].student_name}
              <input
                placeholder="YYYY-MM-DD"
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
                </tr>
              </thead>
              <tbody>
                {attendanceList.length <= 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        textAlign: "center",
                        textTransform: "uppercase",
                        color: "red",
                      }}
                    >
                      {message}
                    </td>
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
    </>
  );
}
