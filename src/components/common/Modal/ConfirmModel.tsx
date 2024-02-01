import { useState } from "react";
import "./Modal.css";
interface IData {
  _id?: string;
  name?: string;
  faculty?: string;
  email?: string;
  password?: string;
}
interface ModalProps {
  data: IData;
  onClose: () => void;
  onSave: () => void;
}

export default function ConfirmModal({ data, onClose, onSave }: ModalProps) {
  const [updatedName, setUpdatedName] = useState(data.name);
  const fixedName = data.name;
  const id = data._id;
  console.log("This is id: ", id);
  console.log("This is Updated Name Updated name: ", updatedName);
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
            disabled={updatedName !== fixedName}
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