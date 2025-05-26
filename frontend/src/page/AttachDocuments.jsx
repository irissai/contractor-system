import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./home.css";
import Navbar from "../navbar/LeftNavbar";
import TopNavbar from "../navbar/TopNavbar";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Snackbar, Alert } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Input } from "@mui/material";
import { motion } from "framer-motion";
import HamburgerMenu from "../navbar/MHamburgerMenu";


const AttachDocuments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectData, setProjectData] = useState({
    projectName: localStorage.getItem("projectName") || "ชื่อโครงการ",
    plotNumber: localStorage.getItem("plotNumber") || "เลขแปลง",
    houseType: localStorage.getItem("houseType") || "ศุภกฤต(T)/R DL Rev.3",
  });
  const {
    phase,
    documents,
    projectName,
    plotNumber,
    houseType,

  } = location.state || {};
  const [menuOpen, setMenuOpen] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState({});

  // สำหรับควบคุมการแสดง Snackbar
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // success, error, warning, info
  });

  const handleFileChange = (index, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [index]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("phase", phase);

    documents.forEach((doc, index) => {
      const file = uploadedFiles[index];
      if (file) {
        formData.append("documents", file);
        formData.append("labels", doc.label);
      }
    });

    try {
      // await axios.post("https://contractor-6j0k.onrender.com/api/task/upload-documents", formData, {
      await axios.post("http://localhost:3000/api/task/upload-documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // แสดง Toast success
      setToast({
        open: true,
        message: "บันทึกเอกสารสำเร็จ",
        severity: "success",
      });

      // รอให้ toast แสดงก่อน แล้วค่อย navigate
      setTimeout(() => {
        navigate("/document");
      }, 2000);
    } catch (error) {
      console.error("Upload failed:", error);

      // แสดง Toast error
      setToast({
        open: true,
        message: "เกิดข้อผิดพลาดในการบันทึกเอกสาร",
        severity: "error",
      });
    }
  };

  const breadcrumbs = [
    <Link underline="hover" style={{ cursor: 'pointer' }} key="1" color="inherit" onClick={() => navigate("/document")}>
      เอกสารเบิกงวด
    </Link>,
    <Typography key="2" sx={{ color: 'text.primary' }}>
      แนบเอกสาร
    </Typography>,
  ];
  function shortenFileName(filename) {
    if (!filename) return "";

    // หา index จุด (.) ตัวสุดท้าย เพื่อแยกนามสกุล
    const dotIndex = filename.lastIndexOf(".");

    if (dotIndex === -1) {
      // ไม่มีนามสกุลไฟล์
      return filename.length > 14 ? filename.slice(0, 5) + "..." : filename;
    }

    const name = filename.slice(0, dotIndex);
    const ext = filename.slice(dotIndex + 1);

    if (filename.length <= 14) return filename;

    // ตัดชื่อไฟล์เหลือ 5 ตัวแรก + ... + นามสกุล
    return name.slice(0, 8) + "..." + ext;
  }


  return (
    // <div className="">

    <div className="layout" style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}>

      {/* Snackbar + Alert */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          severity={toast.severity}
          sx={{
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 3px 8px rgba(73, 87, 73, 0.4)',


            backgroundColor: (theme) => {
              switch (toast.severity) {
                case 'success':
                  return '#1976d2';
                case 'error':
                  return '#d32f2f'; 
                case 'warning':
                  return '#ed6c02'; 
                case 'info':
                  return '#0288d1'; 
                default:
                  return theme.palette.background.paper;
              }
            },
            color: '#fff',  
            fontWeight: 'bold',
            '& .MuiAlert-icon': {
              color: toast.severity === 'success' ? '#fff' : undefined, // ถ้า success ให้เป็นสีน้ำเงิน
            },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>


     <TopNavbar onToggleMenu={() => setMenuOpen(true)} />
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
      <div className="container" style={{ display: "flex", gap: "20px", padding: "40px" }}>

              <div className="sidebar desktop-sidebar">
                <Navbar />
              </div>

        <div className="installment-wrapper-req">
          <Breadcrumbs style={{ marginBottom: '20px' }} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>

         <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>

            <div className="main-content" style={{ flexGrow: 1, backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)", padding: "30px 40px", }}>

              <div className="installment-header">


                <Typography
                  variant="h4"
                  sx={{
                    textAlign: 'left',
                    fontWeight: 500,
                    mt: 5, color: "#000",
                    pb: 1,
                    fontSize: '28px'
                  }}
                >
                  แนบเอกสารเบิกงวดที่ {phase}
                </Typography>

                <div id="project-info" style={{ textAlign: 'left', }}>
                  <p>โครงการ:  <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{projectName}</span></p>
                  <p>เลขแปลง:  <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{plotNumber}</span></p>
                  <p>แบบบ้าน: <span style={{
                    fontSize: "16px",
                    color: "#475569",
                  }}>{houseType}</span></p>
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: '50px' }}>
                  <TableContainer
                    component={Paper}
                    sx={{
                      // width: '80%',
                      margin: 'auto',
                      // mt: 3,
                      // borderRadius: 3,
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Table sx={{ tableLayout: "fixed", marginTop: '0', borderRadius: 0 }}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell
  sx={{
    fontSize: '16px',
    fontWeight: "bold",
    color: '#1A202C',
    textAlign: 'center',
    maxWidth: '300px', // ปรับความกว้างสูงสุด
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }}
>
  เอกสาร
</TableCell>
                      <TableCell
  sx={{
    fontSize: '16px',
    fontWeight: "bold",
    color: '#1A202C',
    textAlign: 'center',
    borderBottom: '1px solid #E2E8F0',
  }}
>
  แนบไฟล์
</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {documents.length > 0 ? documents.map((doc, index) => (
                          <TableRow key={index} sx={{ '&:hover': {} }}>
                            <TableCell sx={{ fontSize: '15px', color: '#4A5568', py: 1.5 }}>
                              {doc.label}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                              <label htmlFor={`upload-file-${index}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
                                <Input
                                  id={`upload-file-${index}`}
                                  type="file"
                                  sx={{ display: 'none' }}
                                  onChange={(e) => handleFileChange(index, e.target.files[0])}
                                />
                                <Button
                                  variant="outlined"
                                  component="span"
                                  className="bt-selectFile"
                                  sx={{
                                    borderRadius: '8px',
                                    backgroundColor: 'rgb(219, 219, 219)',
                                    border: "none",
                                    boxShadow: "0 3px 3px rgba(0, 0, 0, 0.31)",
                                    color: '#000',
                                    // fontWeight: 'bold',
                                    px: 2,
                                    '&:hover': {
                                      backgroundColor: 'rgb(184, 184, 184)',
                                    }
                                  }}
                                >
                                  เลือกไฟล์
                                </Button>
                                {uploadedFiles[index] && (
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontSize: 14,
                                      color: "text.secondary",
                                      maxWidth: "150px",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}
                                  >
                                    {shortenFileName(uploadedFiles[index].name)}
                                  </Typography>
                                )}
                              </label>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={2} align="center" sx={{ py: 2 }}>
                              ไม่พบรายการเอกสาร
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>


                  <Box sx={{ marginTop: 3, display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        px: 5,
                        py: 0.75,
                        fontSize: "15px",
                        fontWeight: "bold",
                        borderRadius: 20,
                        backgroundColor: '#606060',
                        boxShadow: '0 3px 3px rgba(0, 0, 0, 0.31)',
                        '&:hover': {
                          backgroundColor: '#3e3e3e',
                        },
                      }}
                    >
                      บันทึก
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => navigate("/document")}
                      sx={{
                        px: 5,
                        py: 0.75,
                        fontSize: "15px",
                        borderRadius: 20,
                        borderColor: '#999',
                        color: '#333',
                        '&:hover': {
                          borderColor: '#999',
                          color: '#000',
                          backgroundColor: 'rgb(232, 232, 232)',
                        },
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </Box>

                </form>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default AttachDocuments;
