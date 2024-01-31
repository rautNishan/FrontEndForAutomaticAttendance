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
import Modal from "../../common/Modal/Modal";
import "./css/Faculty.css";
interface IFaculty {
  _id: string;
  name: string;
}
export default function Faculties() {
  const getAllFacultiesApi = "/admin/get-all-faculty";
  const [facultyName, setFacultyName] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [facultyList, setFacultyList] = useState<IFaculty[]>([]);
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<IFaculty | null>(null);
  const [successMessage, setSuccessMessage] = useState(null || "");
  const handleEdit = (faculty: IFaculty) => {
    setSelectedFaculty(faculty);
    setIsModalOpen(true);
  };
  const handleSave = async (updatedName: string) => {
    const dataToBeSent = updatedName.toUpperCase();
    const id = selectedFaculty?._id;
    try {
      const response = await customAxios.patch(
        "/admin/edit-faculty",
        {
          id: id,
          name: dataToBeSent,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("This is Response: ", response.data);
      setSuccessMessage("Faculty Updated Successfully");
      setIsModalOpen(false);
      setTimeout(() => {
        window.location.href = "faculty";
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
        setIsModalOpen(false);
      }
    }
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await customAxios.get(getAllFacultiesApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFacultyList(response.data.data);
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

    fetchTeachers();
  }, [setUserRole, setIsLoggedIn]);

  async function addFaculty() {
    const token = localStorage.getItem("token");
    const dataToSend = facultyName.toUpperCase();
    try {
      const response = await customAxios.post(
        "/admin/add-faculty",
        { name: dataToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("THis is Response: ", response.data);
      window.location.href = "faculty";
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
                window.location.href = "faculty";
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
            <p className="title">Faculty List</p>
            <div>
              <input
                placeholder="Add Faculty"
                value={facultyName}
                onChange={(e) => setFacultyName(e.target.value)}
                required
              />
              <button
                title="Add Faculty"
                className="add_new"
                onClick={addFaculty}
              >
                <FontAwesomeIcon className="add-icon" icon={faCirclePlus} />
                Add Faculty
              </button>
            </div>
          </div>
          <div className="table_body">
            <table>
              <thead>
                <tr>
                  <th>Faculty Name</th>
                  <th>Teacher Count</th>
                  <th>Student Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.map((faculty) => (
                  <tr key={faculty.name}>
                    {/* key={faculty.name} */}
                    <td>
                      <strong>{faculty.name}</strong>
                    </td>
                    <td>0</td>
                    <td>0</td>
                    {/* <td>{faculty.teacherCount}</td> 
                  <td>{faculty.studentCount}</td>  */}
                    <td>
                      <button
                        className="edit_button"
                        title="Edit Faculty"
                        onClick={() =>
                          handleEdit({ name: faculty.name, _id: faculty._id })
                        }
                      >
                        <FontAwesomeIcon className="icon" icon={faEdit} />
                      </button>
                      <button title="Delete Faculty" className="delete_button">
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
      {isModalOpen && <div className="modal-backdrop" />}
      {isModalOpen && selectedFaculty && (
        <Modal
          faculty={selectedFaculty}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
