import React, { useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import RegisterTeacher from './components/RegisterTeacher'
import Home from './components/Home';
import TeacherDetail from './components/TeacherDetail';
import StudentProfile from './components/StudentProfile'
import PrivateComponent from './components/PrivateComponent'
import LoginTeacher from './components/LoginTeacher'
import TeacherProfile from './components/TeacherProfile'
import NotFound from './components/NotFound';
import Tentang from './components/Tentang';
// import DashboardAdmin from './components/DashboardAdmin';
import AdminCategories from './pages/AdminCategories';
import AdminSeminars from './pages/AdminSeminars';
import DashboardAdmin from './pages/KelasSaya';
import UbahProfil from './components/UbahProfil';
import Dashboard from './components/DashboardAdmin';
import NavAdmin from './components/NavAdmin';
import WishlistAll from './components/WishlistAll'

function App() {

  useEffect(() => {
    document.title = `HALLOGURU`;
  });

  return (

    <div className="App">

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route element={<PrivateComponent />}>
          <Route path="teacher/:id" element={<TeacherDetail />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="profile/teacher/:id" element={<TeacherProfile />} />
          <Route path="wishlist/all" element={<WishlistAll/>} />
          <Route path="admin" element={<DashboardAdmin />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/seminars" element={<AdminSeminars />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="Tentang" element={<Tentang />} />
      </Routes>

    </div >

  )
}
export default App