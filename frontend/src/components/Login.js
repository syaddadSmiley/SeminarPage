import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import '../style/LoginRegister.css'
import image from '../images/login.svg'
import { useNavigate } from 'react-router-dom'
import Modal from "./Modal";
import useStore from "../store/user";
import SetCookie from "../hooks/SetCookies";
import GetCookie from "../hooks/GetCookies";
import jwt_decode from "jwt-decode";

function Login() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [userErr, setUserErr] = React.useState(false);
    const [passErr, setPassErr] = React.useState(false);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState("");
    const { token, id, name, role, setToken, setId, setName, setRole } = useStore()
    const navigate = useNavigate();

    const handleLogin = async () => {
        //validation
        let aman = true;

        if (username.length === 0) {
            setUserErr(true);
            aman = false;
        } else {
            setUserErr(false);
        }

        if (password.length === 0) {
            setPassErr(true);
            aman = false;
        } else {
            setPassErr(false);
        }

        if (aman) {

            let result = await fetch('http://localhost:8008/Login', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(result.request)
            result = await result.json();
            console.log(result);
            localStorage.setItem("RESULT", JSON.stringify(result));
            //zustand
            setToken(result.token);
            setId(result.id);
            setName(result.name);
            setRole(result.role);

            if (result.code === 200) {
                SetCookie("token", result.token);
                localStorage.setItem("user-info", JSON.stringify(result.data));
                localStorage.setItem("TOKEN", result.token);
                const token = GetCookie("token");
                const claims = jwt_decode(token);
                const role = claims.Role
                console.log(role, claims)
                if (role === "user") {
                    navigate('/')
                }else if(role === "admin"){
                    navigate('/admin')
                }
            } else {
                setModalMessage("Code Error : "+result.code+" | "+result.message);
                setModalShow(true)
            }
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="login-wrapper d-flex">

                <div className="login-left ">
                    <form>
                        <h3>LOGIN</h3>
                        <div className="mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Masukkan username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {userErr ? <span className="warning">Username tidak boleh kosong</span> : ""}
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Masukkan password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passErr ? <span className="warning">Password tidak boleh kosong</span> : ""}

                        </div>

                        <div className="d-grid">
                            <button onClick={handleLogin} type="button" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                        <p className="forgot-password text-right mt-3">

                            Belum memiliki akun?
                        </p>
                        <p className="forgot-password text-right">
                            <a href="/register">Register</a> 
                        </p>
                        <p className="forgot-password text-right">


                        </p>
                    </form>
                </div>

                <div className="login-right">
                    <img src={image} className="align-middle" alt="hallo guru" />
                    <p className="text-justify align-middle">Tempat terpercaya mencari guru private terbaik</p>
                </div>
            </div>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                message={modalMessage}
            />
        </div >
    );
}

export default Login;