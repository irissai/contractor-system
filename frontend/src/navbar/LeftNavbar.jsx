import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { FiMenu, FiX } from "react-icons/fi";
import "./LeftNavbar.css";

const navItems = [
  { label: "หน้าหลัก", to: "/" },
  { label: "ยื่นคำขอตรวจงาน", to: "/request" },
  { label: "เอกสารเบิกงวด", to: "/document" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sidebar"> 

      <ul className={`nav-list ${isOpen ? "open" : ""}`}>
        {navItems.map(({ label, to }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + "/");
          return (
           <li key={to} className={isActive ? "active" : ""} onClick={closeMenu}>
  <NavLink to={to} end={to === "/"} >
    {label}
  </NavLink>
</li>

          );
        })}
        <li className="logout" onClick={closeMenu}>
          <NavLink to="/logout">
            <LuLogOut style={{ marginRight: 4 }} />
            ออกจากระบบ
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
