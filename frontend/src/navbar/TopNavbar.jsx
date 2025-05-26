import React, { useEffect, useState } from "react";
import "./TopNavbar.css";
import { FaUserCircle } from "react-icons/fa";

import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TopNavbar = ({ onToggleMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleMenuClick = () => {
    if(onToggleMenu) onToggleMenu();
  };

  return (
    <>
      <header className={isScrolled ? "top-navbar scroll" : "top-navbar"}>
        <div className="left-section">
          {/* ปุ่มแฮมเบอร์เกอร์ - แสดงเฉพาะจอเล็ก */}
          <button
            className="menu-toggle"
            onClick={handleMenuClick}
            aria-label="Toggle menu"
          >
            <FiMenu size={31} />
          </button>

          <div className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
            <img src="https://www.supalai.com/images/layout/logo.svg" alt="Logo" />
          </div>
        </div>

        <FaUserCircle className="icon-user" cursor="pointer" />
      </header>

      {/* ตัวนี้คือที่ดันเนื้อหาให้ไม่ชน navbar เวลา fixed */}
      {isScrolled && <div style={{ height: "65px" }} />}
    </>
  );
};

export default TopNavbar;
