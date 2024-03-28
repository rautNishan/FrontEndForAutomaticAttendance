import { useContext, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { AuthContext } from "../../common/Auth/Auth";
import customAxios from "../../../apis/axios";
import { AxiosError } from "axios";
interface IFaculty {
  _id: string;
  name: string;
  teacherCounts: number;
  studentCounts: number;
}
export default function AdminDashBoard() {
  // const token = localStorage.getItem("token");
  const { setIsLoggedIn, setUserRole } = useContext(AuthContext);
  const [teacherCount, setTotalTeacherCount] = useState(0);
  const [studentCount, setTotalStudentCount] = useState(0);
  const series = [studentCount, teacherCount];
  const labels = ["Students", "Teachers"];
  const [facultyList, setFacultyList] = useState<IFaculty[]>([]);
  const facultyNames = facultyList.map((faculty) => faculty.name);
  const teacherCounts = facultyList.map((faculty) => faculty.teacherCounts);
  const studentCounts = facultyList.map((faculty) => faculty.studentCounts);

  useEffect(() => {
    const listTeacherCount = `admin/get-all-teacher`;
    const listStudentCount = `admin/get-all-student`;
    const fetchTeacherData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await customAxios.get(listTeacherCount, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("This is Response: ", response.data.data.totalCount);
        setTotalTeacherCount(response.data.data.totalCount);
      } catch (error) {
        setUserRole("");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        if (error instanceof AxiosError && error.response) {
          alert(error.response.data.message);
        }
        throw error;
      }
    };
    const fetchStudentCount = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await customAxios.get(listStudentCount, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("This is Response: ", response.data.data.totalCount);
        setTotalStudentCount(response.data.data.totalCount);
      } catch (error) {
        setUserRole("");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        if (error instanceof AxiosError && error.response) {
          alert(error.response.data.message);
        }
        throw error;
      }
    };

    const fetchFaculties = async () => {
      const getAllFacultiesApi = "/admin/get-all-faculty";
      try {
        const token = localStorage.getItem("token");
        console.log("this is token: ", token);
        const response = await customAxios.get(getAllFacultiesApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("This is ResponseData: ", response.data.data);

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
    fetchTeacherData();
    fetchStudentCount();
    fetchFaculties();
  }, [setTotalTeacherCount, setTotalStudentCount, setIsLoggedIn, setUserRole]);

  const options = {
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const barChartOptions = {
    chart: {
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: facultyNames,
    },
    yaxis: {
      title: {
        text: "Counts",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val + " counts";
        },
      },
    },
  };

  const barChartSeries = [
    {
      name: "Teachers",
      data: teacherCounts ?? 0,
    },
    {
      name: "Students",
      data: studentCounts ?? 0,
    },
  ];
  return (
    <>
      <div className="dash_container">
        <h1>Total User in the Application</h1>
        <div className="chart-container">
          <div className="chart-wrapper">
            <Chart
              options={options}
              series={series}
              type="pie"
              width="500"
              height={480}
            />
          </div>
          <div className="chart-wrapper">
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={350}
              width={690}
            />
          </div>
        </div>
      </div>
    </>
  );
}
