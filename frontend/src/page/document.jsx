import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import "./home.css";
import "./document.css";
import Navbar from "../navbar/LeftNavbar";
import TopNavbar from "../navbar/TopNavbar";
import HamburgerMenu from "../navbar/MHamburgerMenu";

const InstallmentSelection = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [phases, setPhases] = useState([]); // เก็บงวดที่มีจริง
  const [documentsByPhase, setDocumentsByPhase] = useState({});
  const [projectData, setProjectData] = useState({
    projectName: localStorage.getItem("projectName") || "ชื่อโครงการ",
    plotNumber: localStorage.getItem("plotNumber") || "เลขแปลง",
    houseType: localStorage.getItem("houseType") || "ศุภกฤต(T)/R DL Rev.3",
  });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // axios.get("https://contractor-6j0k.onrender.com/api/task/")
    axios.get("http://localhost:3000/api/task/")
      .then(response => {
        const data = response.data;
        console.log("Raw data from backend:", data);  // <== เพิ่มตรงนี้เช็คข้อมูลดิบ
        let allTasks = [];
        let phaseSet = new Set();
        let documentsMap = {};

        data.forEach(phaseObj => {
          const phaseNumber = phaseObj.phase;
          phaseSet.add(phaseNumber);

          documentsMap[phaseNumber] = phaseObj.documents || [];

          phaseObj.tasks.forEach(task => {
            allTasks.push({
              phase: phaseNumber,
              name: task.name,
            });
          });
        });

        setTasks(allTasks);
        setPhases([...phaseSet].sort((a, b) => a - b));
        setDocumentsByPhase(documentsMap);
      })
      .catch(error => {
        console.error("Error fetching tasks:", error);
      });
  }, []);


  const handleSelect = (phaseNumber) => {
    const tasksForPhase = tasks.filter(task => task.phase === phaseNumber);
    const documentsForPhase = documentsByPhase[phaseNumber] || [];

    navigate(`/document/${phaseNumber}`, {
      state: {
        phase: phaseNumber,
        tasks: tasksForPhase,
        documents: documentsForPhase, // ส่งไปตรงนี้
        projectName: projectData.projectName,
        plotNumber: projectData.plotNumber,
        houseType: projectData.houseType,
      },
    });
  };




  return (
    <div className="layout">
        <TopNavbar onToggleMenu={() => setMenuOpen(true)} />
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
      <div className="container" style={{}}>

        <div className="sidebar desktop-sidebar">
          <Navbar />
        </div>
        <div className="main-content">
          <div className="installment-wrapper">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="installment-card"
            >
              <div className="installment-header">
                <h1 style={{ fontWeight: "400", color: "#000", marginBottom: 16 }}>ยื่นเอกสารเบิกงวด</h1>
                <p>เลือกงวดที่คุณต้องการยื่นเอกสารด้านล่าง</p>
              </div>

              <div className="installment-grid">
                {phases.map((phase) => (
                  <motion.button
                    key={phase}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(phase)}
                    className="installment-button"
                  >
                    <FileText className="icon" />
                    งวดที่ {phase}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallmentSelection;
