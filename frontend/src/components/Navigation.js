import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom'
import GetCookie from "../hooks/GetCookies";
import jwt_decode from "jwt-decode";
import RemoveCookie from "../hooks/RemoveCookie";

function Navigation() {
    const auth = JSON.parse(localStorage.getItem("user-info"));
    const navigate = useNavigate();
    // const token = GetCookie("token");
    // const claims = jwt_decode(token);
    const logout = () => {
        localStorage.removeItem("user-info");
        localStorage.removeItem("TOKEN");
        RemoveCookie("token");
        window.location.reload();
    }

    return (

        <Navbar collapseOnSelect expand="lg" >
            <Container>
                <Navbar.Brand href="/">SIPALING-RAJIN</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href={'/home'}>Home</Nav.Link>
                        <Nav.Link href={'/tentang'}>Tentang</Nav.Link>
                    </Nav>
                    <Nav>
                        {!auth ?
                            <div className="d-flex">
                                <Nav.Link className="nav-link" href="/login">Login</Nav.Link>
                                {/*<Nav.Link className="nav-link" href="/register">Register</Nav.Link>*/}
                            </div>
                            :
                            <div className="d-flex">
                                {auth.role === "admin" || auth.role === "user" ?

                                    <Nav.Link href="/profile"><img src={auth.gambar} alt="profile pict" className="profile-pict" /> {auth.nama}</Nav.Link>
                                    : 
                                    <Nav.Link href={`/profile/teacher/${auth.id}`}><img src={auth.profile_pict} alt="profile pict" className="profile-pict" /> {auth.name}</Nav.Link>

                                }
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                            </div>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;