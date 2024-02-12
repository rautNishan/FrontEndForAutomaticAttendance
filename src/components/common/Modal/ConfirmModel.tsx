import { useState } from "react";
import "./Modal.css";
interface IData {
  _id?: string;
  name?: string;
  faculty?: string;
  email?: string;
  password?: string;
  section?: string;
}
interface ModalProps {
  data: IData;
  onClose: () => void;
  onSave: () => void;
}

export default function ConfirmModal({ data, onClose, onSave }: ModalProps) {
  const [updatedName, setUpdatedName] = useState("");
  const fixedName = data?.name || data?.section;
  const handleSave = () => {
    onSave();
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>
          Please Type "<span className="highlight">{fixedName}</span>" to Delete
        </h2>
        <input onChange={(e) => setUpdatedName(e.target.value)} required />
        <div className="modal-button">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={updatedName !== fixedName || updatedName === ""}
          >
            Delete
          </button>
          <button className="cancel-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
