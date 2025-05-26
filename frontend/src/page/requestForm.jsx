import React, { useState } from "react";
import "./home.css";
import "./request.css";
import Navbar from "../navbar/LeftNavbar";
import TopNavbar from "../navbar/TopNavbar";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { motion } from "framer-motion"; // <-- import
import HamburgerMenu from "../navbar/MHamburgerMenu";
import BASE_URL from "../config/api";


const workItems = [
  "ตอกเข็มที่",
  "เทคอนกรีตที่",
  "วางแผ่นพื้นสำเร็จรูปชั้นที่",
  "ก่ออิฐชั้นที่",
  "ปูนทรายปรับระดับพื้นที่",
  "ก่ออิฐปิดช่อง Shafl ที่",
  "ฉาบปูนชั้นที่",
  "Skin Coat ชั้นที่",
  "ปูกระเบื้อง",
  "ทาน้ำยากันซึมที่ผนัง",
  "ทาสีรองพื้นที่",
  "ติดตั้งวงกบอลูมิเนียม/UPVCที่",
  "ติดตั้งฝ้าเพดานที่",
  "ติดตั้งสุขภัณฑ์ห้องน้ำ",
  "ติดตั้งไม้บันได",
  "ติดตั้งถังบำบัดน้ำเสีย,ถังดักไขมัน",
  "ปักแท่ง Ground Rod และเชื่อมต่อสายดิน",
  "กลบดินฝังท่อไฟฟ้า,ทีวี,โทรศัพท์",
  "กลบดินฝังท่อสุขาภิบาล",
  "ทดสอบระบบไฟฟ้า, ทีวี, โทรทัศน์",
  "ทดสอบระบบประปาสุขาภิบาล",
  "ต่อท่อระบายน้ำอาคารกับบ่อพักโครงการ",
];


export default function RequestForm() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedWorkItems, setSelectedWorkItems] = useState([]);
  const [installmentValue, setInstallmentValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const {
    selectedTask,
    projectName,
    plotNumber,
    houseType,
    phase,
    documents
  } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/api/task/update-status`, {
        phase: selectedTask.phase,
        name: selectedTask.name,
        newStatus: "กำลังดำเนินงาน",
      });
      console.log("response", response);
      setShowModal(true);
    } catch (error) {
      console.error("Update error:", error);
      alert("อัปเดตสถานะไม่สำเร็จ");
    }
  };

  const handleGoToRequest = () => {
    navigate("/request")
  };

  const handleGoToDocument = () => {
    navigate("/document/attach-documents", {
      state: {
        selectedWorkItems,
        installmentValue,
        projectName,
        plotNumber,
        houseType,
        phase,
        selectedTask,
        documents
      },
    });
  };

  console.log(documents)
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedWorkItems((prev) => [...prev, value]);
    } else {
      setSelectedWorkItems((prev) => prev.filter((item) => item !== value));
    }
  };


  const breadcrumbs = [
    <Link underline="hover" style={{ cursor: 'pointer' }} key="1" color="inherit" onClick={() => navigate("/request")} >
      รีเควส
    </Link>,
    <Typography key="2" sx={{ color: 'text.primary' }}>
      ฟอร์มใบรีเควส
    </Typography>,
  ];


  return (
    <div className="layout">

      {showModal && (
        <>
          <div className="modal-overlay" />
          <div className="modal-box">
            <div className="modal-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="green"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="checkmark-icon"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2l4-4" />
              </svg>
            </div>

            <h3 style={{ marginBottom: '10px' }}>ส่งคำร้องเรียบร้อยแล้ว</h3>
            <p>คุณสามารถแนบเอกสารเบิกงวดต่อได้เลย</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={handleGoToRequest}>ตกลง</button>
              <button className="btn btn-primary" onClick={handleGoToDocument}>แนบเอกสารเบิกงวด</button>
            </div>
          </div>
        </>
      )}
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
              <Breadcrumbs
                style={{ marginBottom: '20px' }}
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
              >
                {breadcrumbs}
              </Breadcrumbs>

              <div className="content-request" >
                <h3>แบบฟอร์มใบรีเควส</h3>
                <div id="project-info" style={{ width: '90%', margin: '0 auto' }}>
                  <p>โครงการ: <span style={{ fontSize: "16px", color: "#475569" }}>{projectName}</span></p>
                  <p>เลขแปลง: <span style={{ fontSize: "16px", color: "#475569" }}>{plotNumber}</span></p>
                  <p>แบบบ้าน: <span style={{ fontSize: "16px", color: "#475569" }}>{houseType}</span></p>
                </div>
                <br />

                <form onSubmit={handleSubmit} style={{ width: '90%', margin: '0 auto' }}>
                  <label >ประเภทงาน:</label>
                  <div id="workTypeCheckboxes">
                    {workItems.map((item, index) => (
                      <label key={index}>
                        <input
                          type="checkbox"
                          name="workType"
                          value={item}
                          onChange={handleCheckboxChange}
                        />
                        {item}
                        <input
                          type="text"
                          name={`detail_${item}`}
                          className="underline-input"
                          placeholder="รายละเอียด"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="contractor-section">
                    <label className="section-label">ผู้รับเหมาพร้อมให้เข้าตรวจ:</label>
                    <div className="contractor-grid">
                      <div className="contractor-field">
                        <label>ชื่อผู้รับเหมา</label>
                        <input type="text" name="contractorName" placeholder="กรอกชื่อผู้รับเหมา" required />
                      </div>
                      <div className="contractor-field">
                        <label>วันที่ตรวจ</label>
                        <input type="date" name="inspectionDate" required />
                      </div>
                      <div className="contractor-field">
                        <label>เวลาตรวจ</label>
                        <input type="time" name="inspectionTime" required />
                      </div>
                    </div>
                  </div>


                  <div className="mt-4" style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button type="submit" className="btn btn-warning">ร้องขอตรวจงาน</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
