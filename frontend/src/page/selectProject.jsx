import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './selectProject.css';



const ContractorProjectSelect = () => {
  const [customProject, setCustomProject] = useState('');
  const [customPlotNumber, setCustomPlotNumber] = useState('');
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [selectedPlotNumber, setSelectedPlotNumber] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const userData = location.state?.userData || null;

  useEffect(() => {
    if (userData) {
      setSelectedProjectName(userData.projectName || '');
      setSelectedPlotNumber(userData.plotNumber || '');
    }
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const projectName = selectedProjectName === 'other'
      ? customProject.trim()
      : selectedProjectName;

    const plotNumber = selectedPlotNumber === 'other'
      ? customPlotNumber.trim()
      : selectedPlotNumber;

    if (!projectName || !plotNumber) {
      alert('ไม่มีโครงการหรือเลขแปลง');
      return;
    }

    localStorage.setItem('projectName', projectName);
    localStorage.setItem('plotNumber', plotNumber);

    navigate('/');
  };

  return (
    <div className="project-select-wrapper-select">
    <motion.div
      className="project-select-container"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1>ยินดีต้อนรับคุณ <br /><span style={{color:'#efbc23',fontWeight:'500',fontSize:'30px'}}>"{userData?.username || 'Guest'}"</span> </h1>
      <h2 style={{  color: '#6b7280', fontWeight:'400', fontSize:'16px',marginBottom:'40px',}}>กรุณาเลือกโครงการและเลขแปลง</h2>

      <form onSubmit={handleSubmit} className="project-select-form">
        <label htmlFor="projectDropdown">ชื่อโครงการ:</label>
        <select
          id="projectDropdown"
          value={selectedProjectName}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedProjectName(value);
            if (value === 'other') {
              setSelectedPlotNumber('');
            } else {
              setSelectedPlotNumber(userData?.plotNumber || '');
            }
          }}
        >
          <option value="" disabled>-- เลือกโครงการ --</option>
          {userData?.projectName && (
            <option value={userData.projectName}>{userData.projectName}</option>
          )}
          <option value="other">อื่นๆ</option>
        </select>

        {selectedProjectName === 'other' && (
          <input
            type="text"
            placeholder="พิมพ์ชื่อโครงการ..."
            value={customProject}
            onChange={(e) => setCustomProject(e.target.value)}
            className="project-input"
          />
        )}

        <label htmlFor="plotNumberDropdown">เลขแปลง:</label>
        <select
          id="plotNumberDropdown"
          value={selectedPlotNumber}
          onChange={(e) => setSelectedPlotNumber(e.target.value)}
        >
          <option value="" disabled>-- เลือกเลขแปลง --</option>
          {userData?.plotNumber && (
            <option value={userData.plotNumber}>{userData.plotNumber}</option>
          )}
          <option value="other">อื่นๆ</option>
        </select>

        {selectedPlotNumber === 'other' && (
          <input
            type="text"
            placeholder="พิมพ์เลขแปลง..."
            value={customPlotNumber}
            onChange={(e) => setCustomPlotNumber(e.target.value)}
            className="project-input"
          />
        )}

        <motion.button
          type="submit"
          className="submit-button"
          whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(67, 67, 67, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          style={{marginTop:'20px'}}
        >
          ยืนยัน
        </motion.button>
      </form>
    </motion.div>
    </div>
  );
};

export default ContractorProjectSelect;
