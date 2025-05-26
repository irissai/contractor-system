import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/LeftNavbar";
import TopNavbar from "../navbar/TopNavbar";
import { motion } from "framer-motion"; // <-- import
import HamburgerMenu from "../navbar/MHamburgerMenu";


const ProjectOverview = () => {
  const [tasks, setTasks] = useState([]);
  const [projectData, setProjectData] = useState({
    projectName: localStorage.getItem("projectName") || "ชื่อโครงการ",
    plotNumber: localStorage.getItem("plotNumber") || "เลขแปลง",
    houseType: localStorage.getItem("houseType") || "ศุภกฤต(T)/R DL Rev.3",
  });
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // axios.get("https://contractor-6j0k.onrender.com/api/task/")
    axios.get("http://localhost:3000/api/task/")
      .then(response => {
        const data = response.data;
        let allTasks = [];
        data.forEach(phaseObj => {
          const phaseNumber = phaseObj.phase;
          const documents = phaseObj.documents || [];
          phaseObj.tasks.forEach(task => {
            allTasks.push({
              phase: phaseNumber,
              name: task.name,
              weight: task.weight,
              status: task.status || "",
              documents: documents,
            });
          });
        });
        setTasks(allTasks);
      })
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  const phaseCounts = {};
  tasks.forEach((task) => {
    phaseCounts[task.phase] = (phaseCounts[task.phase] || 0) + 1;
  });

  const handleSelectTask = (task) => {
    navigate("/request/form", {
      state: {
        selectedTask: task,
        projectName: projectData.projectName,
        plotNumber: projectData.plotNumber,
        houseType: projectData.houseType,
        phase: task.phase,
        documents: task.documents,
      }
    });
  };

  return (
    <div className="layout" style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <TopNavbar onToggleMenu={() => setMenuOpen(true)} />
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
      <div className="container" style={{}}>

        <div className="sidebar desktop-sidebar">
          <Navbar />
        </div>
        <div className="main-content" style={{ flexGrow: 1, backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)", padding: "30px 40px", }}>
          <div className="installment-wrapper-req">
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>



              <div className="installment-header">
                <h1 style={{ fontWeight: "400", color: "#000", marginBottom: 16 }}>
                  ยื่นคำขอตรวจงาน
                </h1> </div>
              {/* #4b3b1b */}

              <div id="project-info" style={{}}>
                <p>โครงการ:  <span style={{ fontSize: "16px", color: "#475569" }}>{projectData.projectName}</span></p>
                <p>เลขแปลง:  <span style={{ fontSize: "16px", color: "#475569" }}>{projectData.plotNumber}</span></p>
                <p>แบบบ้าน: <span style={{ fontSize: "16px", color: "#475569" }}>{projectData.houseType}</span></p>
              </div>
              <h3 style={{ fontWeight: "500", color: "#444", fontSize: '16px' }}>
                รายการงวดและการยื่นคำขอตรวจงาน
              </h3>
                                    <div className="tb-cl" style={{ display: "flex", flexWrap: "wrap", gap: "15px", overflowX: "auto" }}>

              <table
                id="taskTable"
                style={{
minWidth: "100px",
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "16px",
                  color: "#334155",
                  borderSpacing: "0 0",  // เว้นระหว่างแถว 0 เพราะเว้นด้วย tbody
                }}
              >
                <thead>
                  <tr style={{ color: "#fff", backgroundColor: 'gb(114, 116, 118)' }}>
                    <th style={{ width: "80px", color: "#000", padding: "12px 10px", textAlign: "center", fontWeight: "500" }}>งวดที่</th>
                    <th style={{ padding: "12px 10px", color: "#000", fontWeight: "500" }}>ชื่องาน</th>
                    <th style={{ width: "120px", color: "#000", padding: "12px 10px", fontWeight: "500", textAlign: "center" }}>ยื่นใบ request</th>
                    <th style={{ width: "120px", color: "#000", padding: "12px 10px", fontWeight: "500", textAlign: "center" }}>สถานะ</th>
                  </tr>
                </thead>

                {/* สร้าง tbody แยกแต่ละ phase */}
                {Object.entries(phaseCounts).map(([phase, count]) => {
                  const tasksInPhase = tasks.filter(task => task.phase.toString() === phase);

                  return (
                    <tbody
                      key={phase}
                      style={{

                        marginBottom: "20px", // เว้นช่องว่างระหว่างงวด
                        display: "table-row-group",
                        borderCollapse: "separate",
                        borderSpacing: "0 0", // เว้นแถวในงวดนี้ 0
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      {tasksInPhase.map((task, index) => (
                        <tr key={index}>
                          {index === 0 && (
                            <td
                              rowSpan={count}
                              style={{
                                verticalAlign: "top",
                                textAlign: "center",
                                padding: "16px 10px",
                                fontWeight: "500",
                                color: "#0f172a",
                                backgroundColor: "#fff",
                                // border: "1px solid #3e3e3e",
                              }}
                            >
                              งวดที่ {phase}
                            </td>
                          )}
                          <td className="td-task-name" style={{ padding: "14px 20px", textAlign: "left" }}>{task.name}</td>
                          <td style={{ padding: "14px 10px", textAlign: "center" }}>

                            <button
                              className="bt-select"
                              onClick={() => handleSelectTask(task)}
                              style={{
                                padding: "8px 20px",
                                backgroundColor: "rgb(219, 219, 219)", // ทองเข้มน้ำตาล
                                color: "#000",
                                borderRadius: 8,
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "500",
                                boxShadow: "0 3px 3px rgba(0, 0, 0, 0.31)",
                                transition: "all 0.3s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgb(184, 184, 184)")} // hover ทองเข้ม
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgb(219, 219, 219)")}
                            >
                              เลือก
                            </button>



                          </td>
                          <td style={{ padding: "14px 10px", textAlign: "center" }}>
                            <span
                            className="span-Work-progress"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "6px 8px",
                                fontSize: "10px",
                                fontWeight: "500",
                                borderRadius: "9999px",
                                backgroundColor: task.status === "กำลังดำเนินงาน" ? "rgb(254, 255, 236)" : "#F8FAFC", // เหลืองครีมอ่อนๆ
                                color: task.status === "กำลังดำเนินงาน" ? "rgb(240, 187, 27)" : "#475569", // เหลืองทองเข้มดูหรู
                                border:
                                  task.status === "กำลังดำเนินงาน"
                                    ? "1px solid rgb(240, 187, 27)" // ขอบเหลืองทองอ่อน
                                    : "1px solid #CBD5E1",
                                minWidth: "100px",
                                justifyContent: "center",
                              }}
                            >
                              {task.status === "กำลังดำเนินงาน" && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="13"
                                  height="13"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="rgb(240, 187, 27)"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              )}
                              {task.status || "-"}
                            </span>


                          </td>

                        </tr>
                      ))}
                    </tbody>
                  );
                })}
              </table>
</div>


            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
