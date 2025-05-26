import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../src/page/home"
import Request from "../src/page/request"
import RequestForm from "../src/page/requestForm"
import Document from '../src/page/document';
import AttachDocument from '../src/page/attachDocuments';
import Login from '../src/page/login'
import Logout from '../src/page/logout'
import SelectProject from '../src/page/selectProject'
import ProtectedRoute from './ProtectedRoute'; // ที่เก็บไฟล์นี้

function App() {

   return (
    <Router>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* ทุกเส้นทางนี้ต้องล็อกอินก่อน */}
          <Route 
            path="/select-project" 
            element={
              <ProtectedRoute>
                <SelectProject />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/request" 
            element={
              <ProtectedRoute>
                <Request />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/request/form" 
            element={
              <ProtectedRoute>
                <RequestForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/document" 
            element={
              <ProtectedRoute>
                <Document />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/document/:index" 
            element={
              <ProtectedRoute>
                <AttachDocument />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </Router>
  )
}

export default App
