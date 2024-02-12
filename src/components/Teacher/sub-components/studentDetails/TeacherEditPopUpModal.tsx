import { useState } from "react";

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

interface ModalProps {
  onSave: (attendanceStatus: string) => void;
  onClose: () => void;
}

export default function TeacherEditAttendanceModal({
  onSave,
  onClose,
}: ModalProps) {

  const [attendanceStatus, setAttendanceStatus] = useState("PRESENT");
  //To initialize the default(Incoming) value in dropdown

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAttendanceStatus(event.target.value);
  };

  return (
    <>
      <div className="popup-modal-container">
        <div className="popup-edit-attendance-modal">
          <select value={attendanceStatus} onChange={handleSelectChange}>
            <option value="PRESENT">PRESENT</option>
            <option value="ABSENT">ABSENT</option>
            <option value="LATE">LATE</option>
            <option value="VERY LATE">VERY LATE</option>
          </select>
          <button className="edit_button" onClick={() => onSave(attendanceStatus)}>
            Save
          </button>
          <button className="delete_button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
