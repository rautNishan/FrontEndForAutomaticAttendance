import { faCirclePlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import customAxios from "../../../apis/axios";
import { AuthContext } from "../../common/Auth/Auth";
import ConfirmModal from "../../common/Modal/ConfirmModel";
import "./css/Faculty.css";
import TeacherOptionModal from "./PopUpModal/TeacherOptionsModal";
interface ISection {
  _id: string;
  section: string;
  teacherCounts: number;
  studentCounts: number;
}
interface ISectionEdit {
  _id: string;
  section: string;
}
export default function Section() {
  const [sectionName, setSectionName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [sectionList, setSectionList] = useState<ISection[]>([]);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [searchValues, setSearchValues] = useState(null || "");
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssignModel, setIsAssignModalOpen] = useState(false);
  const [isDeleteModel, setIsDeleteModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<ISectionEdit | null>(
    null
  );
  const [totalSection, setTotalSection] = useState(0);
  const [successMessage, setSuccessMessage] = useState(null || "");
  const sectionPerPage = 5;

  const handleDelete = async (section: ISectionEdit) => {
    setSelectedSection(section);
    setIsDeleteModalOpen(true);
  };

  //Only Display Success or Error Message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [successMessage, errorMessage]);
  const handleDeleteSection = async () => {
    const id = selectedSection?._id;
    try {
      const response = await customAxios.delete(`/admin/delete-section/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("This is Response: ", response.data);
      setIsDeleteModalOpen(false);
      window.location.href = "section";
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
  const handleAssign = async (section: ISectionEdit) => {
    setSelectedSection(section);
    setIsAssignModalOpen(true);
  };

  const saveAssignTeacher = async (teacherId: string) => {
    console.log("This is Teacher: ", teacherId);
    console.log("This is Section: ", selectedSection?.section);
    try {
      const response = await customAxios.patch(
        `admin/update-teacher/${teacherId}`,
        { section: selectedSection?.section },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("This is Response: ", response.data);
      setSuccessMessage("Teacher Assigned Successfully");
      setIsAssignModalOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message == "JWT EXPIRED") {
          setUserRole("");
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
        const responseToBeSent = error.response?.data.message;
        setErrorMessage(responseToBeSent);
        setIsAssignModalOpen(false);
      }
    }
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("this is token: ", token);
        const getAllSectionsApi = `/admin/get-all-section?page=${currentPage}`;
        const response = await customAxios.get(getAllSectionsApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalSection(response.data.data.totalCount);
        setSectionList(response.data.data.existingData);
        console.log("First UseEffect");
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

    fetchSections();
  }, [setUserRole, setIsLoggedIn, setTotalSection, currentPage]);

  // Search Section when searchValues changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const searchTeacher = async () => {
      console.log("This is Search Value: ", searchValues);
      const response = await customAxios.get(
        `admin/get-all-section?section=${searchValues}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.data.existingData;
      console.log("This is Search Value: ", searchValues);

      console.log("Second UseEffect");
      setSectionList(responseData);
    };
    if (searchValues != "" || searchValues != null) {
      searchTeacher();
    }
  }, [searchValues]);

  async function addSection() {
    const token = localStorage.getItem("token");
    const dataToSend = sectionName.toUpperCase();
    console.log("This is Data to Send: ", dataToSend);

    try {
      const response = await customAxios.post(
        "/admin/add-section",
        { section: dataToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("THis is Response: ", response.data);
      window.location.href = "section";
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.message);
      }
    }
  }
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
                window.location.href = "section";
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

              <button
                className="close_button"
                onClick={() => {
                  setSuccessMessage("");
                  window.location.href = "section";
                }}
              >
                <span>&times;</span>
              </button>
            </div>
          </div>
        )}
        <div className="table">
          <div className="table_header">
            <input
              placeholder="Search Section"
              value={searchValues}
              onChange={(e) => setSearchValues(e.target.value)}
              required
            />
            <div className="sub_header">
              <p>Total Section Count: {totalSection}</p>
              <input
                placeholder="Add Section"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                required
              />
              <button
                title="Add Section"
                className="add_new"
                onClick={addSection}
              >
                <FontAwesomeIcon className="add-icon" icon={faCirclePlus} />
                Add Section
              </button>
            </div>
          </div>
          <div className="table_body">
            <table>
              <thead>
                <tr>
                  <th>Section Name</th>
                  <th>Teacher Count</th>
                  <th>Student Count</th>
                  <th>Actions</th>
                  <th>Assign Teacher</th>
                </tr>
              </thead>
              <tbody>
                {sectionList.map((section) => (
                  <tr key={section.section}>
                    {/* key={faculty.name} */}
                    <td>
                      <strong>{section.section}</strong>
                    </td>
                    <td>
                      <strong>{section.teacherCounts}</strong>
                    </td>
                    <td>
                      <strong>{section.studentCounts}</strong>
                    </td>
                    {/* <td>{faculty.teacherCount}</td> 
                  <td>{faculty.studentCount}</td>  */}
                    <td>
                      {/* <button
                        className="edit_button"
                        title="Edit Faculty"
                        onClick={() =>
                          handleEdit({ name: faculty.name, _id: faculty._id })
                        }
                      >
                        <FontAwesomeIcon className="icon" icon={faEdit} />
                      </button> */}
                      <button
                        title="Delete Section"
                        className="delete_button"
                        onClick={() =>
                          handleDelete({
                            section: section.section,
                            _id: section._id,
                          })
                        }
                      >
                        <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                      </button>
                    </td>
                    <td>
                      <button
                        title="Assign Teacher"
                        className="add_new"
                        onClick={() =>
                          handleAssign({
                            section: section.section,
                            _id: section._id,
                          })
                        }
                      >
                        <FontAwesomeIcon
                          className="add-icon"
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
      </div>
      {totalSection > sectionPerPage && (
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
                  currentPage === Math.ceil(totalSection / sectionPerPage)
                    ? "disabled"
                    : ""
                }`}
                onClick={() =>
                  currentPage < Math.ceil(totalSection / sectionPerPage) &&
                  setCurrentPage(currentPage + 1)
                }
                disabled={
                  currentPage === Math.ceil(totalSection / sectionPerPage)
                }
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      )}
      {isAssignModel && <div className="modal-backdrop" />}
      {isAssignModel && selectedSection && (
        <TeacherOptionModal
          // data={selectedFaculty}
          onClose={() => setIsAssignModalOpen(false)}
          onSave={saveAssignTeacher}
        />
      )}
      {isDeleteModel && <div className="modal-backdrop" />}
      {isDeleteModel && selectedSection && (
        <ConfirmModal
          data={selectedSection}
          onClose={() => setIsDeleteModalOpen(false)}
          onSave={handleDeleteSection}
        />
      )}
    </>
  );
}
