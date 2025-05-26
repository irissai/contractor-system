import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { IoMdClose } from "react-icons/io"; // ปุ่มปิด
import "./HamburgerMenu.css";

const navItems = [
  { label: "หน้าหลัก", to: "/" },
  { label: "ยื่นคำขอตรวจงาน", to: "/request" },
  { label: "เอกสารเบิกงวด", to: "/document" },
];

export default function HamburgerMenu({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="hamburger-menu-overlay" onClick={onClose}>
      <nav className="hamburger-menu" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close menu">
          <IoMdClose size={28} />
        </button>

        <ul className="nav-list">
          {navItems.map(({ label, to }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
            return (
              <li key={to} className={isActive ? "active" : ""} onClick={onClose}>
                <NavLink to={to} end={to === "/"}>
                  {label}
                </NavLink>
              </li>
            );
          })}
          <li className="logout" onClick={onClose}>
            <NavLink to="/logout">
              <LuLogOut style={{ marginRight: 4 }} />
              ออกจากระบบ
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
