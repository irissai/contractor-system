import React, { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";
import Navbar from "../navbar/LeftNavbar";
import TopNavbar from "../navbar/TopNavbar";
import { motion } from "framer-motion"; // <-- import
import HamburgerMenu from "../navbar/MHamburgerMenu";

const ProjectOverview = () => {
  const [tasks, setTasks] = useState([]);
  const [percentValues, setPercentValues] = useState([]);
  const [projectData, setProjectData] = useState({
    projectName: localStorage.getItem("projectName") || "ชื่อโครงการ",
    plotNumber: localStorage.getItem("plotNumber") || "เลขแปลง",
    contractDates: "01/01/2025 - 31/12/2025",
    houseDetail: "ศุภกฤต(T)/R DL Rev.3",
    mainContractor: "บจก.ABC",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // axios.get("https://contractor-6j0k.onrender.com/api/task/").then((response) => {
    axios.get("http://localhost:3000/api/task/").then((response) => {
      const data = response.data;
      let allTasks = [], percentArr = [];
      data.forEach((phaseObj) => {
        const phaseNumber = phaseObj.phase;
        phaseObj.tasks.forEach((task) => {
          allTasks.push({
            phase: phaseNumber,
            name: task.name,
            weight: task.weight,
            status: task.status || "",
            percent: task.percent || 0,
            calculatedValue: task.calculatedValue || 0,
          });
          percentArr.push(task.percent || 0);
        });
      });
      setTasks(allTasks);
      setPercentValues(percentArr);
    });
  }, []);

  const handlePercentChange = (index, value) => {
    const newPercentValues = [...percentValues];
    const numValue = Math.min(100, Math.max(0, Number(value)));
    newPercentValues[index] = numValue;
    setPercentValues(newPercentValues);
    const task = tasks[index];
    // axios.patch("https://contractor-6j0k.onrender.com/api/task/update-percent", {
    axios.patch("http://localhost:3000/api/task/update-percent", {
      phase: task.phase,
      taskName: task.name,
      percent: numValue,
    });
  };

  const phaseCounts = {};
  tasks.forEach((task) => {
    phaseCounts[task.phase] = (phaseCounts[task.phase] || 0) + 1;
  });



  return (
    <div className="layout" style={{}}>
      <TopNavbar onToggleMenu={() => setMenuOpen(true)} />
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
      <div className="container" style={{}}>

        <div className="sidebar desktop-sidebar">
          <Navbar />
        </div>
        <div className="main-content">
          <div className="installment-wrapper-home">
           <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>

              <div className="project-card" style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: 'rgba(0, 0, 0, 0.08) 0px 10px 25px'
              }}>
                <div className="installment-header">
                  <h1 style={{ fontWeight: "400", color: "#000", marginBottom: 16 }}>ข้อมูลโครงการ</h1>
                </div>
                <div
                  id="project-info"
                  style={{
                    fontSize: "18px",
                    color: "#475569",
                  }}
                >

                  <p>โครงการ: <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{projectData.projectName}</span></p>
                  <p>เลขแปลง: <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{projectData.plotNumber}</span></p>
                  <p>วันเริ่มต้น-สิ้นสุดสัญญา: <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{projectData.contractDates}</span></p>
                  <p>รายละเอียดบ้าน: <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{projectData.houseDetail}</span></p>
                  <p>ผู้รับเหมาหลัก: <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{projectData.mainContractor}</span></p>
                </div>
              </div>

              <div className="project-card">
                <h3 style={{ marginBottom: "20px", fontSize: '20px' }}>รายการงานตามงวด</h3>
                {Object.keys(phaseCounts).map((phase) => {
                  const phaseTasks = tasks.filter((t) => t.phase === parseInt(phase));
                  const totalForPhase = phaseTasks.reduce(
                    (sum, t) => sum + (t.weight * (percentValues[tasks.indexOf(t)] || 0)) / 100,
                    0
                  );
                  const maxTotalForPhase = phaseTasks.reduce((sum, t) => sum + t.weight, 0);
                  const progressPercent = (totalForPhase / maxTotalForPhase) * 100;

                  return (
                    <div key={phase} className="phase-box" style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "24px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
                      backgroundColor: "#fff"
                    }}>
                      <h4
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          marginBottom: "12px",
                          color: "#0f172a",
                          backgroundColor: "rgba(170, 191, 224, 0.06)", // ฟ้าอ่อนจาง ๆ

                          padding: "10px 16px",
                          borderRadius: "8px",
                          borderLeft: "4px solid rgb(89, 91, 92)",
                          display: "inline-block",
                        }}
                      >
                        งวดที่ {phase}
                      </h4>



                      <div className="tb-cl" style={{ display: "flex", flexWrap: "wrap", gap: "15px", overflowX: "auto" }}>

                        <table style={{ width: '100%', flex: 1, minWidth: "100px", fontSize: "14px", color: "#334155" }}>
                          <thead style={{ backgroundColor: "#f8fafc" }}>

                            <tr>
                              <th style={{ width: "69.9%", textAlign: "left", paddingBottom: "8px", padding: "6px 20px" }}>ชื่องาน</th>
                              <th style={{ width: "15%", textAlign: "center" }}>น้ำหนัก</th>
                              <th style={{ width: "15%", textAlign: "center" }}>% งาน</th>
                            </tr>

                          </thead>
                          <tbody>
                            {phaseTasks.map((task, index) => {
                              const globalIndex = tasks.indexOf(task);
                              return (
                                <tr key={index}>
                                  <td className="td-home" style={{ textAlign: "left", padding: "6px 20px" }}>{task.name}</td>
                                  <td className="td-home" style={{ textAlign: "center" }}>{task.weight}</td>
                                  <td className="td-home" style={{ textAlign: "center" }}>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      placeholder="% งาน"
                                      style={{
                                        width: '70px',
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '13px',
                                        textAlign: 'center',
                                        outline: 'none',
                                        transition: 'border 0.3s',
                                      }}
                                      onFocus={(e) => e.target.style.border = '1px solid rgb(106, 106, 106)'}
                                      onBlur={(e) => e.target.style.border = '1px solid #cbd5e1'}
                                      value={percentValues[globalIndex] || ""}
                                      onChange={(e) => handlePercentChange(globalIndex, e.target.value)}
                                    />

                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "160px", padding: "10px" }}>
                          <div className="t-progress" style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>ความคืบหน้า</div>
                          <div style={{ position: "relative", width: "100px", height: "100px" }}>
                            <svg viewBox="0 0 40 40" width="100" height="100">
                              <circle
                              className="circle-home"
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="4"
                              />
                              <circle
                               className="circle-home"
                                cx="20"
                                cy="20"
                                r="16"
                                fill="none"
                                stroke="rgb(138, 146, 152)"
                                strokeWidth="4"
                                strokeDasharray={`${progressPercent * 1.005}, 100`}
                                strokeLinecap="round"
                                transform="rotate(-90 20 20)"
                                style={{ transition: "stroke-dasharray 0.5s ease" }}
                              />
                              <text
                                x="20"
                                y="23"
                                textAnchor="middle"
                                fontSize="8px"
                                fill="#0f172a"
                                fontWeight="bold"
                              >
                                {progressPercent.toFixed(1)}%
                              </text>
                            </svg>
                          </div>
                          <div style={{ marginTop: "6px", fontSize: "13px", fontWeight: "500", color: "#475569" }}>
                            รวม: <span style={{ fontWeight: "600" }}>{totalForPhase.toFixed(2)}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
