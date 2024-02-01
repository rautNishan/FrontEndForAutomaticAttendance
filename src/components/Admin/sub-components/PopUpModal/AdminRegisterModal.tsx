import { useState } from "react";
import "./ModalCssForAdmin/RegisterTeacherModal.css";

interface ModalProps {
  onClose: () => void;
  isUpdate?: boolean;
  initialData?: {
    name: string;
    faculty: string;
    email: string;
    password: string;
  } | null;
  onSave: (data: {
    _id?: string;
    name: string;
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
  const [faculty, setFaculty] = useState(initialData?.faculty || "Computing");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const isAnyFieldEmpty =
    !isUpdate && (!name || !faculty || !email || !password);

  const handleSave = () => {
    onSave({ name, faculty, email, password });
  };

  return (
    <div className="teacher-modal-container">
      <div className="teacher-register-modal">
        <h2>{isUpdate ? "Update Teacher" : "Register Teacher"}</h2>
        <div className="form-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Faculty</label>
          <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
            <option value="Computing">Computing</option>
            <option value="Networking">Networking</option>
          </select>
        </div>
        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
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
