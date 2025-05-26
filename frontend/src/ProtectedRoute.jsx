import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // ถ้าไม่มี token ให้ redirect ไปหน้า login
    return <Navigate to="/login" replace />;
  }

  // ถ้ามี token ให้แสดงหน้าที่อยู่ภายใน
  return children;
};

export default ProtectedRoute;
