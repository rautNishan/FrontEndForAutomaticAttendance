import { useState } from "react";
import "./ModalCssForAdmin/RegisterModal.css";

interface ModalProps {
  onClose: () => void;
  isUpdate?: boolean;
  initialData?: {
    name: string;
    college_id?: string;
    faculty: string;
    email: string;
    password: string;
  } | null;
  onSave: (data: {
    _id?: string;
    name: string;
    college_id: string;
    faculty: string;
    email: string;
    password: string;
  }) => void;
}

export default function TeacherDataModal({
  onClose,
  onSave,
  isUpdate,
  initialData,
}: ModalProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [faculty, setFaculty] = useState("Computing");
  const [email, setEmail] = useState(initialData?.email || "");
  const [college_id, setCollegeId] = useState(initialData?.college_id || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const isAnyFieldEmpty =
    !isUpdate && (!name || !faculty || !email || !password);

  const handleSave = () => {
    onSave({ name, faculty, email, college_id, password });
  };

  return (
    <div className="popup-modal-container">
      <div className="popup-register-modal">
        <h2>{isUpdate ? "Update Teacher" : "Register Teacher"}</h2>
        <div className="form-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {!isUpdate && (
          <div className="form-field">
            <label>College Id</label>
            <input
              type="college_id"
              value={college_id}
              onChange={(e) => setCollegeId(e.target.value)}
            />
          </div>
        )}
        <div className="form-field">
          <label>Faculty</label>
          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value.trim())}
          >
            <option value="Computing">Computing</option>
            <option value="Networking">Networking</option>
          </select>
        </div>
        {!isUpdate && (
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="modal-button">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={isAnyFieldEmpty}
          >
            {isUpdate ? "Update" : "Register"}
          </button>
          <button className="cancel-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
