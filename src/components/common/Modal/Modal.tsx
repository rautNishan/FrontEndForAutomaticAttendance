import { useState } from "react";
import "./Modal.css";
interface IFaculty {
  _id: string;
  name: string;
}
interface ModalProps {
  faculty: IFaculty;
  onClose: () => void;
  onSave: (updatedName: string) => void;
}

export default function Modal({ faculty, onClose, onSave }: ModalProps) {
  const [updatedName, setUpdatedName] = useState(faculty.name);
  const id = faculty._id;
  console.log("This is id: ", id);
  console.log("This is Updated Name Updated name: ", updatedName);
  const handleSave = () => {
    onSave(updatedName);
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>Edit Faculty</h2>
        <input
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
          required
        />
        <div className="modal-button">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
