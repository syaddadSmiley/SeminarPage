import React from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import "../style/NavAdmin.css";
// import class from "../assets/images/icons8-class-50.png";
import user from "../assets/images/icons8-user-64.png";
import kelas from "../assets/images/icons8-class-50.png";
import edit from "../assets/images/icons8-edit-30.png";
import pass from "../assets/images/icons8-show-password-64.png";
import out from "../assets/images/icons8-logout-24.png";
import "bootstrap/dist/css/bootstrap.min.css";
// import "boxicons";


import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import Logo from "../assets/images/Logo.svg";
import axios from 'axios';
import RemoveCookie from "../hooks/RemoveCookie";

const name = "name"
// const request = 'http://localhost:8080/api/auth/?email=' + email + '&token=' + token
// axios.get(request)
//   .then(result => {
//     // if (result.data.message == "Success") {
//     //   role = capitalizeFirstLetter(result.data.data.role)
//     //   localStorage.setItem("role", role)
//     // }
//     localStorage.setItem('email', result.data.data.email);
//     localStorage.setItem('id', result.data.data.id);
//     localStorage.setItem('token', result.data.token);
//     localStorage.setItem('name', result.data.data.name);
//   })
//   .catch(error => {
//     if (error.response.data.errors == "token contains an invalid number of segments") {
//       window.location.href = "/login";
//       return null;
//     }
//   })

// return null;
function NavAdmin() {
  const auth = JSON.parse(localStorage.getItem("user-info"));
  const logout = () => {
    localStorage.removeItem("user-info");
    localStorage.removeItem("TOKEN");
    RemoveCookie("token");
    window.location.href = "/login";  
  }
  return (
    <div>
      <section className="nav">
        <section>
          <Navbar collapseOnSelect expand="lg" bg="light" fixed="top" className="nav-default" id="nav-1">
            <Container className="container-nav">
              <Navbar.Brand href="/">
                <img alt="Logo HaloBelajar" src={auth.gambar} width="50" className="d-inline-block align-top" />{" "}
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link href="/home" id="login">
                    Dashboard
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Navbar.Text id="siswa">Halo, Admin {auth.nama}</Navbar.Text>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </section>
      </section>
      <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action list-group-item-dark">
          <div class="image">
            <img alt="" src={auth.gambar} width="100" height="100" />
          </div>
          <br></br>
          <br></br>
          <p>
            {auth.nama.toUpperCase()}
            <br></br>
            {auth.role}
            <br></br>
          </p>
        </a>
        <Link to="/admin/categories" class="list-group-item list-group-item-action list-group-item-dark">
          <div class="image" />
          <img alt="" src={kelas} width="20" height="20" />
          Categories
        </Link>
        <Link to="/admin/seminars" class="list-group-item list-group-item-action list-group-item-dark">
          <div class="image" />
          <img alt="" src={edit} width="20" height="20" />
          Seminars
        </Link>
        <Link to="/ubah-pass" class="list-group-item list-group-item-action list-group-item-dark">
          <div class="image" />
          <img alt="" src={pass} width="20" height="20" />
          Ubah Password
        </Link>
        <Link to="/login" onClick={logout} class="list-group-item list-group-item-action list-group-item-dark">
          <div class="image" />
          <img alt="" src={out} width="20" height="20" />
          Keluar
        </Link>
      </div>
    </div>
  );
}

export default NavAdmin;
