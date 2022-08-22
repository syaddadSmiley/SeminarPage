import React, { useState } from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../style/LoginRegister.css'
import '../App.css'
import image from '../images/register.svg'
import { useNavigate } from 'react-router-dom'
import Modal from "./Modal";




export default function Register() {
    const [passwordType, setPasswordType] = useState("password");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    const [confirmPassword, setConfirmPassword] = useState("");
    const [nama, setNama] = useState("")
    const [mail, setMail] = useState("");
    const [no_hp, setNo_hp] = useState("");
    const [role, setRole] = useState("user");
    const [modalShow, setModalShow] = useState(false);
    const [modalMessage, setModalMessage] = useState("Register Berhasil, Silahkan Login terlebih dahulu untuk melanjutkan.");

    const [namaErr, setNamaErr] = useState(false);
    const [namaMsg, setNamaMsg] = useState("");
    const [userErr, setUserErr] = useState(false);
    const [alamatErr, setMailErr] = useState(false);
    const [noHPErr, setNoHPErr] = useState(false);
    const [passErr, setPassErr] = useState(false);
    const [passMsg, setPassMsg] = useState("");
    const [confirmPassErr, setConfirmPassErr] = useState(false);
    const navigate = useNavigate();

    

    async function collectData() {
        //validation
        let aman = true;
        const regexFalseName = /^[a-zA-Z ]+$/;
        if (nama.length === 0) {
            setNamaErr(true);
            setNamaMsg("Nama tidak boleh kosong");
            aman = false;
        } else if (/^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/.test(nama.trim()) === false) {
            setNamaErr(true);
            setNamaMsg("Nama tidak valid");
            aman = false;
        }else {
            setNamaErr(false);
        }

        if (username.length <= 3) {
            setUserErr(true);
            aman = false;
        } else {
            setUserErr(false);
        }

        if (mail.length === 0) {
            setMailErr(true);
            aman = false;
        } else if (!mail.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
            setMailErr(true);
            aman = false;
        }else {
            setMailErr(false);
        }

        if (password.length <= 7) {
            setPassErr(true)
            setPassMsg("Password harus lebih dari 7 karakter")
            aman = false;
        } else if (/^(?=.*[a-z])(?=.*[A-Z])/.test(password) == false){
            setPassErr(true)
            setPassMsg("Password setidak nya harus mengandung 1 huruf kecil dan 1 huruf besar")
            aman = false;
        } else if (/^(?=.*[0-9])/.test(password) == false){
            setPassErr(true)
            setPassMsg("Password setidak nya harus mengandung 1 angka")
            aman = false;
        } else {
            setPassErr(false)
        }

        if (confirmPassword !== password) {
            setConfirmPassErr(true);
            aman = false;
        } else {
            setConfirmPassErr(false);
        }

        if (aman) {
            let item = { username, password, nama, mail, no_hp, role };
            console.warn(item)

            let result = await fetch('http://localhost:8008/Register', {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            result = await result.json();

            if (result.data) {
                console.log(result.data)
                setModalShow(true);
                setUsername("");
                setNama("");
                setMail("")
                setPassword("")
                setNo_hp("")
            }

        }

    }

    return (
        <div className="auth-wrapper" >

            <div className='register-wrapper d-flex'>
                <div className="register-right">
                    <img src={image} className="align-middle" />
                    <p className="text-justify align-middle">Tempat terpercaya mencari guru private terbaik</p>
                </div>
                <div className="register-left">
                    <form>
                        <h3>Register</h3>
                        <div className="mb-3">
                            <label>Nama</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Masukkan Nama"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                            />
                            {namaErr ? <span className="warning">{namaMsg}</span> : ""}

                        </div>
                        <div className="mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username minimal 4 karakter"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {userErr ? <span className="warning">Username minimal 4 karakter</span> : ""}
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Masukkan Email"
                                value={mail}
                                onChange={(e) => setMail(e.target.value)}
                            />
                            {alamatErr ? <span className="warning">Invalid Input Email</span> : ""}

                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type={passwordType}
                                className="form-control"
                                placeholder="Password minimal 8 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passErr ? <span className="warning">{passMsg}</span> : ""}
                            {/* <button className="btn btn-outline-primary" onClick={togglePassword()}></button> */}
                        </div>
                        <div className="mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Konfirmasi Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {confirmPassErr ? <span className="warning">Password tidak sama</span> : ""}
                        </div>
                        <input
                            type="hidden"
                            value={role}
                        />
                        <div className="d-grid">
                            <button type="button" onClick={collectData} className="btn btn-primary">
                                Sign Up
                            </button>
                        </div>
                        <p className="forgot-password text-right">
                            Sudah memiliki akun? <a href="/login">Login</a>
                        </p>
                    </form>
                </div>
            </div>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                message={modalMessage}
            />
        </div>
    )

}