import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";  
import "./login.css";
import BASE_URL from "../config/api";

const ContractorLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgColor, setMsgColor] = useState("red");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        const userRes = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
        const userData = await userRes.json();
        console.log("userData", userData);
        setMsgColor("green");
        setMsg("Login successful!");

        navigate("/select-project", { state: { userData: userData } });
      } else {
        setMsgColor("red");
        setMsg(data.error || "Login failed");
      }
    } catch (err) {
      setMsgColor("red");
      setMsg("Error connecting to server");
    }
  };

  return (
    <div className="container-login-first">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: -30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2>ยินดีต้องรับสู่ระบบผู้รับเหมา</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">ชื่อผู้ใช้:</label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">รหัสผ่าน:</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(67, 67, 67, 0.4)" }}
            whileTap={{ scale: 0.95 }}   style={{marginTop:'20px'}}
          >
            Login
          </motion.button>
        </form>

        {msg && (
          <motion.p
            className="msg"
            style={{ color: msgColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {msg}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default ContractorLogin;
