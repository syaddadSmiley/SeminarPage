import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom'
import GetCookie from "../hooks/GetCookies";
import jwt_decode from "jwt-decode";
import RemoveCookie from "../hooks/RemoveCookie";
import "../style/Navigation.css"
import axios from 'axios'
import { useEffect } from "react";

function Navigation() {
    const auth = JSON.parse(localStorage.getItem("user-info"));
    const navigate = useNavigate();
    const [cardGuru, setCardGuru] = useState([]);
    // const token = GetCookie("token");
    // const claims = jwt_decode(token);
    const logout = () => {
        localStorage.removeItem("user-info");
        localStorage.removeItem("TOKEN");
        RemoveCookie("token");
        window.location.reload();
    }
    const getCardGuruData = async () => {
        try {
            const SW_API_URL = `http://localhost:8008/Wishlist/all/` + auth.id
            const list = await axios.get(SW_API_URL, {
                withCredentials: true,
            });
            setCardGuru(list.data.data)
        } catch (error) {
            console.log('Error', error);
        }
    };

    useEffect(() => {
        getCardGuruData();
    }, []);

    return (

        <Navbar collapseOnSelect expand="lg" >
            <Container>
                <Navbar.Brand href="/">SIPALING-RAJIN</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        {/* <Nav.Link href={'/home'}>Home</Nav.Link>
                        <Nav.Link href={'/tentang'}>Tentang</Nav.Link> */}
                    </Nav>
                    <Nav>
                        {!auth ?
                            <div className="d-flex">
                                {/* <Nav.Link className="nav-link" href="/login">Login</Nav.Link> */}
                                <li class="nav-item ml-md-3">
                                    <a class="btn btn-primary" href="/login"><i class="bx bxs-user-circle mr-1"></i> Log In / Register</a>
                                </li>
                                {/*<Nav.Link className="nav-link" href="/register">Register</Nav.Link>*/}
                            </div>
                            :
                            <div className="nav-bar">
                                {/* {auth.role === "admin" || auth.role === "user" ?

                                    <Nav.Link href="/profile" className="navbar-nav navHome"><img src={auth.gambar} alt="profile pict" className="profile-pict" /> {auth.nama}</Nav.Link>
                                    : 
                                    <Nav.Link href={`/profile/teacher/${auth.id}`}><img src={auth.profile_pict} alt="profile pict" className="profile-pict" /> {auth.name}</Nav.Link>

                                }
                                <Nav.Link href={`/wishlist/all/${auth.id}`} className="navbar-nav navHome">Your Wishlist</Nav.Link>
                                <Nav.Link onClick={logout} className="navbar-nav navHome">Logout</Nav.Link> */}
                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <a id="btnNav-home"class="btn btn-link navHome btnNav-home" href={`/wishlist/all`}><i class="bx bxs-heart icon-single"></i> <span class="badge badge-danger">{cardGuru.length}</span></a>
                                    </li>
                                    <li class="nav-item ml-md-3">
                                        <a id="profileNav-home" class="btn btn-primary navHome" href="/profile"><img src={auth.gambar} alt="profile pict" className="profile-pict" /><i class="bx mr-1"></i> Profile</a>
                                    </li>
                                    <li class="nav-item ml-md-3">
                                        <a id="logoutNav-home" class="btn btn-primary navHome" href="#" onClick={logout}><i class="bx bxs-log-out mr-1"></i> Logout</a>
                                    </li>

                                </ul>
                            </div>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;