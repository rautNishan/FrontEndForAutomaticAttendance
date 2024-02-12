import { useEffect, useState } from "react";
import customAxios from "../../../../apis/axios";

interface ISection {
  _id: string;
  section: string;
}

interface ModalProps {
  inComingSectionData: ISection;
  onClose: () => void;
}

interface ITimeTable {
  subject: string;
  startTime: string;
  endTime: string;
}

interface ISectionDetailProps {
  _id: string;
  section: string;
  studentCounts: number;
  teacherCounts: number;
  timeTable: ITimeTable[];
}

export function SectionDetail({ inComingSectionData, onClose }: ModalProps) {
  const [sectionData, setSectionData] = useState<ISectionDetailProps>();
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newSubject, setNewSubject] = useState("");

  useEffect(() => {
    const fetchSectionDetail = async () => {
      const token = localStorage.getItem("token");
      const getSectionAccordingApi = `/admin/get-all-section?section=${inComingSectionData.section}`;
      const response = await customAxios.get(getSectionAccordingApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSectionData(response.data.data.existingData[0]);
    };
    fetchSectionDetail();
  }, [inComingSectionData.section]);

  const updateSectionTimeTable = async (updatedTimeTable: ITimeTable[]) => {
    const token = localStorage.getItem("token");
    const response = await customAxios.patch(
      `/admin/update-section/${inComingSectionData?._id}`,
      { timeTable: updatedTimeTable },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      setSectionData((prevData) =>
        prevData
          ? {
              ...prevData,
              timeTable: updatedTimeTable,
            }
          : undefined
      );
    } else {
      console.error("Failed to update time");
    }
  };

  const handleAddTime = async () => {
    if (newSubject && newStartTime && newEndTime && sectionData) {
      const newTimeSlot = {
        subject: newSubject,
        startTime: newStartTime,
        endTime: newEndTime,
      };
      const updatedTimeTable = [...sectionData.timeTable, newTimeSlot];
      await updateSectionTimeTable(updatedTimeTable);
      setNewSubject("");
      setNewStartTime("");
      setNewEndTime("");
    }
  };

  const handleEdit = async (
    index: number,
    field: keyof ITimeTable,
    value: string
  ) => {
    if (sectionData) {
      const updatedTimeTable = [...sectionData.timeTable];
      updatedTimeTable[index][field] = value;
      await updateSectionTimeTable(updatedTimeTable);
    }
  };

  const handleDelete = async (timeSlotToDelete: ITimeTable) => {
    if (sectionData) {
      const updatedTimeTable = sectionData.timeTable.filter(
        (timeSlot) => timeSlot !== timeSlotToDelete
      );
      await updateSectionTimeTable(updatedTimeTable);
    }
  };

  return (
    <>
      <div className="popup-modal-container">
        <div className="popup-section-detail-modal">
          <h1>Section: {inComingSectionData?.section}</h1>
          <h1>Student Count:{sectionData?.studentCounts}</h1>
          <h1>Teacher Count:{sectionData?.teacherCounts}</h1>
          <h1>Time Table:</h1>
          <div className="table_body">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sectionData?.timeTable.map((timeSlot, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{timeSlot.subject}</strong>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={timeSlot.startTime}
                        onChange={(e) =>
                          handleEdit(index, "startTime", e.target.value)
                        }
                      />
                      -
                      <input
                        type="text"
                        value={timeSlot.endTime}
                        onChange={(e) =>
                          handleEdit(index, "endTime", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="delete_button"
                        onClick={() => handleDelete(timeSlot)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="add_time">
            <h1>Add Time:</h1>
            <input
              type="text"
              placeholder="Subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <input
              type="text"
              placeholder="Start Time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
            />
            <input
              type="text"
              placeholder="End Time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
            />
            <button className="edit_button" onClick={handleAddTime}>
              Add Time
            </button>
          </div>
          <button className="delete_button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      
    </>
  );
}
