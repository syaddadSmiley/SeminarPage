import React, { useEffect } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import Profile from './components/Profile'
import PrivateComponent from './components/PrivateComponent'
import NotFound from './components/NotFound';
import Tentang from './components/Tentang';
// import DashboardAdmin from './components/DashboardAdmin';
import AdminCategories from './pages/AdminCategories';
import AdminSeminars from './pages/AdminSeminars';
import DashboardAdmin from './pages/DashboardAdmin';
import UbahProfil from './components/UbahProfil';
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
          <Route path="teacher/:id" element={<ProductDetail />} />
          <Route path="profile" element={<Profile />} />
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