import React from "react";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import "../style/Dashboard.css";
// import class from "../assets/images/icons8-class-50.png";
import "bootstrap/dist/css/bootstrap.min.css";
// import "boxicons";
import "../style/NavVideo.css";
import { useNavigate } from 'react-router-dom'
import Nav from "react-bootstrap/Nav";
import SetCookie from "../hooks/SetCookies";
import Navbar from "react-bootstrap/Navbar";
// import Logo from "../assets/images/Logo.svg";

function Dashboard() {
    const navigate = useNavigate();
    const logout = () => {
        SetCookie("token", "");
        localStorage.removeItem("user-info");
        localStorage.removeItem("TOKEN");
        navigate('/home');
    }
    return (
        <section className="dashboard bg-white" style={{ height: "100vh" }}>
            <Container fluid className="h-100">
                <div className="row h-100">
                    {/* sidebar */}
                    <div className="col-md-3 bg-dark pt-4 pb-5">
                        <h2 className="mb-5 text-white">HaloBelajar</h2>
                        <h6 className="mb-3">
                            <Link to="/upload-video" className="text-white text-decoration-none">
                                Upload Video
                            </Link>
                        </h6>
                        <h6 className="mb-5">
                            <Link to="/user" className="text-white text-decoration-none">
                                Welcome, Admin
                            </Link>
                        </h6>

                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </div>

                    {/* content dashboard */}
                    <div className="col-md-9 bg-light pt-4 pb-5 ps-5">
                        <h1>Dashboard Admin</h1>
                        <div>
                            <div className="uploadv">
                                <span class="input-group-text"></span>
                                <div>
                                    {/* <div class="ratio ratio-16x9">
                    <iframe src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allowfullscreen></iframe>
                  </div> */}
                                </div>
                            </div>
                            <div className="container"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default Dashboard;
